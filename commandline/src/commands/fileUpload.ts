import fs from "fs";
import path from "path";
import mime from "mime-types";
import { api } from "../utils/apiClient.js";
import axios from "axios";
import cliProgress from "cli-progress";
import ora from "ora";
import chalk from "chalk";

export const fileUpload = async (filePath: string) => {

  const absPath = path.resolve(filePath);

  if (!fs.existsSync(absPath)) {
    console.log(chalk.red("❌ File not found:"), absPath);
    return;
  }

  const meta = fs.statSync(absPath);

  const file_name = path.basename(absPath);
  const file_size = meta.size;
  const file_type = mime.lookup(absPath) || "application/octet-stream";

  console.log(chalk.cyan(`\nUploading: ${file_name}\n`));

  const spinner = ora({
    text: chalk.yellow("Requesting upload URL..."),
    spinner: "dots"
  }).start();

  const res = await api.post("/s3/fetchUrl", {
    file_name,
    file_type,
    file_size
  });

  spinner.succeed(chalk.green("Upload URL received"));

  const fileStream = fs.createReadStream(absPath);

  const progressBar = new cliProgress.SingleBar(
    {
      format:
        chalk.green("Uploading") +
        " |{bar}| {percentage}% || {value}/{total} bytes",
      barCompleteChar: "█",
      barIncompleteChar: "░"
    },
    cliProgress.Presets.shades_classic
  );

  progressBar.start(file_size, 0);

  let uploadedBytes = 0;

  fileStream.on("data", (chunk) => {
    uploadedBytes += chunk.length;
    progressBar.update(uploadedBytes);
  });

  try {

    await axios.put(res.url, fileStream, {
      headers: {
        "Content-Type": file_type,
        "Content-Length": file_size,
        "x-amz-server-side-encryption": "AES256"
      }
    });

    progressBar.stop();

    console.log(chalk.green.bold("\n✔ Upload complete 🚀\n"));

  } catch (err) {

    progressBar.stop();
    console.log(chalk.red("\n❌ Upload failed\n"));
  }
};

export const folderUpload = async (dirPath: string) => {

  console.log(chalk.cyan(`\nScanning folder: ${dirPath}\n`));

  const spinner = ora("Preparing files...").start();

  try {

    const files = await uploadDir(dirPath);

    spinner.succeed(`${files.length} files discovered`);

    const presigned = await api.post("/s3/fetchBulkUrl", files);

    console.log(chalk.yellow(`Uploading ${files.length} files...\n`));

    let uploaded = 0;

    await Promise.all(
      presigned.url.map(async (urlObj: any) => {

        const base_name = path.basename(dirPath);
        const relative = urlObj.filename.substring(base_name.length + 1);
        const absolute = path.join(dirPath, relative);

        const stream = fs.createReadStream(absolute);

        await axios.put(urlObj.url, stream, {
          headers: {
            "Content-Type": urlObj.fileType,
            "Content-Length": urlObj.size
          }
        });

        uploaded++;

        console.log(
          chalk.green(`✔ Uploaded (${uploaded}/${files.length})`),
          chalk.gray(urlObj.filename)
        );
      })
    );

    console.log(chalk.green.bold("\n🎉 Folder upload completed\n"));

  } catch (error) {

    spinner.fail("Upload failed");

    console.log(
      chalk.red("❌ Couldn't upload folder. Please try again.")
    );
  }
};

const uploadDir = async (dirPath: string, base = "") => {

  const entries = await fs.promises.readdir(dirPath);

  let files: any[] = [];

  await Promise.all(
    entries.map(async (name) => {

      const abs = path.join(dirPath, name);
      const stat = await fs.promises.stat(abs);

      const relPath = base ? `${base}/${name}` : `${path.basename(dirPath)}/${name}`;

      if (stat.isFile()) {

        const file_type =
          mime.lookup(abs) || "application/octet-stream";

        files.push({
          file_name: relPath,
          file_size: stat.size,
          file_type
        });

      } else if (stat.isDirectory()) {

        const nested = await uploadDir(abs, relPath);
        files.push(...nested);
      }
    })
  );

  return files;
};
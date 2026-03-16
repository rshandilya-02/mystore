import { api } from "../utils/apiClient.js";
import Table from "cli-table3";
import chalk from "chalk";
import ora from "ora";
import gradient from "gradient-string";

export async function fetchFiles() {

    console.log(
        gradient.atlas("\n📂 MyDrive Files\n")
    );

    const spinner = ora({
        text: chalk.cyan("Fetching files from cloud..."),
        spinner: "dots"
    }).start();

    const table = new Table({
        head: [
            chalk.cyan.bold("File Name"),
            chalk.magenta.bold("Type"),
            chalk.blue.bold("Size"),
            chalk.gray.bold("Created At")
        ],
        colWidths: [35, 15, 12, 28],
        wordWrap: true
    });

    try {

        const url = "/s3/fetchList";
        const response = await api.get(url);

        spinner.succeed(chalk.green("Files fetched successfully"));

        if (!response.files || response.files.length === 0) {
            console.log(chalk.yellow("\nNo files found in your drive.\n"));
            return;
        }

        response.files.forEach((file: any) => {

            const sizeKB = (file.size / 1024).toFixed(2) + " KB";

            const formattedDate = new Date(file.createdAt)
                .toLocaleString();

            const icon =
                file.file_type === "folder"
                    ? "📁"
                    : "📄";

            table.push([
                chalk.green(`${icon} ${file.file_original_name}`),
                chalk.magenta(file.file_type),
                chalk.blue(sizeKB),
                chalk.gray(formattedDate)
            ]);
        });

        console.log("\n" + table.toString() + "\n");

    } catch (error) {

        spinner.fail(chalk.red("Error fetching files"));

        console.error(
            chalk.red("Something went wrong while fetching files.")
        );
    }
}
import { Command } from "commander";
import figlet from "figlet";

import { login } from "./commands/login.js";
import { fetchFiles } from "./commands/fetchFiles.js";
import { fileUpload, folderUpload } from "./commands/fileUpload.js";

console.log(figlet.textSync("myDrive"));

const program = new Command();

program
  .name("mydrive")
  .description("CLI for myDrive")
  .version("1.0.0");

program
  .command("login")
  .description("Login to MyDrive")
  .action(login);

program
    .command("listFiles")
    .description("List your files")
    .action(fetchFiles);

program
    .command("upload <filePath>")
    .description("Upload your files")
    .option("-d --dir","Upload a directory")
    .action((path,option) => {
      if(option.dir) {
        folderUpload(path);
      }else {
        fileUpload(path);
      }
    })

program.parse();
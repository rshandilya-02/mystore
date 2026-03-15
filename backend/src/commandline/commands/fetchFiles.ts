import { api } from "../utils/apiClient.js";
import Table from "cli-table3";
import chalk from "chalk";

export async function fetchFiles() {

    const table = new Table({
        head: [
            chalk.cyan.bold("File Name"),
            chalk.cyan.bold("Type"),
            chalk.cyan.bold("Size"),
            chalk.cyan.bold("Created At")
        ],
        colWidths: [35, 15, 12, 28],
        style: {
            head: [],
            border: []
        }
    });

    try {

        const url = "/s3/fetchList";
        const response = await api.get(url);

        console.log(chalk.green("\n✔ Files fetched successfully\n"));

        response.files.forEach((file:any) => {

            const sizeKB = (file.size / 1024).toFixed(2) + " KB";

            const formattedDate = new Date(file.createdAt)
                .toLocaleString();

            table.push([
                chalk.green(file.file_original_name),
                chalk.magenta(file.file_type),
                chalk.blue(sizeKB),
                chalk.gray(formattedDate)
            ]);
        });

        // console.log(table.toString());

    } catch (error) {

        console.error(chalk.red("❌ Error fetching files"));
        console.error(error);

    }
}
import { api } from "../utils/apiClient.js";
import { saveToken } from "../utils/config.js";
import open from "open";
import ora, { type Color } from "ora";
import chalk from "chalk";
import boxen from 'boxen';



export async function login() {

    const spinner = ora({
        text: chalk.cyan("Requesting device authorization..."),
        spinner: "dots"
    }).start();

    const response = await fetch(
        "https://mystore-3-7114.onrender.com/api/v1/auth/cli/getCliToken"
    );

    const data = await response.json();

    spinner.succeed(chalk.green("Device authorization received"));

    const device_code = data.deviceId;
    const user_code = data.userCode;
    const verification_url = data.verificationUrl;

   console.log(
  boxen(
    chalk.bold.cyan(user_code),
    {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "yellow",
      title: "Verification Code",
      titleAlignment: "center"
    }
  )
);
    console.log("Open:", verification_url);

    console.log(chalk.gray("Opening browser for verification..."));

    await open(verification_url);

    const url = "/auth/cli/verification";

  const spinner1 = ora("Waiting for authentication...").start();

    const colors:Color[] = ["yellow", "cyan", "magenta", "green"];

let index = 0;

    while (index < 25) {

        // const response = await fetch(url,{
        //     method:"POST",
        //     headers:{
        //         "Content-Type":"application/json"
        //     },
        //     body:JSON.stringify({
        //         device_code
        //     })
        // });

      spinner1.color = colors[index % colors.length] ?? "cyan";

        const response = await api.post(url,{device_code});


        const data = response;

        if(data.verified){

               spinner1.succeed("Login successful!");

            saveToken(data.token);

            spinner.succeed("Done");

            return;
        }

        index++;

        await new Promise(r => setTimeout(r,5000));
    }

     spinner1.fail(chalk.red("Login timeout. Please try again."));
}
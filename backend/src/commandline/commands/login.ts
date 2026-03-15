import { api } from "../utils/apiClient.js";
import { saveToken } from "../utils/config.js";
import open from "open";

export async function login() {

    const response = await fetch(
        "http://localhost:4000/api/v1/auth/cli/getCliToken"
    );

    const data = await response.json();

    const device_code = data.deviceId;
    const user_code = data.userCode;
    const verification_url = data.verificationUrl;

    console.log("User code:", user_code);
    console.log("Open:", verification_url);

    await open(verification_url);
    console.log("after open");

    const url = "/auth/cli/verification";

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

        const response = await api.post(url,{device_code});


        const data = response;

        if(data.verified){

            saveToken(data.token);

            console.log("Login successful!");

            return;
        }

        index++;

        await new Promise(r => setTimeout(r,5000));
    }

    console.log("Login timeout");
}
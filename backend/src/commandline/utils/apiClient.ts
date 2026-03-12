import { getToken } from "./config.js";


const BASE_URL = "http://localhost:4000/api/v1";

async function request(endpoint: string,options: any  = {}) {

    const token = getToken();

    console.log("this is token ",token);

    const headers = {
        "Content-Type": "application/json",
        ...(token && {authorization: `Bearer ${token}`}),
        ...options.headers
    };

    const response = await fetch(`${BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    // console.log("real response is ",response);
    if(response.status === 401) {
        console.log("You are not logged in. Run:");
        console.log("mydrive --login");
        process.exit(1);
    };

    return response.json();

};

export const api = {
    get(endpoint: string) {
        return request(endpoint,{method: "GET"})
    },
    post(endpoint: string , body: any) {
        console.log("body is ",body);
        return request(endpoint,{
            method: "POST",
            body: JSON.stringify(body)
        })
    }
}
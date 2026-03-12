"use client";

import axios from "axios";
import { useState } from "react"
import { useSearchParams } from "next/navigation";

export default function CliLogin() {

    const url = 'http://localhost:4000/api/v1/auth/cli/authenticate';

    const searchParams = useSearchParams();

    const deviceId = searchParams.get('deviceId');

    const [code,setCode] = useState('');

    const handleClick = async() => {
        console.log("handle click ");
        const response = await axios.post(url,{
            device_code : deviceId,
            user_code: code
        },
    {
        withCredentials:true
    });
   
    console.log("rsponse is ",response);
    }

    return <div>
        Hello world
        <div>
            <input type="text" placeholder="usercode" onChange={(e) => setCode(e.target.value)}></input>
            <button onClick={handleClick}>submit</button>
        </div>
    </div>
}
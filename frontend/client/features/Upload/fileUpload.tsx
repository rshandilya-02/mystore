"use client";

import { useState } from "react";
import axios from "axios";
import { UPLOAD_URL } from "@/services/api";

export default function FileUpload () {

    const [file,setFile] = useState<File>();

    const handleUpload = async(e:React.ChangeEvent<HTMLInputElement>) => {
        console.log('event is ',e);
        console.log('files',e.target.files)
        const files = e.target.files;
        if(!files) {
            console.log('file not uploaded');
            return ; 
        }
        const file_ = files[0];

        setFile(file_);
        
        console.log(await file_.arrayBuffer())
    };

    const handleSubmit = async() => {
        // const {file_name,file_type,file_size=0}  = data;
        if(!file || !file.type) {
            return ; 
        }
        try {
        const file_name = file?.name;
        const file_type = file?.type;
        const file_size = file?.size;
        const token = localStorage.getItem("mydrive_token");
        if(!token) {
            alert("token not found");
            return ; 
        }

        const presigned_url = await axios.post(UPLOAD_URL,{
            file_name,
            file_type,
            file_size
        },{
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
        console.log('presigned url ',presigned_url);
        const url = presigned_url?.data.url;

        if(!url) {
            console.log('url not available');
            return ; 
        }

        const file_upload = await axios.put(url,file,{
            headers: {
                "Content-Type":file.type
            }
        });

        console.log("file_upload ",file_upload);
    }catch(error){
        console.error(error);
        console
    }

    }

    return (<div>
            <div>upload your file</div>
            <div> 
                <input type="file" onChange={handleUpload} />
                <button onClick={handleSubmit}>Upload File</button>
            </div>
    </div>)
}
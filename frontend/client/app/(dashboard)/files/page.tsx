"use client";

import { FILE_LIST } from '@/services/api';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import {columns} from './columns.tsx'


export default function FileList() {

    const [files,setFiles] = useState<any[]>([]);
    
    useEffect(()=>{
        const fetchFiles = async() => {
        try{
            console.log("file fetching");
            const token = localStorage.getItem("mydrive_token");
            const files = await axios.get(FILE_LIST,{
                headers:{
                    "authorization":`Bearer ${token}`
                },
                withCredentials:true
            });
            setFiles(files.data.files);
            console.log("corresponding files are ",files);

        }catch(error){
            console.log("erorr occured during file fetching",error);
        }
    };
    fetchFiles();
    },[])

    return <div>
        <div>
            <p className="font-bold text-xl">Your files</p>
            {files && <DataTable columns={columns} data={files}></DataTable>}
        </div>
    </div>
}
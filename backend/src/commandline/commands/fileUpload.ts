import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { api } from '../utils/apiClient.js';
import { Readable } from 'stream';
import axios from 'axios';
import cliProgress from 'cli-progress';


export const fileUpload = async(filePath:string) => {

    const url = '/s3/fetchUrl';

    

    //get absolute path first 

    const absPath  = path.resolve(filePath);

    //read from the path 
    const fileStream = fs.createReadStream(absPath);
    if (!fs.existsSync(absPath)) {
  console.error("File not found:", absPath);
  return;
}

    const file_metaData = fs.statSync(absPath);


    //file data to send 
    
    const file_name = path.basename(absPath);
    const file_size = file_metaData.size;
    const file_type = mime.lookup(absPath) || "application/octet-stream"; 
    const create_date = file_metaData.birthtime;


    //progress bar 

    const progressBar = new cliProgress.SingleBar({
        format: "Uploading [{bar}] {percentage}% | {value}/{total} bytes"
    }, cliProgress.Presets.shades_classic);

    progressBar.start(file_size, 0);

    let uploadedBytes = 0;

    // fileStream.on("data", (chunk) => {
    //     uploadedBytes += chunk.length;
    //     progressBar.update(uploadedBytes);
    // });

    const res = await api.post(url,{
        file_name:file_name,
        file_type: file_type,
        file_size: file_size
    });

    fileStream.on("data", (chunk) => {
        uploadedBytes += chunk.length;
        progressBar.update(uploadedBytes);
    });

    // console.log("response is ",res);

    // const p_url = res.url ; 
    // console.log("p url is ",p_url);

//     const filePushTos3 = await fetch(res.url, {
//     method: "PUT",
//     body:fileStream as any,
//     headers: {
//         "Content-Type": file_type
//     },
//     duplex:"half"
// } as any);



try {
  const filePushTos3 = await axios.put(res.url, fileStream, {
    headers: {
      "Content-Type": file_type,
      "Content-Length": file_size
    }
  });

  progressBar.stop();
  console.log("Upload complete 🛸");

} catch (err) {
  progressBar.stop();
  console.error("Upload failed ❌", err);
}

// console.log("file Push to S3", filePushTos3.status);
// console.log("file Push to S3 ",filePushTos3);
    
    
    // console.log("file_metaData ",file_metaData);
    // console.log("created Data ",create_date);
    return ; 

}
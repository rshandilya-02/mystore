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

//   earlier commented code 
//     console.log("response is ",res);

//     const p_url = res.url ; 
//     console.log("p url is ",p_url);

//     const filePushTos3 = await fetch(res.url, {
//     method: "PUT",
//     body:fileStream as any,
//     headers: {
//         "Content-Type": file_type
//     },
//     duplex:"half"
// } as any);
// commented code end 



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

};

export const folderUpload = async(dirPath: string) => {
  let index = 0 ; 

  let files:any = [];

  try {

  const res = await uploadDir(dirPath);
  console.log('response is f ',res);

  const presigned_url = await api.post('/s3/fetchBulkUrl',res);

  console.log("presigned ulr is ", presigned_url);

  const base_name = path.basename(dirPath);

  await Promise.all(presigned_url.url.map(async(urlObj: any)=>{
    console.log("file_name ",urlObj);
    const {filename,url} = urlObj;

   console.log("sub filename ",filename ,base_name);

    // const absolute_path = dirPath+filename.substring(base_name.length);

    const relative = filename.substring(base_name.length + 1);
    const absolute_path = path.join(dirPath, relative);

    console.log("absolute path to read file data ",absolute_path);

    const data = fs.createReadStream(absolute_path);

    // const data = await fs.promises.readFile(absolute_path);
    

    // console.log("url obj file_size ",urlObj);

    const filePushTos3 = await axios.put(url, data, {
    headers: {
      "Content-Type": urlObj.fileType,
      "Content-Length": urlObj.size
    }
  });


  // console.log(filePushTos3.data);
})
);
console.log("folder uploaded 😎");
  }catch(error){
    console.log("couldn't upload file , please try again ");
  }


};



const uploadDir  = async(dirPath:string,original_base_name="") => {

  //need file_names of each particular file 


  /*

    pictures
        2025
          a.jpg
        b.jpg
        c.jpg


        
        pictures/2025/a.jpg
        pictures/b.jpg
        ----------------------------------------------------
        pictures/c.jpg
        */

     const res = await fs.promises.readdir(dirPath);

     console.log("dir path is ",dirPath);

    //  console.log("responsen is " ,res);

     let files:any[] = [];

     
     await Promise.all(res.map(async(fname)=>{
       const absolute_file_path = path.join(dirPath,fname);
       
       
       const base_name = path.basename(dirPath);
       
       console.log(' base name is ',base_name);
       console.log('original base name ',original_base_name);
       
       let stat = await fs.promises.stat(absolute_file_path);
       if(stat.isFile()) {
         
        // ,file_size:stat.size,file_type:

        const file_size=stat.size;
        const file_type = mime.lookup(absolute_file_path) || 'application/octet-stream';
        //files , so push into files ,
        if(original_base_name.length>0) 
        files.push({file_name:original_base_name+"\\"+fname,file_size:file_size,file_type:file_type});
      else files.push({file_name:base_name+"\\"+fname,file_size:file_size,file_type:file_type});


      } else if(stat.isDirectory()) {

        //if directory , recursion to fetch file names 
        const relPath = original_base_name.length>0?original_base_name+"\\"+fname: base_name+"\\"+fname;
        console.log("real path ",relPath);
        console.log("absolute path ",absolute_file_path);
        const data = await uploadDir(absolute_file_path,relPath);
        files.push(...data);

      }

     })
    )

     return files;

}




// see this , C:\Users\shand\Downloads
//file path , C:\Users\shand\Downloads\profies

//needed Downloads\profiles



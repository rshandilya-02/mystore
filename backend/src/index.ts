import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from './routers/auth.route.js';
import {S3Client,ListBucketsCommand, PutObjectCommand} from '@aws-sdk/client-s3'
import { s3Router } from './routers/s3.route.js';




//cli modifications 


dotenv.config();

const app = express();
app.use(cookieParser());

const server_url=process.env.SERVER_URL;

console.log("server_url ",server_url);

app.use(cors({
  origin: server_url,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

const secretAccessKey = process.env.SECRET_ACCESS_KEY!;
const accessKeyId = process.env.ACCESS_KEY!;

// async function testBucket() {
//     const client = new S3Client(
//         {
//             region:"eu-north-1",
//             credentials:{
//                 secretAccessKey: secretAccessKey,
//                 accessKeyId: accessKeyId
//             }
//         }
//     );
//     console.log('client is ',client);
//     // const input = {
//     // Bucket: "examplebucket",
//     // Key: "SampleFile.txt",
//     // Range: "bytes=0-9"
//     // };

//     //put an object into s3 bucket 
//     const response = await client.send(
//         new PutObjectCommand({
//             Bucket: "test.bucket.rshandilya",
//             Key: "image.txt",
//             Body: "hello all "
//         })
//     ); 
//     console.log('response is ',response)
// };

// testBucket();

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/s3',s3Router);

const port = process.env.PORT || 4000;

app.get("/health",(req,res)=>{
    return res.status(200).json({
        message: "healthy"
    })
})
app.listen(port,() => console.log(`server started at port ${port}`));


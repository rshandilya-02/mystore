import { S3Client, ListBucketsCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const accessKeyId = process.env.ACCESS_KEY;
const region = process.env.REGION;
const client = new S3Client({
    region: region,
    credentials: {
        secretAccessKey: secretAccessKey,
        accessKeyId: accessKeyId
    },
});
export default client;
//# sourceMappingURL=s3.service.js.map
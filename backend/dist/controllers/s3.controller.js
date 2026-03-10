import {} from "express";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import client from "../services/s3.service.js";
import { prisma } from "../lib/prisma.js";
const getObject = async (req, res) => {
    // const data = req.body ; 
    const userId = req.userId;
    const { id } = req.body;
    console.log('this is getObject userId and id ', userId, id);
    if (!userId || !id) {
        return res.status(200).json({
            message: "missing userId"
        });
    }
    try {
        const checkUser = await prisma.file.findFirst({
            where: {
                userId: userId,
                id: id
            }
        });
        if (!checkUser) {
            return res.status(200).json({
                message: "invalid credentials or file name incorrect"
            });
        }
        ;
        const input = {
            Bucket: process.env.BUCKET_NAME, // required
            Key: checkUser?.storage_key, // required
        };
        const command = new GetObjectCommand(input);
        const url = await getSignedUrl(client, command, { expiresIn: 3600 });
        console.log('this is generated url ', url);
        return res.status(200).json({
            message: "presigned url fetched",
            url: url
        });
    }
    catch (error) {
        console.log('error message is ', error);
        console.error(error);
    }
};
const putObject = async (req, res) => {
    const data = req.body;
    const { file_name, file_type, file_size = 0 } = data;
    const key = file_name;
    const bucket_name = process.env.BUCKET_NAME;
    //create db request
    const storageKey = Math.random().toString() + key;
    const input = {
        Bucket: bucket_name,
        Key: storageKey, // required
        ContentType: file_type
    };
    const userId = req.userId;
    const command = new PutObjectCommand(input);
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    console.log('ready to hit db', input);
    const dbEntry = await prisma.file.create({
        data: {
            file_original_name: file_name,
            file_type: file_type,
            size: file_size,
            storage_key: storageKey,
            userId: userId
        }
    });
    // return url;
    console.log('db entry is ', dbEntry);
    console.log('put url is ', url);
    return res.status(200).json({
        message: "presigned url fetched",
        url: url
    });
};
const deleteObject = async (req, res) => {
    const userId = req.userId;
    const { id } = req.body;
    try {
        if (!userId || !id) {
            return res.status(403).json({
                message: " invalid credentials to delete object"
            });
        }
        const reqObject = await prisma.file.findFirst({
            where: {
                userId: userId,
                id: id
            }
        });
        if (!reqObject)
            return res.status(403).json({
                message: "unauthorized access"
            });
        const storage_key = reqObject.storage_key;
        const input = {
            Bucket: process.env.BUCKET_NAME,
            Key: storage_key
        };
        const command = new DeleteObjectCommand(input);
        const response = await client.send(command);
        await prisma.file.delete({
            where: { id }
        });
        return res.status(200).json({
            message: "file successfully deleted"
        });
    }
    catch (error) {
        console.error(error);
        return res.status(502).json({
            message: "server error while deletion"
        });
    }
};
const fetchList = async (req, res) => {
    const userId = req.userId;
    try {
        const fetchFiles = await prisma.file.findMany({
            where: {
                userId: userId
            }
        });
        const filteredList = fetchFiles.map((file) => {
            const { storage_key, ...safeFile } = file;
            return safeFile;
        });
        return res.status(200).json({
            message: "files fetched successfully",
            files: filteredList
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "server error during deletion "
        });
    }
};
export { putObject, fetchList, getObject, deleteObject };
//# sourceMappingURL=s3.controller.js.map
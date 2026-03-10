import { type Request,type Response } from "express";
import bcrypt from 'bcrypt';
import { prisma } from "../lib/prisma.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto'

dotenv.config();

interface RegisterBody {
    email: string,
    password: string,
    confirmPassword: string
}

const register = async(req:Request,res:Response) => {
    const data = req.body; 
    console.log(data);
    if (!data) {
       return res.status(501).json({
        message: "missing credentials to register"
       })
    }; 

    const {email,password,confirmPassword}:RegisterBody = data; 

    if (!email || !password || !confirmPassword || password !==confirmPassword) {
        return res.status(501).json({
            message: "invalid credentials"
        })
    }; 

    try{

    const checkUser = await prisma.user.findUnique({
        where:{
            email:email
        }
    });

    if (checkUser) {
        return res.status(504).json({
            message:"user already exists"
        })
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password,saltRounds);


    const user = await prisma.user.create({
        data:{
            email:email,
            password: hashedPassword
        }
    });
    
    const {password:_,...safeUser} = user;

    return res.status(200).json({
        message: "user registered successfully" ,
        data:safeUser
    })
}catch(error) {
    return res.status(503).json({
        message:"registration failed"
    })
};

}

const login = async(req:Request,res:Response) => {
    console.log("inside login ");
    const data = req.body ; 
    if(!data || !data.email || !data.password) {
        return res.status(501).json({
            message: "missing credentials"
        })
    };
    
    const {email,password}:{email:string,password:string} = data;

    try {
        const user = await prisma.user.findUnique({
           where: { 
            email:email,
           }
        }); 

        if(!user) {
            return res.status(502).json({
                message: "no user available"
            });
        }
        const fetchedPassword = user.password;
        const verify =  await bcrypt.compare(password,fetchedPassword);
        if(!verify) 
        {
            return res.status(502).json({
                message:"invalid credentials"
            })
        };

        const options = {
            id: user.id,
            email: user.email
        };

        const secret:string = process.env.JWT_SECRET!;
        const token = await jwt.sign(options,secret);

        res.cookie('token',token,{httpOnly:true});

        return res.status(200).json({
            message: "loggedin successfully",
            token:token
        })

    }catch(error){
        return res.status(501).json({
            message: "error during signin"
        })
    }
}

const cliLogin = async(req:Request,res:Response) => {
    

    try {

        //db call and set verified set to true
        const deviceId = crypto.randomUUID();
        console.log("generated uuid ",deviceId);
    
        const userId = crypto.randomUUID();
        console.log("generate userId ",userId);
        
        //generate userId 
    
        const verificationUrl = `http://localhost:3000/authentication?deviceId=${deviceId}`;

        const expiryDate = new Date(Date.now()+5*60*1000);

        const data = await prisma.cliAuth.create({
            data: {
                device_code:deviceId,
                user_code: userId,
                verified: false,
                expiryDate: expiryDate,
                token: ''
            }
        });

        console.log("data is ",data);
       

        return res.status(200).json({
            message: " cli code sent back ",
            deviceId: deviceId,
            userCode: userId,
            verificationUrl: verificationUrl
        });

    } catch(error) {
        console.log("error occured to cli Login");
        return res.status(503).json({
            message: "error occured during token cli Login"
        })
    }   

}


const validateCli = async(req:Request,res:Response) => {

    try {

    //this device_code should be fetched from query_params to body 
    const {device_code,user_code}:{device_code:string,user_code:string} = req.body;
    console.log("this is validata cli ",device_code,user_code);
    const id = req.userId;
    if(!device_code || !user_code || !id) 
    {
        return res.status(403).json({
            message:"missing authentication code"
        })
    };

    const data = await prisma.cliAuth.findFirst({
        where:{
            device_code:device_code
        }
    });

    const original_user_code = data?.user_code;

    if(!original_user_code || user_code !== original_user_code) 
        return res.status(403).json({
            message: "code mismatch"
    });

    const options = {
            id: id,
        };

    const secret:string = process.env.JWT_SECRET!;
    const token = await jwt.sign(options,secret);

    await prisma.cliAuth.update({
           where:{
            device_code:device_code
           },
           data: {
            verified:true,
            token:token,
            expiryDate:new Date(Date.now()+10*60*1000)
           }
        });

    return res.status(200).json({
        message:"cli validated",
        token:token
    });

    }catch(error){
        console.log("error during validateCli");
        return res.status(503).json({
            message:"error during cli authentication"
        })
    }
};


const CheckVerification = async(req:Request,res:Response) => {
    
    console.log("res body ",req.body);

    // console.log("request is ",req);
    const {device_code} = req.body;

    try {

        const data = await prisma.cliAuth.findFirst({
            where:{
                device_code:device_code
            }
        });

        if(data?.verified){
            return res.status(200).json({
                verified: true,
                token: data.token
            })
        };

        return res.status(201).json({
            verified:false,
            token:null
        })

    }catch(error) {
        console.error(error);
        return res.status(302).json({
            message: "verification error"
        })
    }
}

export {register,login,cliLogin,validateCli,CheckVerification};
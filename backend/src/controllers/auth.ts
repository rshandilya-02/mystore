import { type Request,type Response } from "express";
import bcrypt from 'bcrypt';
import { prisma } from "../lib/prisma.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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

export {register,login};
import {} from "express";
import jwt, {} from 'jsonwebtoken';
import dotenv from 'dotenv';
import { isPropertyAccessChain } from "typescript";
dotenv.config();
const auth = async (req, res, next) => {
    // const auth_key = req.headers['authorization'] || '';
    // if(auth_key.length<=0) return ; 
    // const token = auth_key.split(' ')[1] || '';
    console.log("this is req cookies ", req.cookies);
    const token = req.cookies.token;
    console.log("cookies token is ", token);
    if (!token)
        return;
    const JWT_SECRET = process.env.JWT_SECRET;
    const check = jwt.verify(token, JWT_SECRET);
    console.log('this is check ', check);
    const payloadId = check.id;
    req.userId = payloadId.toString();
    console.log('this is userId ', payloadId);
    next();
};
export { auth };
//# sourceMappingURL=auth.middleware.js.map
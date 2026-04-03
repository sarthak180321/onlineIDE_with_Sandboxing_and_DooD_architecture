import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
export interface AuthRequest extends Request{
    userID?:string,
    containerID?:string
}

interface JWTPayload {
    userId: string;
    containerId: string;
}

export const protect=(req:AuthRequest,res:Response,next:NextFunction):void=>{
    const token=req.headers.authorization?.split(' ')[1];
    if(!token){
        res.status(401).json({message:'Not authorized, no token'});
        return;
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET as string) as JWTPayload;
        req.userID=decoded.userId;
        req.containerID=decoded.containerId;
        next();
    }catch(err){
        res.status(401).json({message:'Not authorized, token failed'});
    }

}
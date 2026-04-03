import {Request,Response} from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {createContainer} from "../services/dockerService";
import { removeContainer } from "../services/dockerService";
import { AuthRequest } from "../middlewares/authMiddleware";

const generateToken=(userId:string,containerId:string):string=>{
    return jwt.sign(
        {userId,containerId},
        process.env.JWT_SECRET as string,
        {expiresIn:'7d'}
    )
}
export const register=async(req:Request,res:Response):Promise<void>=>{
    try{
        const {email,password}=req.body;
        const existingUser=await User.findOne({email});

        if(existingUser){
            res.status(400).json({message:'User already exists'});
            return;
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const user = await User.create({ email, password: hashedPassword });
    
        const containerId=await createContainer(user._id.toString());
        user.containerId = containerId;
        await user.save();


        const token = generateToken(user._id.toString(), containerId);
        res.status(201).json({ token, containerId });

    }
    catch(err){
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

export const login=async(req:Request,res:Response):Promise<void>=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            res.status(400).json({message:'Invalid credentials'});
            return;
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(400).json({message:'Invalid credentials'});
            return;
        }
        if(!user.containerId){
            const containerID=await createContainer(user._id.toString());
            user.containerId=containerID;
            await user.save();
        }
        const token = generateToken(user._id.toString(), user.containerId);
        res.status(200).json({ token, containerId: user.containerId });
    }
    catch(err)
    {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const containerId = req.containerID as string;
        if (containerId) {
            await removeContainer(containerId);
            await User.findByIdAndUpdate(req.userID, { containerId: '' });
        }
        res.status(200).json({ message: 'Logged out and container destroyed' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Logout failed' });
    }
};


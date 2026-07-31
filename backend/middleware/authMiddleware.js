import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/User.js';

dotenv.config();

const secret = process.env.JWT_SECRET;

export async function verifyUser(req,res,next) {
    try {
        const token = req?.cookies?.token || req.headers.authorization?.split(' ')[1]
        if(!token){
            res.status(401).json({message:"Unathorized"});  
            return;
        }
        const jwtObject = jwt.verify(token, secret);
        
        if(!jwtObject){
            res.status(404).json({error: "user id is not found"});
            return;
        }
        
        const user = await User.findById(jwtObject.userId);

        const DbUser = await User.findById(user)

        if(!user){
            res.status(404).json({error: "user not found"});
            return;
        }

        req.user = DbUser;

        return next();
    } catch (error) {
        next(error);
    }
}
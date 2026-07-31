import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const Secret = process.env.JWT_SECRET;

export const generateToken = (id) => {
    const token = jwt.sign({userId: id}, Secret,{
        expiresIn: "7d"
    });
    return token;
}

import bcrypt from 'bcrypt';
import User from '../model/User.js';
import { generateToken } from '../lib/Jsonwebtoken.js';


export async function Signup(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "All fields are required (role: optional)" })
            return;
        }

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        const isValid = regex.test(email);

        if (!isValid) {
            res.status(400).json({ error: "Enter a valid email" });
            return;
        }

        const isExistedEmail = await User.findOne({ email });

        if (isExistedEmail) {
            res.status(404).json({ error: "Email is already in use , try another email" });
            return;
        }

        const saltRound = 10;

        const hashPassword = await bcrypt.hash(password, saltRound);

        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
        })

        const token = generateToken(newUser._id);

        res.cookie("token", token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            token
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
}

export async function userLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ error: "User not found 🥺" });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            res.status(401).json({ error: "Wrong password" });
            return;
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            token
        })
    } catch (error) {
        console.error("Login error", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}

export async function getMe() {
    try {
        const user = await User.findById(req.user._id).select("-password");

        res.json({
            user
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
}

export async function logoutUser(_req, res) {
    try {
        res.clearCookie('token');
        res.send('Cookie cleared successfully!');
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}
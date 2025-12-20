import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ENV } from "../config/env.js";

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, ENV.JWT_SECRET, { expiresIn: "14d" })
}

export const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, device } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const imageUrl = `https://ui-avatars.com/api/?name=${name
            .trim()
            .charAt(0)
            .toUpperCase()}&background=0D8ABC&color=fff&size=256`;

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            imageUrl, // 🔥 avatar saved
        });

        const token = generateToken(user._id);

        // WEB
        if (device === "web") {
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "strict",
                maxAge: 14 * 24 * 60 * 60 * 1000,
            });

            return res.status(201).json({
                message: "User registered successfully",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    imageUrl: user.imageUrl,
                },
            });
        }

        // MOBILE
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                imageUrl: user.imageUrl,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, device } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = generateToken(user._id)

        if (device === "web") {
            res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 14 * 24 * 60 * 60 * 1000 })

            return res.status(200).json({ message: "User logged in successfully", user })
        }
        if (device === "mobile") {
            return res.status(200).json({ message: "User logged in successfully", user, token })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error while logging in" })
    }
}

export const logout = async (req, res) => {
    const { device } = req.body;
    try {
        if (device === "web") {
            res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });
        }
        return res.status(200).json({ message: "User logged out successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error while logging out" })
    }
}
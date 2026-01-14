import User from "../models/User.js";
import "dotenv/config";
import createToken from "../utilityFuncs/createToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default async function login(req, res) {
    try {
        const { username, password } = req.body;

        
        const user = await User
            .findOne({ username })
            .select("+password");

        if (!user) {
            return res.status(400).json({
                err: "User does not exist"
            });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                err: "Invalid credentials"
            });
        }

        
        const payload = {
            role: user.role,
            username: user.username
        };

        const token = createToken(payload);

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );

        
        res.status(200).json({
            token,
            refreshToken
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            err: "Server error"
        });
    }
}

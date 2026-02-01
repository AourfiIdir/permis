import User from "../models/User.js";
import "dotenv/config";
import createToken from "../utilityFuncs/createToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//end point to log out remove the refresh token from browsrs cookies
export function logout(req, res) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    });

    res.status(200).json({
        message: "Logged out successfully"
    });
}



//end point to return a new toke  with a refresh token provided
export async function refresh(req, res) {
    const tokenRef = req.body.refreshToken;
    if (!tokenRef) {
        return res.status(401).json({ error: "No refresh token provided" });
    }

    jwt.verify(
        tokenRef,
        process.env.JWT_SECRET_KEY,
        async (err, user) => {
            if (err) {
                return res.status(403).json({ error: "Not authorized" });
            }
            
            // Verify user still exists in database
            const existingUser = await User.findById(user.id);
            if (!existingUser) {
                return res.status(403).json({ error: "User no longer exists" });
            }

            const payload = {
                id: user.id,
                role: existingUser.role
            };
            const newAccessToken = createToken(payload);
            res.status(200).json({ token: newAccessToken });
        }
    );
}

export default async function login(req, res) {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username }).select("+password");
        if (!user) {
            return res.status(400).json({ err: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ err: "Invalid credentials" });
        }

        const payload = {
            id: user._id,
            role: user.role
        };

        const accessToken = createToken(payload,"30d");

        const accessRefresh = createToken(payload,"7d");

        res.status(200).json({ token: accessToken , refreshToken:accessRefresh});
        console.log("User logged in:", username);
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: "Server error" });
        console.log("Login error:", error);
    }
}


import User from "../models/User.js"
import "dotenv/config"
import createToken from "../utilityFuncs/createToken.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import Card from "../models/Card.js"
import UserToCard from "../models/UserToCard.js"

export function logout(req, res) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  res.status(200).json({ success: true, message: "Logged out successfully" })
}

export async function refresh(req, res) {
  try {
    const tokenRef = req.body.refreshToken
    if (!tokenRef) {
      return res.status(401).json({ success: false, message: "No refresh token provided" })
    }

    let decoded
    try {
      decoded = jwt.verify(tokenRef, process.env.JWT_SECRET_KEY)
    } catch {
      return res.status(403).json({ success: false, message: "Invalid or expired refresh token" })
    }

    const existingUser = await User.findById(decoded.id)
    if (!existingUser) {
      return res.status(403).json({ success: false, message: "User no longer exists" })
    }

    const payload = { id: existingUser._id, role: existingUser.role }
    const newAccessToken = createToken(payload)
    res.status(200).json({ success: true, token: newAccessToken })
  } catch (err) {
    console.error("Refresh error:", err)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export default async function login(req, res) {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" })
    }

    const user = await User.findOne({ username }).select("+password")
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" })
    }

    const payload = { id: user._id, role: user.role }

    const accessToken = createToken(payload, "30d")
    const accessRefresh = createToken(payload, "7d")

    const allCards = await Card.find({}).select("_id")
    const existingUserCards = await UserToCard.find({ userId: user._id }).select("cardId -_id")
    const existingCardIds = new Set(existingUserCards.map(uc => uc.cardId.toString()))

    const missingCards = allCards.filter(card => !existingCardIds.has(card._id.toString()))

    if (missingCards.length > 0) {
      await UserToCard.insertMany(
        missingCards.map(card => ({
          userId: user._id,
          cardId: card._id,
          status: "uncomplete",
          hit: 0,
        }))
      )
    }

    res.status(200).json({
      success: true,
      token: accessToken,
      refreshToken: accessRefresh,
      user: { _id: user._id, nom: user.nom, prenom: user.prenom, username: user.username },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

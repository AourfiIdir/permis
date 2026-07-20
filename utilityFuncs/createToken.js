import "dotenv/config"
import jwt from "jsonwebtoken"

export default function createToken(user, expires = "30d") {
  return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: expires })
}

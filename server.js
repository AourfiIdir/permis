import express from "express"
import "dotenv/config"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { connectDB } from './config/database.js'
import { errorHandler } from "./middleware/errorHandler.js"

import userRouter from "./routes/userRouter.js"
import cardRouter from "./routes/cardRouter.js"
import loginRouter from "./routes/loginRouter.js"
import signinRouter from "./routes/signinRouter.js"
import listsRouter from "./routes/listsRouter.js"
import progressRouter from "./routes/ProgressRouter.js"
import ListToCard from "./routes/ListToCard.js"
import UserToCardRouter from "./routes/UsertoCardRouter.js"
import mistakeRouter from "./routes/mistakeRouter.js"
import adminRouter from "./admin/routers/adminRouter.js"

const PORT = process.env.PORT
const app = express()

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:8081"]

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))

app.use(helmet())
app.use(morgan("combined"))
app.use(cookieParser())
app.use(express.json({ limit: "1mb" }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later" },
})
app.use(limiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many auth attempts, please try again later" },
})
app.use("/login", authLimiter)
app.use("/signin", authLimiter)

app.use("/card", cardRouter)
app.use("/login", loginRouter)
app.use("/signin", signinRouter)
app.use("/lists", listsRouter)
app.use("/progress", progressRouter)
app.use("/listtocard", ListToCard)
app.use("/usertocard", UserToCardRouter)
app.use("/user", userRouter)
app.use("/mistake", mistakeRouter)
app.use("/admin", adminRouter)

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" })
})

app.use(errorHandler)

const DB_URL = process.env.DB_ACCESS

connectDB(DB_URL).then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
  })

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`)
    server.close(() => {
      import('mongoose').then(mongoose => {
        mongoose.default.disconnect().then(() => {
          console.log("MongoDB disconnected")
          process.exit(0)
        })
      })
    })
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"))
  process.on("SIGINT", () => shutdown("SIGINT"))
})

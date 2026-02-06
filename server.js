import express from "express"
import "dotenv/config"
import cors from "cors"
const URL = process.env.DB_ACCESS;
import { connectDB } from './config/database.js';
import userRouter from "./routes/userRouter.js"
import cardRouter from "./routes/cardRouter.js"
import loginRouter from "./routes/loginRouter.js"
import sigininRouter from "./routes/signinRouter.js"
import cookieParser from "cookie-parser";
import listsRouter from "./routes/listsRouter.js"
import progressRouter from "./routes/ProgressRouter.js"
import ListToCard from "./routes/ListToCard.js";
import UserToCardRouter from "./routes/UsertoCardRouter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import mistakeRouter from "./routes/mistakeRouter.js";
import adminRouter from "./admin/routers/adminRouter.js"
const PORT = process.env.PORT
const app = express();

app.use(cors()); //change it in the production to restrict the origin
app.use(cookieParser());
app.use(express.json());
app.use("/card",cardRouter)
app.use("/login",loginRouter);
app.use("/signin",sigininRouter);
app.use("/lists",listsRouter);
app.use("/progress",progressRouter);
app.use("/listtocard",ListToCard);
app.use("/usertocard",UserToCardRouter);
app.use("/user",userRouter);
app.use("/mistake",mistakeRouter);

app.use(errorHandler);



connectDB(URL).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  });
});
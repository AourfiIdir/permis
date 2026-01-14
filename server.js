import express from "express"
import "dotenv/config"
const URL = process.env.DB_ACCESS;
import { connectDB } from './config/database.js';
import cardRouter from "./routes/cardRouter.js"
import loginRouter from "./routes/loginRouter.js"
import sigininRouter from "./routes/signinRouter.js"
const PORT = process.env.PORT
const app = express();

app.use(express.json());
app.use("/card",cardRouter)
app.use("/login",loginRouter);
app.use("/signin",sigininRouter);

connectDB(URL).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  });
});
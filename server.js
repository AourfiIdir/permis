import express from "express"
import { connectDB } from './config/database.js';
import cardRouter from "./routes/cardRouter.js"
const app = express();
app.use(express.json());
connectDB();
app.use("/card",cardRouter)


const PORT = 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:3000`);
  });
});
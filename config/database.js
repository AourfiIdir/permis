import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async (URL) => {
    try {
    await mongoose.connect(
      URL
    );
    console.log("✅ Connexion à MongoDB réussie !");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error.message);
    process.exit(1);
  }
};

export const disconnect = async ()=>{
  await mongoose.disconnect();
  console.log("Disconnected.");
}


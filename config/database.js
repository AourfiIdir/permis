import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
    await mongoose.connect(
      'mongodb+srv://db_user:Admin123@cluster0.ejsbzqw.mongodb.net/School-backend?retryWrites=true&w=majority'
    );
    console.log("✅ Connexion à MongoDB réussie !");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error.message);
    process.exit(1);
  }
};


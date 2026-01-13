import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
    await mongoose.connect(
      'mongodb+srv://idiraourfi73_db_user:xW5WyCpDiu1SpsMa@cluster0.ye9dyjd.mongodb.net/'
    );
    console.log("✅ Connexion à MongoDB réussie !");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error.message);
    process.exit(1);
  }
};
connectDB();


import app from './projet-School-backend/app.js';
import { connectDB } from './config/database.js';


const PORT = 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:3000`);
  });
});
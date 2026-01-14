
const URL = process.env.DB_ACCESS;
import User from "./models/User.js";
import { connectDB } from "./config/database.js";
import { disconnect } from "./config/database.js";

await connectDB(URL);


try {
  const newUser = await User.create({
    nom: "Aourfi",
    prenom: "Idir",
    email: "idir@example.com",
    password: "mypassword123",
    sexe: "male",
    wilaya: "Béjaïa",
    age: 22,
    role: "user",
    username: "idir"
  });

  console.log("User created:", newUser);
} catch (err) {
  if (err.code === 11000) console.log("Duplicate email or username");
  else console.error(err);
}finally{
    await disconnect();
}

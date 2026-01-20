import dotenv from "dotenv";
dotenv.config();
const URL = process.env.DB_ACCESS;
import User from "./models/User.js";
import { connectDB } from "./config/database.js";
import { disconnect } from "./config/database.js";
import Card from "./models/Card.js";
import List from "./models/List.js";
import mongoose from "mongoose";
await connectDB(URL);


try {
  await Card.deleteMany({});
  await User.deleteMany({});

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

  const cards = [
    {
      name: "JavaScript Basics",
      description: "Introduction to JavaScript fundamentals",
      category: "programming",
      content: {
        topics: ["variables", "functions", "loops"],
        level: "beginner"
      }
    },
    {
      name: "React Components",
      description: "Understanding components and props in React",
      category: "frontend",
      content: {
        topics: ["components", "props", "state"],
        example: "function MyComponent() {}"
      }
    },
    {
      name: "Node.js API",
      description: "Build REST APIs using Node.js and Express",
      category: "backend",
      content: {
        methods: ["GET", "POST", "PUT", "DELETE"],
        framework: "Express"
      }
    },
    {
      name: "MongoDB Schema Design",
      description: "Best practices for designing MongoDB schemas",
      category: "database",
      content: {
        principles: ["normalization", "indexes"],
        useCase: "scalable applications"
      }
    },
    {
      name: "Authentication with JWT",
      description: "Secure applications using JSON Web Tokens",
      category: "security",
      content: {
        flow: ["login", "token generation", "token verification"],
        expiresIn: "1h"
      }
    }
  ];

  // Insert into DB
  const cardCreated = await Card.insertMany(cards);
  console.log(cardCreated);

  const list = await List.create({
    name: "Frontend Basics",
    description: "L",
    createdBy: newUser._id,
    cards: cardCreated.map(card =>card._id)
  });
  console.log("List created:", list);



} catch (err) {
  if (err.code === 11000) console.log("Duplicate email or username");
  else console.error(err);
} finally {
  await disconnect();
}

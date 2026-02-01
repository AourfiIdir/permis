import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
const URL = process.env.DB_ACCESS;

import mongoose from "mongoose";
import { connectDB } from "./config/database.js";

import User from "./models/User.js";
import Card from "./models/Card.js";
import List from "./models/List.js";
import Complete from "./models/UserToCard.js";
import Contien from "./models/ListToItem.js";
import Progress from "./models/Progress.js";
import Mistake from "./models/Mistake.js";
import EmailOtp from "./models/EmailOtp.js";

await connectDB(URL);

try {
  // Clear all collections
  await User.deleteMany({});
  await Card.deleteMany({});
  await List.deleteMany({});
  await Complete.deleteMany({});
  await Contien.deleteMany({});
  await Progress.deleteMany({});
  await Mistake.deleteMany({});
  await EmailOtp.deleteMany({});
  console.log("✓ All collections cleared");

  // Create Users (hash passwords to match loginService)
  const rawUsers = [
    {
      nom: "Aourfi",
      prenom: "Idir",
      email: "idir@example.com",
      password: "mypassword123",
      sexe: "male",
      wilaya: "Béjaïa",
      age: 22,
      role: "user",
      username: "idir"
    },
    {
      nom: "Dupont",
      prenom: "Marie",
      email: "marie@example.com",
      password: "password456",
      sexe: "female",
      wilaya: "Alger",
      age: 25,
      role: "user",
      username: "marie"
    },
    {
      nom: "Admin",
      prenom: "User",
      email: "admin@example.com",
      password: "admin123",
      sexe: "male",
      wilaya: "Alger",
      age: 30,
      role: "admin",
      username: "admin"
    }
  ];

  const usersData = await Promise.all(
    rawUsers.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, 10)
    }))
  );
  const users = await User.insertMany(usersData);
  console.log("✓ Users created:", users.length);

  // Create Cards (8 categories: learning-..., quiz-...)
  const cards = await Card.insertMany([
    {
      name: "Road Signs",
      description: "Learn common road signs",
      category: "learning-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: { topics: ["stop sign", "yield sign", "speed limit"], level: "beginner" }
    },
    {
      name: "Traffic Order Learning",
      description: "Master traffic rules and order",
      category: "learning-order",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: { topics: ["intersection rules", "lane changes", "right of way"], level: "intermediate" }
    },
    {
      name: "Traffic Penalties",
      description: "Learn about traffic penalties",
      category: "learning-penalties",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: { topics: ["speeding penalties", "parking fines"], level: "intermediate" }
    },
    {
      name: "General Questions",
      description: "General driving knowledge questions",
      category: "learning-general-question",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: { topics: ["vehicle maintenance", "safety"], level: "beginner" }
    },
    {
      name: "Signs Quiz",
      description: "Test your knowledge on road signs",
      category: "quiz-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: { questions: 15, difficulty: "medium" }
    },
    {
      name: "Order Quiz",
      description: "Quiz on traffic rules and order",
      category: "quiz-order",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: { questions: 10, difficulty: "medium" }
    },
    {
      name: "Penalties Quiz",
      description: "Quiz on traffic penalties and fines",
      category: "quiz-penalties",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: { questions: 12, difficulty: "hard" }
    },
    {
      name: "General Questions Quiz",
      description: "Test general driving knowledge",
      category: "quiz-general-question",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: { questions: 20, difficulty: "medium" }
    }
  ]);
  console.log("✓ Cards created:", cards.length);

  // Create Lists
  const lists = await List.insertMany([
    {
      name: "Beginner Learning Path",
      description: "Start your driving license journey",
      createdBy: users[0]._id,
      cards: [cards[0]._id, cards[3]._id]
    },
    {
      name: "Intermediate Training",
      description: "Advanced driving rules",
      createdBy: users[0]._id,
      cards: [cards[1]._id, cards[2]._id]
    },
    {
      name: "Quiz Practice",
      description: "Test your knowledge",
      createdBy: users[1]._id,
      cards: [cards[4]._id, cards[5]._id, cards[6]._id, cards[7]._id]
    }
  ]);
  console.log("✓ Lists created:", lists.length);

  // Create UserToCard (Complete) - entries for all cards
  const completes = await Complete.insertMany([
    { cardId: cards[0]._id, userId: users[0]._id, status: "completed" },
    { cardId: cards[1]._id, userId: users[0]._id, status: "uncomplete" },
    { cardId: cards[2]._id, userId: users[0]._id, status: "uncomplete" },
    { cardId: cards[3]._id, userId: users[0]._id, status: "completed" },
    { cardId: cards[4]._id, userId: users[0]._id, status: "uncomplete" },
    { cardId: cards[5]._id, userId: users[0]._id, status: "uncomplete" },
    { cardId: cards[6]._id, userId: users[0]._id, status: "uncomplete" },
    { cardId: cards[7]._id, userId: users[0]._id, status: "uncomplete" },
    { cardId: cards[0]._id, userId: users[1]._id, status: "completed" },
    { cardId: cards[1]._id, userId: users[1]._id, status: "completed" },
    { cardId: cards[2]._id, userId: users[1]._id, status: "completed" },
    { cardId: cards[3]._id, userId: users[1]._id, status: "uncomplete" },
    { cardId: cards[4]._id, userId: users[1]._id, status: "completed" },
    { cardId: cards[5]._id, userId: users[1]._id, status: "completed" },
    { cardId: cards[6]._id, userId: users[1]._id, status: "uncomplete" },
    { cardId: cards[7]._id, userId: users[1]._id, status: "uncomplete" }
  ]);
  console.log("✓ Complete records created:", completes.length);

  // Create ListToItem (Contien)
  const contiens = await Contien.insertMany([
    { listId: lists[0]._id, CardId: cards[0]._id },
    { listId: lists[0]._id, CardId: cards[3]._id },
    { listId: lists[1]._id, CardId: cards[1]._id },
    { listId: lists[1]._id, CardId: cards[2]._id },
    { listId: lists[2]._id, CardId: cards[4]._id },
    { listId: lists[2]._id, CardId: cards[5]._id },
    { listId: lists[2]._id, CardId: cards[6]._id },
    { listId: lists[2]._id, CardId: cards[7]._id }
  ]);
  console.log("✓ ListToItem records created:", contiens.length);

  // Create Progress
  const progresses = await Progress.insertMany([
    { type: "quiz-completed", userId: users[0]._id, points: 150 },
    { type: "learning-completed", userId: users[0]._id, points: 200 },
    { type: "quiz-completed", userId: users[1]._id, points: 180 },
    { type: "learning-completed", userId: users[1]._id, points: 250 }
  ]);
  console.log("✓ Progress records created:", progresses.length);

  // Create Mistakes
  const mistakes = await Mistake.insertMany([
    { user: users[0]._id, card: cards[5]._id, mistake: "Wrong answer on question 5" },
    { user: users[0]._id, card: cards[4]._id, mistake: "Confused stop sign with yield" },
    { user: users[1]._id, card: cards[6]._id, mistake: "Incorrect penalty amount" }
  ]);
  console.log("✓ Mistakes created:", mistakes.length);

  // Seed EmailOtp for emails NOT in Users (to match signinService flow)
  const signupEmails = [
    { email: "signup1@example.com", otp: "123456" },
    { email: "signup2@example.com", otp: "654321" },
    { email: "signup3@example.com", otp: "999999" }
  ];
  const expiresInMinutes = 10;
  const emailOtps = await Promise.all(
    signupEmails.map(async ({ email, otp }) => ({
      email,
      otpHash: await bcrypt.hash(otp, 10),
      expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000)
    }))
  );
  await EmailOtp.insertMany(emailOtps);
  console.log("✓ EmailOtp records created:", emailOtps.length);

  console.log("\n✅ Database populated successfully!");
} catch (err) {
  console.error("❌ Error:", err.message);
} finally {
  await mongoose.disconnect();
  console.log("Database connection closed");
}
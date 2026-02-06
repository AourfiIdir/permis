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
  // 🔴 Interdiction
  {
    name: "No entry for vehicular traffic",
    description: "This sign prohibits access to all vehicles from this direction. Drivers must choose another route.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297419/trafficques_yz3bqf.png",
    content: {
      level: "beginner",
      topics: ["prohibition sign", "one way restriction", "traffic control", "mandatory direction change"]
    }
  },
  {
    name: "No motor vehicles",
    description: "This sign forbids access to all motor vehicles. Only pedestrians and non-motorized users are allowed.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297417/no_motor_vehiculs_ezbutq.png",
    content: {
      level: "beginner",
      topics: ["vehicle restriction", "motorized traffic", "road access rules", "urban regulation"]
    }
  },
  {
    name: "No motorcycles",
    description: "This sign prohibits motorcycles and light motorbikes. Riders must take an alternative road.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297416/no_moto_ke5n4m.png",
    content: {
      level: "beginner",
      topics: ["two-wheel vehicles", "motorcycle restriction", "urban safety", "traffic limitation"]
    }
  },
  {
    name: "No cycling",
    description: "This sign indicates that bicycles are not allowed on this road. Cyclists must dismount or change direction.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297416/no_vilo_htut6o.png",
    content: {
      level: "beginner",
      topics: ["bicycle restriction", "cycle prohibition", "shared road rules", "non-motorized transport"]
    }
  },

  // ⚠️ Danger
  {
    name: "Road narrows on both sides",
    description: "This sign warns that the road becomes narrower ahead. Drivers should slow down and stay alert.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297419/narrowroadsonbothsides_n6ajdr.png",
    content: {
      level: "intermediate",
      topics: ["road width reduction", "hazard awareness", "defensive driving", "lane control"]
    }
  },
  {
    name: "Road narrows on the right",
    description: "This sign announces a narrowing of the road on the right side. Extra caution is required when overtaking.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/narrowonright_i0rgjt.png",
    content: {
      level: "intermediate",
      topics: ["lane narrowing", "right side hazard", "overtaking caution", "road geometry"]
    }
  },
  {
    name: "Side winds",
    description: "This sign warns of strong crosswinds. Drivers should keep firm control of their vehicle.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/vent_hjbmkd.png",
    content: {
      level: "intermediate",
      topics: ["weather hazards", "crosswind control", "vehicle stability", "high risk zones"]
    }
  },
  {
    name: "Steep hill downwards",
    description: "This sign indicates a steep downhill slope ahead. Drivers should reduce speed and use engine braking.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/downhill_zjztsg.png",
    content: {
      level: "intermediate",
      topics: ["downhill driving", "engine braking", "speed control", "mountain roads"]
    }
  },
  {
    name: "Slippery road",
    description: "This sign warns that the road surface may be slippery. Sudden braking should be avoided.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/slippery_road_k4qppr.png",
    content: {
      level: "intermediate",
      topics: ["low grip surface", "rain hazard", "skid prevention", "safe braking"]
    }
  },
  {
    name: "Road works",
    description: "This sign indicates road works ahead. Drivers must follow temporary signs and reduce speed.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297417/road_wroks_mtmvei.png",
    content: {
      level: "beginner",
      topics: ["temporary traffic control", "construction zone", "worker safety", "speed reduction"]
    }
  },

  // ⛔ Priorité
  {
    name: "Stop",
    description: "This sign requires a complete stop at the intersection. Drivers must give way before proceeding.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297426/stopsign_ccyndq.png",
    content: {
      level: "beginner",
      topics: ["mandatory stop", "intersection rules", "right of way", "road priority"]
    }
  },
  {
    name: "Give way",
    description: "This sign requires drivers to yield to traffic on the main road. Stopping is required if necessary.",
    category: "learning-signs",
    imageURI: "https://example.com/give-way.png",
    content: {
      level: "beginner",
      topics: ["yield rule", "priority system", "intersection safety", "traffic flow"]
    }
  },
  {
    name: "Priority road",
    description: "This sign indicates that you are driving on a priority road. Other vehicles must give way.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297420/prioritysign_mhtqnd.png",
    content: {
      level: "beginner",
      topics: ["priority indication", "right of way system", "main road", "traffic hierarchy"]
    }
  },
  {
    name: "End of priority road",
    description: "This sign marks the end of a priority road. Drivers must be ready to give way.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297420/endofprioritysign_inty5u.png",
    content: {
      level: "beginner",
      topics: ["priority end", "intersection caution", "road hierarchy change", "defensive driving"]
    }
  },

    {
  name: "Panneau STOP",
  description: "Apprendre le panneau STOP",
  category: "learning-signs",
  imageURI:
    "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
  content: {
    meaning: "Arrêt obligatoire à l’intersection",
    where: "À un carrefour dangereux ou à visibilité réduite",
    do: "Je m’arrête complètement, je regarde à gauche et à droite, puis je repars si la voie est libre",
    mistake: "Ralentir sans s’arrêter complètement"
  }
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
  { user: users[0]._id, card: cards[19]._id, mistake: "Wrong answer on question 5" },
  { user: users[0]._id, card: cards[18]._id, mistake: "Confused stop sign with yield" },
  { user: users[1]._id, card: cards[20]._id, mistake: "Incorrect penalty amount" }
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
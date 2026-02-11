<<<<<<< Updated upstream
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
      meaning: "Interdiction d'accès à tous les véhicules",
      where: "À l'entrée d'une rue, d'une impasse ou d'une zone réservée",
      do: "Je fais demi-tour ou je prends une autre route",
      mistake: "Ignorer le panneau et continuer tout droit"
    }
  },
  {
    name: "No motor vehicles",
    description: "This sign forbids access to all motor vehicles. Only pedestrians and non-motorized users are allowed.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297417/no_motor_vehiculs_ezbutq.png",
    content: {
      meaning: "Interdiction d'accès aux véhicules à moteur",
      where: "Dans les zones piétonnes ou les espaces réservés aux cycles",
      do: "Je descends de mon véhicule ou je choisis un autre itinéraire",
      mistake: "Penser que les motos sont autorisées"
    }
  },
  {
    name: "No motorcycles",
    description: "This sign prohibits motorcycles and light motorbikes. Riders must take an alternative road.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297416/no_moto_ke5n4m.png",
    content: {
      meaning: "Interdiction d'accès aux motorcycles et cyclomoteurs",
      where: "Sur certaines routes ou autoroutes à forte circulation",
      do: "Je prends une route alternative autorisée aux deux-roues",
      mistake: "Croire que seuls les scooters sont interdits"
    }
  },
  {
    name: "No cycling",
    description: "This sign indicates that bicycles are not allowed on this road. Cyclists must dismount or change direction.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297416/no_vilo_htut6o.png",
    content: {
      meaning: "Interdiction de circuler à vélo",
      where: "Sur les autoroutes, routes rapides ou zones à fort trafic",
      do: "Je descends de mon vélo et je le pousse ou je change de route",
      mistake: "Continuer à pédaler en pensant que l'interdiction ne s'applique pas à moi"
    }
  },

  // ⚠️ Danger
  {
    name: "Road narrows on both sides",
    description: "This sign warns that the road becomes narrower ahead. Drivers should slow down and stay alert.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297419/narrowroadsonbothsides_n6ajdr.png",
    content: {
      meaning: "La route se rétrécit des deux côtés",
      where: "Avant un rétrécissement important de la chaussée",
      do: "Je ralentis, je reste concentré et j'évite les dépassements",
      mistake: "Maintenir la même vitesse ou essayer de dépasser"
    }
  },
  {
    name: "Road narrows on the right",
    description: "This sign announces a narrowing of the road on the right side. Extra caution is required when overtaking.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/narrowonright_i0rgjt.png",
    content: {
      meaning: "La route se rétrécit sur la droite",
      where: "Avant un rétrécissement unilatéral de la chaussée",
      do: "Je ralentis et je fais attention à ma droite, évite les dépassements",
      mistake: "Oublier de vérifier la droite ou maintenir sa vitesse"
    }
  },
  {
    name: "Side winds",
    description: "This sign warns of strong crosswinds. Drivers should keep firm control of their vehicle.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/vent_hjbmkd.png",
    content: {
      meaning: "Présence de vents latéraux violents",
      where: "En montagne, en bord de mer ou sur les zones exposées",
      do: "Je garde les mains fermement sur le volant et je ralentis légèrement",
      mistake: "Ne pas adapter ma conduite ou laisser le volant instable"
    }
  },
  {
    name: "Steep hill downwards",
    description: "This sign indicates a steep downhill slope ahead. Drivers should reduce speed and use engine braking.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/downhill_zjztsg.png",
    content: {
      meaning: "Forte pente descendante",
      where: "En montagne ou en terrain accidenté",
      do: "Je réduis ma vitesse, j'utilise un rapport bas et évite de freiner constamment",
      mistake: "Utiliser uniquement les freins sur une longue descente"
    }
  },
  {
    name: "Slippery road",
    description: "This sign warns that the road surface may be slippery. Sudden braking should be avoided.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/slippery_road_k4qppr.png",
    content: {
      meaning: "Chaussée glissante ou à faible adhérence",
      where: "En cas de pluie, verglas, neige ou sur certaines surfaces mouillées",
      do: "Je ralentis, j'augmente les distances de sécurité et j'évite les freinages brusques",
      mistake: "Freiner brutalement ou augmenter la vitesse"
    }
  },
  {
    name: "Road works",
    description: "This sign indicates road works ahead. Drivers must follow temporary signs and reduce speed.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297417/road_wroks_mtmvei.png",
    content: {
      meaning: "Travaux routiers en cours",
      where: "À l'approche d'une zone de construction ou de réparation",
      do: "Je ralentis, je suiv les panneaux temporaires et je reste prudent",
      mistake: "Ignorer les panneaux temporaires ou maintenir sa vitesse normale"
    }
  },

  // ⛔ Priorité
  {
    name: "Stop",
    description: "This sign requires a complete stop at the intersection. Drivers must give way before proceeding.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297426/stopsign_ccyndq.png",
    content: {
      meaning: "Arrêt obligatoire à l'intersection",
      where: "À un carrefour dangereux ou à visibilité réduite",
      do: "Je m'arrête complètement, je regarde à gauche et à droite, puis je repars si la voie est libre",
      mistake: "Ralentir sans s'arrêter complètement"
    }
  },
  {
    name: "Give way",
    description: "This sign requires drivers to yield to traffic on the main road. Stopping is required if necessary.",
    category: "learning-signs",
    imageURI: "https://example.com/give-way.png",
    content: {
      meaning: "Cédez le passage aux autres usagers",
      where: "À l'entrée d'une route secondaire ou d'une route principale",
      do: "Je réduis la vitesse et j'arrête si nécessaire pour laisser passer",
      mistake: "Penser que c'est pareil qu'un stop, continuer sans vérifier"
    }
  },
  {
    name: "Priority road",
    description: "This sign indicates that you are driving on a priority road. Other vehicles must give way.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297420/prioritysign_mhtqnd.png",
    content: {
      meaning: "Vous êtes sur une route à priorité",
      where: "Sur une route principale ou une zone de circulation prioritaire",
      do: "Je peux continuer sans m'arrêter, les autres me cèdent le passage",
      mistake: "S'arrêter inutilement ou ne pas rester attentif"
    }
  },
  {
    name: "End of priority road",
    description: "This sign marks the end of a priority road. Drivers must be ready to give way.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297420/endofprioritysign_inty5u.png",
    content: {
      meaning: "Fin de la route à priorité",
      where: "Avant un carrefour où vous n'avez plus la priorité",
      do: "Je ralentis, je me prépare à céder le passage et je reste prudent",
      mistake: "Continuer à la même vitesse en pensant garder la priorité"
    }
  },

    {
  name: "Panneau STOP",
  description: "Apprendre le panneau STOP",
  category: "learning-signs",
  imageURI:
    "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
  content: {
    meaning: "Arrêt obligatoire à l'intersection",
    where: "À un carrefour dangereux ou à visibilité réduite",
    do: "Je m'arrête complètement, je regarde à gauche et à droite, puis je repars si la voie est libre",
    mistake: "Ralentir sans s'arrêter complètement"
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
      name: "General Questions",
      description: "General driving knowledge questions",
      category: "learning-order",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: { topics: ["vehicle maintenance", "safety"], level: "beginner" }
    },


  {
    name: "Signs Quiz",
    description: "Test your knowledge on road signs",
    category: "quiz-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
    content: [
      {
        question: "What does this sign mean?",
        answers: ["Stop", "Go", "Slow down"],
        correctAnswer: 0
      },
      {
        question: "This triangular sign indicates?",
        answers: ["Yield", "No entry", "Pedestrian crossing"],
        correctAnswer: 0
      }
    ]
  },
  {
    name: "Order Quiz",
    description: "Quiz on traffic rules and order",
    category: "quiz-order",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
    content: [
      {
        question: "Who has the right of way at a four-way stop?",
        answers: ["The car on the left", "The car on the right", "The first car to arrive"],
        correctAnswer: 2
      },
      {
        question: "When can you pass another car on the right?",
        answers: ["Always", "Only on multi-lane roads", "Never"],
        correctAnswer: 1
      }
    ]
  },
  {
    name: "Penalties Quiz",
    description: "Quiz on traffic penalties and fines",
    category: "quiz-penalties",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
    content: [
      {
        question: "Speeding in a school zone can result in?",
        answers: ["Warning", "Heavy fine", "No penalty"],
        correctAnswer: 1
      },
      {
        question: "Driving under the influence penalty includes?",
        answers: ["License suspension", "Fine", "Both"],
        correctAnswer: 2
      }
    ]
  },
  {
    name: "General Questions Quiz",
    description: "Test general driving knowledge",
    category: "quiz-general-question",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
    content: [
      {
        question: "What is the minimum tread depth for tires?",
        answers: ["1.6 mm", "2 mm", "3 mm"],
        correctAnswer: 0
      },
      {
        question: "When should you use headlights?",
        answers: ["At night", "During rain", "Both"],
        correctAnswer: 2
      }
    ]
  },

  // --- New cards ---
  {
    name: "Signs Identification Quiz",
    description: "Identify road signs correctly",
    category: "quiz-signs-advanced",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
    content: [
      {
        question: "What does a circular red-bordered sign indicate?",
        answers: ["Prohibition", "Mandatory", "Information"],
        correctAnswer: 0
      }
    ]
  },
  {
    name: "Emergency Situations Quiz",
    description: "Test knowledge on emergency driving situations",
    category: "quiz-emergency",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
    content: [
      {
        question: "What should you do if your brakes fail?",
        answers: ["Shift to a lower gear", "Turn off engine", "Accelerate"],
        correctAnswer: 0
      }
    ]
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

  const completes = [
  ...(await Promise.all(
    cards.map(card =>
      Complete.create({
        cardId: card._id,
        userId: users[0]._id,
        status: "uncomplete"
      })
    )
  )),

  ...(await Promise.all(
    cards.map(card =>
      Complete.create({
        cardId: card._id,
        userId: users[1]._id,
        status: "uncomplete"
      })
    )
  ))
];

/*
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
      { cardId: cards[8]._id, userId: users[0]._id, status: "uncomplete" },
      { cardId: cards[9]._id, userId: users[0]._id, status: "uncomplete" },
      { cardId: cards[10]._id, userId: users[0]._id, status: "uncomplete" },
      { cardId: cards[11]._id, userId: users[0]._id, status: "uncomplete" },
      { cardId: cards[12]._id, userId: users[0]._id, status: "uncomplete" },
    { cardId: cards[0]._id, userId: users[1]._id, status: "completed" },
    { cardId: cards[1]._id, userId: users[1]._id, status: "completed" },
    { cardId: cards[2]._id, userId: users[1]._id, status: "completed" },
    { cardId: cards[3]._id, userId: users[1]._id, status: "uncomplete" },
    { cardId: cards[4]._id, userId: users[1]._id, status: "completed" },
    { cardId: cards[5]._id, userId: users[1]._id, status: "completed" },
    { cardId: cards[6]._id, userId: users[1]._id, status: "uncomplete" },
    { cardId: cards[7]._id, userId: users[1]._id, status: "uncomplete" }
  ]);*/
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
=======
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
      meaning: "Interdiction d'accès à tous les véhicules",
      where: "À l'entrée d'une rue, d'une impasse ou d'une zone réservée",
      do: "Je fais demi-tour ou je prends une autre route",
      mistake: "Ignorer le panneau et continuer tout droit"
    }
  },
  {
    name: "No motor vehicles",
    description: "This sign forbids access to all motor vehicles. Only pedestrians and non-motorized users are allowed.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297417/no_motor_vehiculs_ezbutq.png",
    content: {
      meaning: "Interdiction d'accès aux véhicules à moteur",
      where: "Dans les zones piétonnes ou les espaces réservés aux cycles",
      do: "Je descends de mon véhicule ou je choisis un autre itinéraire",
      mistake: "Penser que les motos sont autorisées"
    }
  },
  {
    name: "No motorcycles",
    description: "This sign prohibits motorcycles and light motorbikes. Riders must take an alternative road.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297416/no_moto_ke5n4m.png",
    content: {
      meaning: "Interdiction d'accès aux motorcycles et cyclomoteurs",
      where: "Sur certaines routes ou autoroutes à forte circulation",
      do: "Je prends une route alternative autorisée aux deux-roues",
      mistake: "Croire que seuls les scooters sont interdits"
    }
  },
  {
    name: "No cycling",
    description: "This sign indicates that bicycles are not allowed on this road. Cyclists must dismount or change direction.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297416/no_vilo_htut6o.png",
    content: {
      meaning: "Interdiction de circuler à vélo",
      where: "Sur les autoroutes, routes rapides ou zones à fort trafic",
      do: "Je descends de mon vélo et je le pousse ou je change de route",
      mistake: "Continuer à pédaler en pensant que l'interdiction ne s'applique pas à moi"
    }
  },

  // ⚠️ Danger
  {
    name: "Road narrows on both sides",
    description: "This sign warns that the road becomes narrower ahead. Drivers should slow down and stay alert.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297419/narrowroadsonbothsides_n6ajdr.png",
    content: {
      meaning: "La route se rétrécit des deux côtés",
      where: "Avant un rétrécissement important de la chaussée",
      do: "Je ralentis, je reste concentré et j'évite les dépassements",
      mistake: "Maintenir la même vitesse ou essayer de dépasser"
    }
  },
  {
    name: "Road narrows on the right",
    description: "This sign announces a narrowing of the road on the right side. Extra caution is required when overtaking.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/narrowonright_i0rgjt.png",
    content: {
      meaning: "La route se rétrécit sur la droite",
      where: "Avant un rétrécissement unilatéral de la chaussée",
      do: "Je ralentis et je fais attention à ma droite, évite les dépassements",
      mistake: "Oublier de vérifier la droite ou maintenir sa vitesse"
    }
  },
  {
    name: "Side winds",
    description: "This sign warns of strong crosswinds. Drivers should keep firm control of their vehicle.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/vent_hjbmkd.png",
    content: {
      meaning: "Présence de vents latéraux violents",
      where: "En montagne, en bord de mer ou sur les zones exposées",
      do: "Je garde les mains fermement sur le volant et je ralentis légèrement",
      mistake: "Ne pas adapter ma conduite ou laisser le volant instable"
    }
  },
  {
    name: "Steep hill downwards",
    description: "This sign indicates a steep downhill slope ahead. Drivers should reduce speed and use engine braking.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/downhill_zjztsg.png",
    content: {
      meaning: "Forte pente descendante",
      where: "En montagne ou en terrain accidenté",
      do: "Je réduis ma vitesse, j'utilise un rapport bas et évite de freiner constamment",
      mistake: "Utiliser uniquement les freins sur une longue descente"
    }
  },
  {
    name: "Slippery road",
    description: "This sign warns that the road surface may be slippery. Sudden braking should be avoided.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/slippery_road_k4qppr.png",
    content: {
      meaning: "Chaussée glissante ou à faible adhérence",
      where: "En cas de pluie, verglas, neige ou sur certaines surfaces mouillées",
      do: "Je ralentis, j'augmente les distances de sécurité et j'évite les freinages brusques",
      mistake: "Freiner brutalement ou augmenter la vitesse"
    }
  },
  {
    name: "Road works",
    description: "This sign indicates road works ahead. Drivers must follow temporary signs and reduce speed.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297417/road_wroks_mtmvei.png",
    content: {
      meaning: "Travaux routiers en cours",
      where: "À l'approche d'une zone de construction ou de réparation",
      do: "Je ralentis, je suiv les panneaux temporaires et je reste prudent",
      mistake: "Ignorer les panneaux temporaires ou maintenir sa vitesse normale"
    }
  },

  // ⛔ Priorité
  {
    name: "Stop",
    description: "This sign requires a complete stop at the intersection. Drivers must give way before proceeding.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297426/stopsign_ccyndq.png",
    content: {
      meaning: "Arrêt obligatoire à l'intersection",
      where: "À un carrefour dangereux ou à visibilité réduite",
      do: "Je m'arrête complètement, je regarde à gauche et à droite, puis je repars si la voie est libre",
      mistake: "Ralentir sans s'arrêter complètement"
    }
  },
  {
    name: "Give way",
    description: "This sign requires drivers to yield to traffic on the main road. Stopping is required if necessary.",
    category: "learning-signs",
    imageURI: "https://example.com/give-way.png",
    content: {
      meaning: "Cédez le passage aux autres usagers",
      where: "À l'entrée d'une route secondaire ou d'une route principale",
      do: "Je réduis la vitesse et j'arrête si nécessaire pour laisser passer",
      mistake: "Penser que c'est pareil qu'un stop, continuer sans vérifier"
    }
  },
  {
    name: "Priority road",
    description: "This sign indicates that you are driving on a priority road. Other vehicles must give way.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297420/prioritysign_mhtqnd.png",
    content: {
      meaning: "Vous êtes sur une route à priorité",
      where: "Sur une route principale ou une zone de circulation prioritaire",
      do: "Je peux continuer sans m'arrêter, les autres me cèdent le passage",
      mistake: "S'arrêter inutilement ou ne pas rester attentif"
    }
  },
  {
    name: "End of priority road",
    description: "This sign marks the end of a priority road. Drivers must be ready to give way.",
    category: "learning-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297420/endofprioritysign_inty5u.png",
    content: {
      meaning: "Fin de la route à priorité",
      where: "Avant un carrefour où vous n'avez plus la priorité",
      do: "Je ralentis, je me prépare à céder le passage et je reste prudent",
      mistake: "Continuer à la même vitesse en pensant garder la priorité"
    }
  },

    {
  name: "Panneau STOP",
  description: "Apprendre le panneau STOP",
  category: "learning-signs",
  imageURI:
    "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
  content: {
    meaning: "Arrêt obligatoire à l'intersection",
    where: "À un carrefour dangereux ou à visibilité réduite",
    do: "Je m'arrête complètement, je regarde à gauche et à droite, puis je repars si la voie est libre",
    mistake: "Ralentir sans s'arrêter complètement"
  }
},
    {
      name: "Traffic Penalties",
      description: "Learn about traffic penalties",
      category: "learning-penalties",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: {level: "intermediate" }
    },
    {
      name: "General Questions",
      description: "General driving knowledge questions",
      category: "learning-general-question",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: {level: "beginner" }
    },
    {
      name: "General Questions",
      description: "General driving knowledge questions",
      category: "learning-order",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: {level: "beginner" }
    },
    

    
  {
    "name": "Amendes et excès de vitesse",
    "description": "Testez vos connaissances sur les amendes en Algérie",
    "category": "quiz-penalties",
    "imageURI": "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
    "content": [
      {
        "question": "Excès de vitesse en ville : quelle sanction ?",
        "answers": ["Avertissement", "Amende lourde", "Pas de sanction"],
        "imageURI": null,
        "correctAnswer": 1
      },
      {
        "question": "Conduite sous influence : conséquence ?",
        "answers": ["Suspension de permis", "Amende", "Les deux"],
        "imageURI": null,
        "correctAnswer": 2
      }
    ]
  },
  {
    "name": "Infractions au stationnement",
    "description": "Tout savoir sur les infractions liées au stationnement",
    "category": "quiz-penalties",
    "imageURI": "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
    "content": [
      {
        "question": "Stationnement interdit : sanction ?",
        "answers": ["Aucune sanction", "Amende", "Enlèvement du véhicule"],
        "imageURI": null,
        "correctAnswer": 2
      },
      {
        "question": "Stationnement sur passage piéton : quel risque ?",
        "answers": ["Amende", "Avertissement", "Retrait de points"],
        "imageURI": null,
        "correctAnswer": 0
      },
        {
        "question": "Non-port de ceinture de sécurité : sanction ?",
        "answers": ["Amende", "Avertissement", "Pas de sanction"],
        "imageURI": null,
        "correctAnswer": 0
      },
      {
        "question": "Téléphone au volant : conséquence ?",
        "answers": ["Amende", "Suspension de permis", "Les deux"],
        "imageURI": null,
        "correctAnswer": 2
      }
    ]
  },
  
  {
    "name": "Quiz général 1",
    "description": "Testez vos connaissances générales sur le code de la route",
    "category": "quiz-general-question",
    "imageURI": "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
    "content": [
      {
        "question": "Profondeur minimale des rainures des pneus ?",
        "answers": ["1,6 mm", "2 mm", "3 mm"],
        "imageURI": "https://res.cloudinary.com/dcucbns8r/image/upload/v1770481270/tires_zwkmru.jpg",
        "correctAnswer": 0
      },
      {
        "question": "Quand allumer les phares ?",
        "answers": ["La nuit", "Sous la pluie", "Les deux"],
        "imageURI": null,
        "correctAnswer": 2
      },
      {
        "question": "Distance de sécurité minimale en ville ?",
        "answers": ["1 m", "2 m", "3 m"],
        "imageURI": null,
        "correctAnswer": 1
      },
      {
        "question": "Quand utiliser le clignotant en ville ?",
        "answers": ["Avant chaque virage", "Avant chaque dépassement", "Les deux"],
        "imageURI": null,
        "correctAnswer": 2
      }
    ]
  },
  
  
 

  
  
  {
    "name": "Penalties Quiz",
    "description": "Quiz sur les amendes et infractions de circulation",
    "category": "quiz-penalties",
    "imageURI": "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
    "content": [
      {
        "question": "Excès de vitesse dans une zone scolaire peut entraîner ?",
        "answers": ["Avertissement", "Amende lourde", "Pas de sanction"],
        "imageURI": "https://res.cloudinary.com/dcucbns8r/image/upload/v1770481335/school_zone_n9vh0q.jpg",
        "correctAnswer": 1
      },
      {
        "question": "Conduite sous influence d'alcool risque ?",
        "answers": ["Amende", "Suspension de permis", "Les deux"],
        "imageURI": null,
        "correctAnswer": 2
      },
      {
        "question": "Non-port de ceinture de sécurité : sanction ?",
        "answers": ["Amende", "Rien", "Points en moins"],
        "imageURI": null,
        "correctAnswer": 2
      },
      {
        "question": "Téléphone au volant : quelle conséquence ?",
        "answers": ["Avertissement", "Amende", "Amende et points retirés"],
        "imageURI": null,
        "correctAnswer": 2
      }
    ]
  },
  {
    "name": "General Questions Quiz",
    "description": "Test de connaissances générales sur la conduite",
    "category": "quiz-general-question",
    "imageURI": "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
    "content": [
      {
        "question": "Profondeur minimale des pneus ?",
        "answers": ["1.6 mm", "2 mm", "3 mm"],
        "imageURI": null,
        "correctAnswer": 0
      },
      {
        "question": "Quand utiliser les phares ?",
        "answers": ["La nuit", "Sous la pluie", "Les deux"],
        "imageURI": null,
        "correctAnswer": 2
      },
      {
        "question": "Distance de sécurité dépend de ?",
        "answers": ["Vitesse", "Conditions météo", "Les deux"],
        "imageURI": null,
        "correctAnswer": 2
      },
      {
        "question": "Lorsque vous êtes fatigué au volant ?",
        "answers": ["Continuer", "Faire une pause", "Boire du café uniquement"],
        "imageURI": null,
        "correctAnswer": 1
      }
    ]
  },
  {
    "name": "Signs Identification Quiz",
    "description": "Identifier correctement les panneaux de signalisation",
    "category": "quiz-signs-advanced",
    "imageURI": "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
    "content": [
      {
        "question": "Un panneau circulaire à bord rouge indique ?",
        "answers": ["Interdiction", "Obligation", "Information"],
        "correctAnswer": 0
      },
      {
        "question": "Panneau triangulaire avec un point d'exclamation ?",
        "answers": ["Danger général", "Obligation", "Stationnement interdit"],
        "correctAnswer": 0
      },
      {
        "question": "Panneau carré bleu avec symbole : rôle ?",
        "answers": ["Indication", "Interdiction", "Obligation"],
        "correctAnswer": 0
      },
      {
        "question": "Panneau rond bleu : signification ?",
        "answers": ["Obligation", "Interdiction", "Information"],
        "correctAnswer": 0
      },
      {
        "question": "Panneau triangulaire rouge avec symbole de danger ?",
        "answers": ["Danger", "Obligation", "Interdiction"],
        "imageURI": null,
        "correctAnswer": 0
      },
      {
        "question": "Que signifie un panneau bleu avec flèche blanche ?",
        "answers": ["Sens obligatoire", "Interdiction", "Information"],
        "imageURI": null,
        "correctAnswer": 0
      }
    ]
  },
  {
    "name": "Emergency Situations Quiz",
    "description": "Test sur la conduite en situation d'urgence",
    "category": "quiz-emergency",
    "imageURI": "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
    "content": [
      {
        "question": "Que faire si vos freins lâchent ?",
        "answers": ["Passer une vitesse inférieure", "Couper le moteur", "Accélérer"],
        "imageURI": "https://res.cloudinary.com/dcucbns8r/image/upload/v1770481062/no_brakes_eeevt4.jpg",
        "correctAnswer": 0
      },
      {
        "question": "Panne sur autoroute : actions correctes ?",
        "answers": ["Allumer les warnings", "Mettre le triangle", "Les deux"],
        "imageURI": "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
        "correctAnswer": 2
      },
      {
        "question": "Accident mineur : première chose à faire ?",
        "answers": ["Prendre des photos", "Appeler les secours", "Rien"],
        "imageURI": "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
        "correctAnswer": 1
      },
      {
        "question": "Feu moteur pendant la conduite : que faire ?",
        "answers": ["Éteindre le moteur", "Appeler les pompiers", "Les deux"],
        "imageURI": "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
        "correctAnswer": 2
      },
      {
        "question": "Que faire en cas de dérapage sur route mouillée ?",
        "answers": ["Freiner brusquement", "Contre-braquer", "Accélérer"],
        "imageURI": null,
        "correctAnswer": 1
      }
    ]
  },


  {
    name: "Signs Quiz",
    description: "Test your knowledge on road signs",
    category: "quiz-signs",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
    content: [
      {
        question: "What does this sign mean?",
        answers: ["Stop", "Go", "Slow down"],
        imageURI: null,
        correctAnswer: 0
      },
      {
        question: "This triangular sign indicates?",
        answers: ["Yield", "No entry", "Pedestrian crossing"],
        imageURI: null,
        correctAnswer: 0
      }
    ]
  },
  {
    name: "Order Quiz",
    description: "Quiz on traffic rules and order",
    category: "quiz-order",
    imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
    content: [
      {
        question: "Who has the right of way at a four-way stop?",
        answers: ["The car on the left", "The car on the right", "The first car to arrive"],
        imageURI: null,
        correctAnswer: 2
      },
      {
        question: "When can you pass another car on the right?",
        answers: ["Always", "Only on multi-lane roads", "Never"],
        imageURI: null,
        correctAnswer: 1
      }
    ]
  },



  

  // Priorité à droite
  {
    name: "Priorité à droite classique",
    description: "Priorité à droite à une intersection sans panneau",
    category: "learning-order",
    content: {
      meaning: "Vous devez céder le passage aux véhicules venant de droite",
      where: "Intersection classique sans panneau",
      do: "Laisser passer le véhicule venant de droite",
      mistake: "Passer sans vérifier la droite"
    }
  },
  {
    name: "Priorité à droite complexe",
    description: "Intersection avec plusieurs routes, priorité à droite",
    category: "learning-order",
    content: {
      meaning: "Toujours céder le passage aux véhicules venant de droite",
      where: "Carrefour complexe",
      do: "Ralentir et vérifier la droite",
      mistake: "Ignorer un véhicule venant de droite"
    }
  },
  {
    name: "Priorité à droite en zone résidentielle",
    description: "Priorité à droite dans une zone 30",
    category: "learning-order",
    content: {
      meaning: "Même en zone 30, céder la priorité à droite",
      where: "Zone résidentielle",
      do: "Vérifier la droite avant de s'engager",
      mistake: "Penser que la vitesse réduite suffit"
    }
  },

  // Priorité à gauche
  {
    name: "Priorité à gauche temporaire",
    description: "Priorité à gauche sur route temporaire ou travaux",
    category: "learning-order",
    content: {
      meaning: "Vous avez priorité sur les véhicules venant de droite",
      where: "Zone de travaux ou déviation",
      do: "Respecter le panneau indiquant la priorité",
      mistake: "Céder la priorité comme d'habitude à droite"
    }
  },
  {
    name: "Priorité à gauche en montagne",
    description: "Priorité à gauche sur route étroite en montagne",
    category: "learning-order",
    content: {
      meaning: "Vous avez priorité sur les véhicules venant de droite",
      where: "Route de montagne étroite",
      do: "S'assurer que l'autre véhicule peut s'arrêter avant de s'engager",
      mistake: "Ne pas anticiper et bloquer le passage"
    }
  },

  // STOP
  {
    name: "STOP obligatoire",
    description: "Arrêt complet à l'intersection",
    category: "learning-order",
    content: {
      meaning: "Vous devez vous arrêter complètement avant de continuer",
      where: "Intersection avec panneau STOP",
      do: "Arrêter le véhicule, vérifier la route puis continuer",
      mistake: "Ne pas marquer l'arrêt complet"
    }
  },
  {
    name: "STOP temporaire en travaux",
    description: "STOP pour déviation ou chantier",
    category: "learning-order",
    content: {
      meaning: "Arrêt obligatoire à cause d'un chantier ou déviation",
      where: "Route en travaux",
      do: "S'arrêter et vérifier la circulation",
      mistake: "Passer sans s'arrêter par habitude"
    }
  },

  // Cédez le passage
  {
    name: "Cédez le passage classique",
    description: "Donner la priorité aux véhicules sur la route principale",
    category: "learning-order",
    content: {
      meaning: "Vous devez céder le passage aux véhicules sur la route principale",
      where: "Entrée d'une route secondaire",
      do: "S'arrêter ou ralentir pour laisser passer",
      mistake: "S'engager sans vérifier"
    }
  },
  {
    name: "Cédez le passage sur rond-point",
    description: "Priorité aux véhicules déjà engagés sur le rond-point",
    category: "learning-order",
    content: {
      meaning: "Vous devez céder le passage aux véhicules déjà engagés",
      where: "Rond-point",
      do: "Entrer seulement quand c'est libre",
      mistake: "Couper la priorité aux véhicules dans le rond-point"
    }
  },

  // Fin de priorité
  {
    name: "Fin de route prioritaire",
    description: "Vous quittez une route prioritaire",
    category: "learning-order",
    content: {
      meaning: "Vous n'avez plus priorité, attention aux véhicules venant de droite",
      where: "Panneau fin de route prioritaire",
      do: "Vérifier les autres véhicules avant de continuer",
      mistake: "Continuer sans vigilance"
    }
  },
  {
    name: "Fin de priorité après travaux",
    description: "Fin de priorité temporaire",
    category: "learning-order",
    content: {
      meaning: "Après une zone de travaux, la priorité normale reprend",
      where: "Fin de chantier",
      do: "Vérifier la signalisation normale",
      mistake: "Ignorer la reprise de priorité"
    }
  },

  // Priorité aux tramways
  {
    name: "Priorité aux tramways",
    description: "Le tram a toujours priorité",
    category: "learning-order",
    content: {
      meaning: "Les trams passent avant tout autre véhicule",
      where: "Voie tramway ou croisement",
      do: "Laisser passer le tram",
      mistake: "Bloquer le tram ou s'engager en priorité"
    }
  },

  // Priorité alternée
  {
    name: "Priorité alternée",
    description: "Priorité alternée sur pont ou route étroite",
    category: "learning-order",
    content: {
      meaning: "Les véhicules d’un côté passent avant l’autre",
      where: "Pont étroit ou zone de travaux",
      do: "Respecter les panneaux ou feux alternés",
      mistake: "S’engager sans respecter la priorité alternée"
    }
  },

  // Priorité aux piétons
  {
    name: "Priorité aux piétons",
    description: "Vous devez céder le passage aux piétons",
    category: "learning-order",
    content: {
      meaning: "Les piétons ont priorité sur la route",
      where: "Passage piéton marqué",
      do: "S'arrêter et laisser passer",
      mistake: "Ignorer les piétons sur le passage"
    }
  },

  // Cas spéciaux
  {
    name: "Priorité sur voie rétrécie",
    description: "Une voie est rétrécie, céder si nécessaire",
    category: "learning-order",
    content: {
      meaning: "Sur une voie rétrécie, la priorité peut être signalée",
      where: "Route rétrécie, travaux ou montagne",
      do: "Céder si panneau ou circulation dense",
      mistake: "S’engager sans vérifier"
    }
  },
  {
    name: "Priorité aux véhicules d’urgence",
    description: "Les véhicules prioritaires passent avant tout le monde",
    category: "learning-order",
    content: {
      meaning: "Ambulances, pompiers et police ont priorité",
      where: "Sur la route à tout moment",
      do: "Se ranger sur le côté et laisser passer",
      mistake: "Continuer sans céder"
    }
  },
  {
    name: "Priorité aux transports en commun",
    description: "Certaines voies donnent priorité aux bus ou trams",
    category: "learning-order",
    content: {
      meaning: "Transports en commun ont priorité sur certaines voies",
      where: "Voies réservées aux bus/tram",
      do: "Ne pas s’engager sur ces voies",
      mistake: "Bloquer un bus ou tram"
    }
  },
  {
    name: "Priorité au passage à niveau",
    description: "Priorité absolue au train",
    category: "learning-order",
    content: {
      meaning: "Les trains ont priorité totale sur la route",
      where: "Passage à niveau",
      do: "S'arrêter si barrière fermée ou signal activé",
      mistake: "Passer malgré le signal"
    }
  }
]);
  console.log("✓ Cards created:", cards.length);

  // Create Lists
  const lists = await List.insertMany([
     {
    name: "Beginner Learning Path",
    description: "Start your driving license journey",
    createdBy: users[0]._id,
    cards: [cards[14]._id, cards[17]._id] // Road Signs + General Questions
  },
  {
    name: "Intermediate Training",
    description: "Advanced driving rules",
    createdBy: users[0]._id,
    cards: [cards[15]._id, cards[16]._id] // Order + Penalties
  },
  {
    name: "Quiz Practice",
    description: "Test your knowledge",
    createdBy: users[1]._id,
    cards: [cards[18]._id, cards[19]._id, cards[20]._id, cards[21]._id]
  }
]);

  console.log("✓ Lists created:", lists.length);

  const completes = [
  ...(await Promise.all(
    cards.map(card =>
      Complete.create({
        cardId: card._id,
        userId: users[0]._id,
        status: "uncomplete"
      })
    )
  )),

  ...(await Promise.all(
    cards.map(card =>
      Complete.create({
        cardId: card._id,
        userId: users[1]._id,
        status: "uncomplete"
      })
    )
  ))
];
  
  console.log("✓ Completes created:", completes.length);

} catch (error) {
  console.error("Error during population:", error);
} finally {
  await mongoose.connection.close();
  console.log("✓ Database connection closed");
}

>>>>>>> Stashed changes

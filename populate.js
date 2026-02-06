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


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

  // Create Cards (translated to French, duplicates removed)
  const cards = await Card.insertMany([
    {
      name: "Interdiction d'accès aux véhicules",
      description: "Ce panneau interdit l'accès à tous les véhicules depuis cette direction. Il faut emprunter un autre itinéraire.",
      category: "learning-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297419/trafficques_yz3bqf.png",
      content: {
        meaning: "Interdiction d'accès à tous les véhicules",
        where: "À l'entrée d'une rue, d'une impasse ou d'une zone réservée",
        do: "Faire demi-tour ou choisir une autre route",
        mistake: "Ignorer le panneau et continuer"
      }
    },
    {
      name: "Interdiction aux véhicules à moteur",
      description: "Panneau interdisant l'accès aux véhicules à moteur; seuls piétons et cycles non motorisés peuvent passer.",
      category: "learning-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297417/no_motor_vehiculs_ezbutq.png",
      content: {
        meaning: "Interdiction aux véhicules à moteur",
        where: "Zones piétonnes ou espaces réservés aux cycles",
        do: "Descendre du véhicule ou choisir un autre itinéraire",
        mistake: "Penser que certaines motos sont autorisées"
      }
    },
    {
      name: "Interdiction aux motocyclettes",
      description: "Panneau interdisant la circulation des motocyclettes et cyclomoteurs sur cette voie.",
      category: "learning-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297416/no_moto_ke5n4m.png",
      content: {
        meaning: "Interdiction aux motocyclettes et cyclomoteurs",
        where: "Sur certaines routes ou autoroutes à forte circulation",
        do: "Prendre un itinéraire alternatif autorisé aux deux-roues",
        mistake: "Croire que seuls certains deux-roues sont interdits"
      }
    },
    {
      name: "Interdiction de circuler à vélo",
      description: "Ce panneau indique que les bicyclettes ne sont pas autorisées sur cette voie.",
      category: "learning-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297416/no_vilo_htut6o.png",
      content: {
        meaning: "Interdiction de circuler à vélo",
        where: "Autoroutes, voies rapides ou zones à fort trafic",
        do: "Descendre du vélo et le pousser ou changer de route",
        mistake: "Continuer à rouler en pensant que l'interdiction ne s'applique pas"
      }
    },

    // Danger
    {
      name: "Chaussée rétrécit des deux côtés",
      description: "Annonce un rétrécissement de la chaussée dans les deux sens; ralentir et être attentif.",
      category: "learning-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297419/narrowroadsonbothsides_n6ajdr.png",
      content: {
        meaning: "La route se rétrécit des deux côtés",
        where: "Avant un rétrécissement important de la chaussée",
        do: "Ralentir et éviter les dépassements",
        mistake: "Maintenir la même vitesse ou tenter de dépasser"
      }
    },
    {
      name: "Chaussée rétrécit à droite",
      description: "Annonce un rétrécissement du côté droit; prudence lors des dépassements.",
      category: "learning-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/narrowonright_i0rgjt.png",
      content: {
        meaning: "La route se rétrécit sur la droite",
        where: "Avant un rétrécissement unilatéral de la chaussée",
        do: "Ralentir et surveiller la droite",
        mistake: "Oublier de vérifier la droite"
      }
    },
    {
      name: "Vents latéraux",
      description: "Panneau avertissant de rafales latérales pouvant déstabiliser le véhicule.",
      category: "learning-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/vent_hjbmkd.png",
      content: {
        meaning: "Présence de vents latéraux violents",
        where: "Zones exposées comme bord de mer ou passages en hauteur",
        do: "Tenir fermement le volant et ralentir légèrement",
        mistake: "Ne pas adapter sa conduite"
      }
    },
    {
      name: "Pente forte descendante",
      description: "Indique une longue descente; utiliser le frein moteur et réduire la vitesse.",
      category: "learning-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/downhill_zjztsg.png",
      content: {
        meaning: "Forte pente descendante",
        where: "En montagne ou terrain accidenté",
        do: "Réduire la vitesse et utiliser un rapport bas",
        mistake: "Surchauffer les freins en freinant constamment"
      }
    },
    {
      name: "Chaussée glissante",
      description: "Avertit d'une chaussée susceptible d'être glissante (pluie, verglas...).",
      category: "learning-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297418/slippery_road_k4qppr.png",
      content: {
        meaning: "Chaussée glissante",
        where: "Par temps de pluie, verglas, neige ou sur surfaces humides",
        do: "Ralentir et augmenter les distances de sécurité",
        mistake: "Freiner brusquement"
      }
    },
    {
      name: "Travaux routiers",
      description: "Annonce la présence de travaux; suivre la signalisation temporaire.",
      category: "learning-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297417/road_wroks_mtmvei.png",
      content: {
        meaning: "Travaux routiers en cours",
        where: "À l'approche d'une zone de construction",
        do: "Ralentir et suivre les panneaux temporaires",
        mistake: "Ignorer la signalisation temporaire"
      }
    },

    // Priorité
    {
      name: "Stop",
      description: "Obligation d'arrêt avant de s'engager à une intersection.",
      category: "learning-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297426/stopsign_ccyndq.png",
      content: {
        meaning: "Arrêt obligatoire",
        where: "Aux carrefours dangereux ou à visibilité réduite",
        do: "S'arrêter complètement, regarder et repartir si la voie est libre",
        mistake: "Ne pas s'arrêter complètement"
      }
    },
    {
      name: "Cédez le passage",
      description: "Indique qu'il faut céder le passage aux véhicules sur la route prioritaire.",
      category: "learning-signs",
      imageURI: "https://example.com/give-way.png",
      content: {
        meaning: "Cédez le passage",
        where: "À l'entrée d'une route secondaire",
        do: "Ralentir et s'arrêter si nécessaire",
        mistake: "Confondre avec un stop"
      }
    },
    {
      name: "Route prioritaire",
      description: "Indique que la voie sur laquelle vous circulez a la priorité.",
      category: "learning-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297420/prioritysign_mhtqnd.png",
      content: {
        meaning: "Route prioritaire",
        where: "Sur une route principale",
        do: "Poursuivre sa route en restant attentif",
        mistake: "S'arrêter inutilement"
      }
    },
    {
      name: "Fin de route prioritaire",
      description: "Marque la fin d'une route prioritaire; être prêt à céder le passage.",
      category: "learning-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1770297420/endofprioritysign_inty5u.png",
      content: {
        meaning: "Fin de la priorité",
        where: "Avant un carrefour où la priorité cesse",
        do: "Ralentir et céder le passage si nécessaire",
        mistake: "Poursuivre sans vérifier"
      }
    },

    // Pénalités & questions générales
    {
      name: "Sanctions routières",
      description: "Informations sur les amendes et sanctions liées au code de la route.",
      category: "learning-penalties",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: { topics: ["amendes pour excès de vitesse", "infractions de stationnement"], level: "intermédiaire" }
    },
    {
      name: "Questions générales",
      description: "Questions générales sur la conduite et l'entretien du véhicule.",
      category: "learning-general-question",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: { topics: ["entretien du véhicule", "sécurité"], level: "débutant" }
    },

    // Quizzes traduits
    {
      name: "Quiz: panneaux",
      description: "Testez vos connaissances sur les panneaux de signalisation.",
      category: "quiz-signs",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: [
        {
          question: "Que signifie ce panneau ?",
          answers: ["Stop", "Passer", "Ralentir"],
          correctAnswer: 0
        },
        {
          question: "Ce panneau triangulaire indique :",
          answers: ["Cédez le passage", "Interdiction d'entrée", "Passage piéton"],
          correctAnswer: 0
        }
      ]
    },
    {
      name: "Quiz: ordre de priorité",
      description: "Quiz sur les règles de priorité et les ordres de passage.",
      category: "quiz-order",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: [
        {
          question: "Qui a la priorité à un stop à quatre voies ?",
          answers: ["La voiture à gauche", "La voiture à droite", "La première voiture arrivée"],
          correctAnswer: 2
        },
        {
          question: "Quand pouvez-vous doubler par la droite ?",
          answers: ["Toujours", "Uniquement sur routes à plusieurs voies", "Jamais"],
          correctAnswer: 1
        }
      ]
    },
    {
      name: "Quiz: sanctions",
      description: "Quiz sur les sanctions et amendes routières.",
      category: "quiz-penalties",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: [
        {
          question: "Un excès de vitesse en zone scolaire peut entraîner :",
          answers: ["Avertissement", "Amende lourde", "Aucune sanction"],
          correctAnswer: 1
        },
        {
          question: "Sanction pour conduite sous influence :",
          answers: ["Suspension de permis", "Amende", "Les deux"],
          correctAnswer: 2
        }
      ]
    },
    {
      name: "Quiz: questions générales",
      description: "Testez vos connaissances générales sur la conduite.",
      category: "quiz-general-question",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: [
        {
          question: "Quelle est la profondeur minimale de sculpture des pneus ?",
          answers: ["1.6 mm", "2 mm", "3 mm"],
          correctAnswer: 0
        },
        {
          question: "Quand doit-on utiliser les phares ?",
          answers: ["La nuit", "Lors de pluie", "Les deux"],
          correctAnswer: 2
        }
      ]
    },

    // Nouveaux quiz
    {
      name: "Quiz: identification des panneaux",
      description: "Identifier correctement les panneaux de signalisation.",
      category: "quiz-signs-advanced",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: [
        {
          question: "Que signifie un panneau circulaire bordé de rouge ?",
          answers: ["Interdiction", "Obligation", "Information"],
          correctAnswer: 0
        }
      ]
    },
    {
      name: "Quiz: situations d'urgence",
      description: "Connaissances sur les réactions en situation d'urgence.",
      category: "quiz-emergency",
      imageURI: "https://res.cloudinary.com/dcucbns8r/image/upload/v1769699562/danger_train_compressed_page-0001_kev3c6.jpg",
      content: [
        {
          question: "Que faire si vos freins lâchent ?",
          answers: ["Rétrograder", "Couper le moteur", "Accélérer"],
          correctAnswer: 0
        }
      ]
    }
  ]);
  console.log("✓ Cards created:", cards.length);

  // Helper to find card id by name (used below to avoid index fragility)
  const findCardId = (cardName) => {
    const c = cards.find(x => x.name === cardName);
    return c ? c._id : null;
  };

  // Create Lists
  const lists = await List.insertMany([
    {
      name: "Parcours débutant",
      description: "Commencez votre préparation au permis de conduire",
      createdBy: users[0]._id,
      cards: [findCardId("Interdiction d'accès aux véhicules"), findCardId("Chaussée rétrécit des deux côtés")]
    },
    {
      name: "Entraînement intermédiaire",
      description: "Règles de conduite avancées",
      createdBy: users[0]._id,
      cards: [findCardId("Interdiction aux véhicules à moteur"), findCardId("Interdiction aux motocyclettes")]
    },
    {
      name: "Pratique Quiz",
      description: "Testez vos connaissances",
      createdBy: users[1]._id,
      cards: [findCardId("Vents latéraux"), findCardId("Pente forte descendante"), findCardId("Chaussée glissante"), findCardId("Travaux routiers")]
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

  console.log("✓ Complete records created:", completes.length);

  // Create ListToItem (Contien)
  const contiens = await Contien.insertMany([
    { listId: lists[0]._id, CardId: findCardId("Interdiction d'accès aux véhicules") },
    { listId: lists[0]._id, CardId: findCardId("Chaussée rétrécit des deux côtés") },
    { listId: lists[1]._id, CardId: findCardId("Interdiction aux véhicules à moteur") },
    { listId: lists[1]._id, CardId: findCardId("Interdiction aux motocyclettes") },
    { listId: lists[2]._id, CardId: findCardId("Vents latéraux") },
    { listId: lists[2]._id, CardId: findCardId("Pente forte descendante") },
    { listId: lists[2]._id, CardId: findCardId("Chaussée glissante") },
    { listId: lists[2]._id, CardId: findCardId("Travaux routiers") }
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
    { user: users[0]._id, card: findCardId("Quiz: identification des panneaux"), mistake: "Mauvaise réponse à la question 5" },
    { user: users[0]._id, card: findCardId("Stop"), mistake: "Confusion entre le panneau Stop et le Cédez le passage" },
    { user: users[1]._id, card: findCardId("Quiz: sanctions"), mistake: "Montant de l'amende incorrect" }
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
  await mongoose.connection.close();
  console.log("✓ Database connection closed");
}

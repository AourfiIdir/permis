import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals"
import mongoose from "mongoose"
import { connect, closeDatabase, clearDatabase } from "./setup.js"
import User from "../models/User.js"
import Card from "../models/Card.js"
import List from "../models/List.js"
import UserToCard from "../models/UserToCard.js"
import Mistake from "../models/Mistake.js"
import Progress from "../models/Progress.js"
import EmailOtp from "../models/EmailOtp.js"
import bcrypt from "bcrypt"

beforeAll(async () => await connect())
afterAll(async () => await closeDatabase())
beforeEach(async () => await clearDatabase())

describe("User Model", () => {
  it("should hash password on save", async () => {
    const user = await User.create({
      nom: "Test",
      prenom: "User",
      email: "test@example.com",
      password: "password123",
      username: "testuser",
    })

    expect(user.password).not.toBe("password123")
    const isMatch = await bcrypt.compare("password123", user.password)
    expect(isMatch).toBe(true)
  })

  it("should not rehash password if not modified", async () => {
    const user = await User.create({
      nom: "Test",
      prenom: "User",
      email: "test@example.com",
      password: "password123",
      username: "testuser",
    })

    const hashedPassword = user.password
    user.nom = "Updated"
    await user.save()
    expect(user.password).toBe(hashedPassword)
  })

  it("should reject invalid email", async () => {
    await expect(
      User.create({
        nom: "Test",
        prenom: "User",
        email: "not-an-email",
        password: "password123",
        username: "testuser",
      })
    ).rejects.toThrow()
  })

  it("should enforce unique email", async () => {
    await User.create({
      nom: "Test",
      prenom: "User",
      email: "test@example.com",
      password: "password123",
      username: "user1",
    })

    await expect(
      User.create({
        nom: "Test2",
        prenom: "User2",
        email: "test@example.com",
        password: "password456",
        username: "user2",
      })
    ).rejects.toThrow()
  })

  it("should default role to user", async () => {
    const user = await User.create({
      nom: "Test",
      prenom: "User",
      email: "test@example.com",
      password: "password123",
      username: "testuser",
    })
    expect(user.role).toBe("user")
  })

  it("should not return password by default", async () => {
    const user = await User.create({
      nom: "Test",
      prenom: "User",
      email: "test@example.com",
      password: "password123",
      username: "testuser",
    })

    const found = await User.findById(user._id)
    expect(found.password).toBeUndefined()
  })

  it("should return password when explicitly selected", async () => {
    const user = await User.create({
      nom: "Test",
      prenom: "User",
      email: "test@example.com",
      password: "password123",
      username: "testuser",
    })

    const found = await User.findById(user._id).select("+password")
    expect(found.password).toBeDefined()
  })
})

describe("Card Model", () => {
  it("should create a card successfully", async () => {
    const card = await Card.create({
      name: "Speed Limit",
      description: "Speed limit signs",
      category: "learning-signs",
      content: { meaning: "Maximum speed allowed", where: "Road", do: "Obey limit", mistake: "Ignoring" },
      imageURI: "https://example.com/speed.png",
    })

    expect(card.name).toBe("Speed Limit")
    expect(card.category).toBe("learning-signs")
  })

  it("should reject card without required fields", async () => {
    await expect(
      Card.create({ name: "Test" })
    ).rejects.toThrow()
  })
})

describe("List Model", () => {
  it("should create a list with user reference", async () => {
    const user = await User.create({
      nom: "Test", prenom: "User",
      email: "test@example.com", password: "pass123", username: "testuser",
    })

    const list = await List.create({
      name: "My Study List",
      createdBy: user._id,
      cards: [],
    })

    expect(list.name).toBe("My Study List")
    expect(list.createdBy.toString()).toBe(user._id.toString())
  })
})

describe("UserToCard Model", () => {
  it("should create a user-card relation", async () => {
    const user = await User.create({
      nom: "Test", prenom: "User",
      email: "test@example.com", password: "pass123", username: "testuser",
    })
    const card = await Card.create({
      name: "Test Card", description: "Test", category: "test",
      content: "test", imageURI: "https://example.com/test.png",
    })

    const utc = await UserToCard.create({
      userId: user._id, cardId: card._id, status: "uncomplete", hit: 0,
    })

    expect(utc.status).toBe("uncomplete")
    expect(utc.hit).toBe(0)
  })

  it("should reject invalid status", async () => {
    const user = await User.create({
      nom: "Test", prenom: "User",
      email: "test@example.com", password: "pass123", username: "testuser",
    })
    const card = await Card.create({
      name: "Test Card", description: "Test", category: "test",
      content: "test", imageURI: "https://example.com/test.png",
    })

    await expect(
      UserToCard.create({
        userId: user._id, cardId: card._id, status: "invalid", hit: 0,
      })
    ).rejects.toThrow()
  })
})

describe("Mistake Model", () => {
  it("should create a mistake", async () => {
    const user = await User.create({
      nom: "Test", prenom: "User",
      email: "test@example.com", password: "pass123", username: "testuser",
    })
    const card = await Card.create({
      name: "Test Card", description: "Test", category: "test",
      content: "test", imageURI: "https://example.com/test.png",
    })

    const mistake = await Mistake.create({
      user: user._id, card: card._id, mistake: "Wrong answer on Q1",
    })

    expect(mistake.mistake).toBe("Wrong answer on Q1")
  })

  it("should reject duplicate mistakes", async () => {
    const user = await User.create({
      nom: "Test", prenom: "User",
      email: "test@example.com", password: "pass123", username: "testuser",
    })
    const card = await Card.create({
      name: "Test Card", description: "Test", category: "test",
      content: "test", imageURI: "https://example.com/test.png",
    })

    await Mistake.create({
      user: user._id, card: card._id, mistake: "Duplicate text",
    })

    await expect(
      Mistake.create({
        user: user._id, card: card._id, mistake: "Duplicate text",
      })
    ).rejects.toThrow()
  })
})

describe("EmailOtp Model", () => {
  it("should create an OTP record", async () => {
    const otp = await EmailOtp.create({
      email: "test@example.com",
      otpHash: "$2b$10$hashedotp",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    })

    expect(otp.email).toBe("test@example.com")
  })
})

describe("Progress Model", () => {
  it("should create a progress record", async () => {
    const user = await User.create({
      nom: "Test", prenom: "User",
      email: "test@example.com", password: "pass123", username: "testuser",
    })

    const progress = await Progress.create({
      type: "quiz",
      userId: user._id,
      points: 10,
    })

    expect(progress.type).toBe("quiz")
    expect(progress.points).toBe(10)
  })
})

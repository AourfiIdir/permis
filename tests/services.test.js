import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { connect, closeDatabase, clearDatabase } from "./setup.js"
import createToken from "../utilityFuncs/createToken.js"
import User from "../models/User.js"
import Card from "../models/Card.js"
import List from "../models/List.js"
import UserToCard from "../models/UserToCard.js"
import bcrypt from "bcrypt"

process.env.JWT_SECRET_KEY = "test-secret-key"

beforeAll(async () => await connect())
afterAll(async () => await closeDatabase())
beforeEach(async () => await clearDatabase())

describe("createToken", () => {
  it("should create a valid JWT token", () => {
    const payload = { id: "123", role: "user" }
    const token = createToken(payload)

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    expect(decoded.id).toBe("123")
    expect(decoded.role).toBe("user")
  })

  it("should use default 30d expiry when no expires param", () => {
    const token = createToken({ id: "123", role: "user" })
    const decoded = jwt.decode(token)
    const now = Math.floor(Date.now() / 1000)
    const thirtyDays = 30 * 24 * 60 * 60
    expect(decoded.exp - decoded.iat).toBeCloseTo(thirtyDays, -2)
  })

  it("should respect custom expires parameter", () => {
    const token = createToken({ id: "123", role: "user" }, "7d")
    const decoded = jwt.decode(token)
    const sevenDays = 7 * 24 * 60 * 60
    expect(decoded.exp - decoded.iat).toBeCloseTo(sevenDays, -2)
  })

  it("should throw for invalid secret", () => {
    const original = process.env.JWT_SECRET_KEY
    delete process.env.JWT_SECRET_KEY
    expect(() => createToken({ id: "123" })).toThrow()
    process.env.JWT_SECRET_KEY = original
  })
})

describe("loginService", () => {
  it("should login with valid credentials", async () => {
    const { default: login } = await import("../services/loginService.js")

    const user = await User.create({
      nom: "Test", prenom: "User",
      email: "test@example.com", password: "password123",
      username: "testuser", role: "user",
    })

    const card = await Card.create({
      name: "Card1", description: "Desc1", category: "test",
      content: "test", imageURI: "https://example.com/test.png",
    })

    const req = { body: { username: "testuser", password: "password123" } }
    let resBody = null
    let resStatus = null
    const res = {
      status(code) { resStatus = code; return this },
      json(data) { resBody = data; return this },
    }

    await login(req, res)

    expect(resStatus).toBe(200)
    expect(resBody.success).toBe(true)
    expect(resBody.token).toBeDefined()
    expect(resBody.refreshToken).toBeDefined()
    expect(resBody.user._id.toString()).toBe(user._id.toString())
  })

  it("should return 400 for missing fields", async () => {
    const { default: login } = await import("../services/loginService.js")

    const req = { body: {} }
    let resStatus = null
    let resBody = null
    const res = {
      status(code) { resStatus = code; return this },
      json(data) { resBody = data; return this },
    }

    await login(req, res)

    expect(resStatus).toBe(400)
    expect(resBody.success).toBe(false)
  })

  it("should return 400 for wrong password", async () => {
    const { default: login } = await import("../services/loginService.js")

    await User.create({
      nom: "Test", prenom: "User",
      email: "test@example.com", password: "password123",
      username: "testuser", role: "user",
    })

    const req = { body: { username: "testuser", password: "wrongpassword" } }
    let resStatus = null
    let resBody = null
    const res = {
      status(code) { resStatus = code; return this },
      json(data) { resBody = data; return this },
    }

    await login(req, res)

    expect(resStatus).toBe(400)
    expect(resBody.success).toBe(false)
  })

  it("should return 400 for non-existent user", async () => {
    const { default: login } = await import("../services/loginService.js")

    const req = { body: { username: "nobody", password: "password123" } }
    let resStatus = null
    let resBody = null
    const res = {
      status(code) { resStatus = code; return this },
      json(data) { resBody = data; return this },
    }

    await login(req, res)

    expect(resStatus).toBe(400)
    expect(resBody.success).toBe(false)
  })

  it("should assign missing cards on login", async () => {
    const { default: login } = await import("../services/loginService.js")

    await User.create({
      nom: "Test", prenom: "User",
      email: "test@example.com", password: "password123",
      username: "testuser", role: "user",
    })

    await Card.create({
      name: "Card1", description: "Desc1", category: "test",
      content: "test", imageURI: "https://example.com/test.png",
    })

    const req = { body: { username: "testuser", password: "password123" } }
    let resBody = null
    const res = {
      status() { return this },
      json(data) { resBody = data; return this },
    }

    await login(req, res)

    const user = await User.findOne({ username: "testuser" })
    const userCards = await UserToCard.find({ userId: user._id })
    expect(userCards.length).toBe(1)
  })
})

describe("cardService", () => {
  it("should create a card with valid data", async () => {
    const { createCard } = await import("../services/cardService.js")

    const req = {
      body: {
        name: "Speed Limit",
        description: "A sign showing speed limit",
        category: "learning-signs",
        content: { meaning: "Maximum speed" },
        imageURI: "https://example.com/speed.png",
      },
    }
    let resStatus = null
    let resBody = null
    const res = {
      status(code) { resStatus = code; return this },
      json(data) { resBody = data; return this },
    }

    await createCard(req, res)

    expect(resStatus).toBe(201)
    expect(resBody.success).toBe(true)
    expect(resBody.data.name).toBe("Speed Limit")
  })

  it("should return 400 for invalid card data", async () => {
    const { createCard } = await import("../services/cardService.js")

    const req = { body: { name: "X" } }
    let resStatus = null
    let resBody = null
    const res = {
      status(code) { resStatus = code; return this },
      json(data) { resBody = data; return this },
    }

    await createCard(req, res)

    expect(resStatus).toBe(400)
    expect(resBody.success).toBe(false)
  })

  it("should get categories", async () => {
    const { getCategories } = await import("../services/cardService.js")

    await Card.create([
      { name: "C1", description: "D1", category: "learning-signs", content: "c", imageURI: "https://example.com/1.png" },
      { name: "C2", description: "D2", category: "quiz-general", content: "c", imageURI: "https://example.com/2.png" },
      { name: "C3", description: "D3", category: "learning-signs", content: "c", imageURI: "https://example.com/3.png" },
    ])

    let resBody = null
    const res = {
      status() { return this },
      json(data) { resBody = data; return this },
    }

    await getCategories({}, res)

    expect(resBody.success).toBe(true)
    expect(resBody.data.length).toBe(2)
    expect(resBody.data).toContain("learning-signs")
    expect(resBody.data).toContain("quiz-general")
  })

  it("should paginate getCards", async () => {
    const { getCards } = await import("../services/cardService.js")

    const cards = Array.from({ length: 5 }, (_, i) => ({
      name: `Card${i}`, description: `Desc${i}`, category: "test",
      content: "test", imageURI: `https://example.com/${i}.png`,
    }))
    await Card.insertMany(cards)

    let resBody = null
    const res = {
      status() { return this },
      json(data) { resBody = data; return this },
    }

    await getCards({ query: { page: 1, limit: 2 } }, res)

    expect(resBody.data.length).toBe(2)
    expect(resBody.total).toBe(5)
    expect(resBody.page).toBe(1)
  })
})

describe("listService", () => {
  it("should create a list", async () => {
    const { createList } = await import("../services/listService.js")

    const user = await User.create({
      nom: "Test", prenom: "User",
      email: "test@example.com", password: "pass123", username: "testuser",
    })

    const req = { body: { name: "My List" }, user: { id: user._id.toString() } }
    let resStatus = null
    let resBody = null
    const res = {
      status(code) { resStatus = code; return this },
      json(data) { resBody = data; return this },
    }

    await createList(req, res)

    expect(resStatus).toBe(201)
    expect(resBody.success).toBe(true)
    expect(resBody.data.name).toBe("My List")
  })

  it("should prevent deleting another user's list", async () => {
    const { deleteList } = await import("../services/listService.js")

    const user1 = await User.create({
      nom: "User", prenom: "One",
      email: "u1@example.com", password: "pass123", username: "user1",
    })
    const user2 = await User.create({
      nom: "User", prenom: "Two",
      email: "u2@example.com", password: "pass123", username: "user2",
    })

    const list = await List.create({ name: "User1 List", createdBy: user1._id, cards: [] })

    const req = { params: { id: list._id.toString() }, user: { id: user2._id.toString() } }
    let resStatus = null
    let resBody = null
    const res = {
      status(code) { resStatus = code; return this },
      json(data) { resBody = data; return this },
    }

    await deleteList(req, res)

    expect(resStatus).toBe(403)
    expect(resBody.success).toBe(false)

    const stillExists = await List.findById(list._id)
    expect(stillExists).not.toBeNull()
  })
})

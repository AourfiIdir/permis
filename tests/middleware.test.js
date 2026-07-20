import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { connect, closeDatabase, clearDatabase } from "./setup.js"
import authenticateToken from "../middleware/authenticateToken.js"
import checkRoles from "../middleware/authenticateRole.js"

process.env.JWT_SECRET_KEY = "test-secret-key"

beforeAll(async () => await connect())
afterAll(async () => await closeDatabase())
beforeEach(async () => await clearDatabase())

function mockReqRes(authHeader) {
  const req = { headers: { authorization: authHeader } }
  const res = {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this },
    json(data) { this.body = data; return this },
  }
  return { req, res }
}

describe("authenticateToken middleware", () => {
  it("should return 401 if no token is provided", () => {
    const { req, res } = mockReqRes(undefined)
    const next = jest.fn()

    authenticateToken(req, res, next)

    expect(res.statusCode).toBe(401)
    expect(res.body.message).toMatch(/no token/i)
    expect(next).not.toHaveBeenCalled()
  })

  it("should return 401 for malformed Authorization header", () => {
    const { req, res } = mockReqRes("Bearer")
    const next = jest.fn()

    authenticateToken(req, res, next)

    expect(res.statusCode).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })

  it("should return 403 for invalid token", () => {
    const { req, res } = mockReqRes("Bearer invalidtoken")
    const next = jest.fn()

    authenticateToken(req, res, next)

    expect(res.statusCode).toBe(403)
    expect(next).not.toHaveBeenCalled()
  })

  it("should return 403 for expired token", () => {
    const token = jwt.sign({ id: "123", role: "user" }, process.env.JWT_SECRET_KEY, { expiresIn: "-1s" })
    const { req, res } = mockReqRes(`Bearer ${token}`)
    const next = jest.fn()

    authenticateToken(req, res, next)

    expect(res.statusCode).toBe(403)
    expect(next).not.toHaveBeenCalled()
  })

  it("should call next and set req.user for valid token", () => {
    const payload = { id: "123", role: "user" }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
    const { req, res } = mockReqRes(`Bearer ${token}`)
    const next = jest.fn()

    authenticateToken(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.user).toBeDefined()
    expect(req.user.id).toBe("123")
    expect(req.user.role).toBe("user")
  })
})

describe("checkRoles middleware", () => {
  it("should return 403 if user role is not in allowed list", () => {
    const req = { user: { role: "user" } }
    const res = {
      statusCode: null,
      body: null,
      status(code) { this.statusCode = code; return this },
      json(data) { this.body = data; return this },
    }
    const next = jest.fn()

    const middleware = checkRoles(["admin"])
    middleware(req, res, next)

    expect(res.statusCode).toBe(403)
    expect(next).not.toHaveBeenCalled()
  })

  it("should call next if user role is in allowed list", () => {
    const req = { user: { role: "admin" } }
    const res = {
      statusCode: null,
      body: null,
      status(code) { this.statusCode = code; return this },
      json(data) { this.body = data; return this },
    }
    const next = jest.fn()

    const middleware = checkRoles(["admin", "user"])
    middleware(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})

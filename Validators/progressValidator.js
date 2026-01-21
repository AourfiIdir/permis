import { z } from "zod";

export const createProgressSchema = z.object({
  type: z
    .string({
      required_error: "Type is required",
      invalid_type_error: "Type must be a string",
    })
    .min(1, "Type cannot be empty")
    .max(100, "Type is too long")
    .trim(),

  userId: z
    .string({
      required_error: "userId is required",
      invalid_type_error: "userId must be a string",
    })
    .regex(/^[0-9a-fA-F]{24}$/, "userId must be a valid MongoDB ObjectId"),

  points: z
    .number({
      required_error: "Points are required",
      invalid_type_error: "Points must be a number",
    })
    .min(0, "Points cannot be negative"),
}).strict();

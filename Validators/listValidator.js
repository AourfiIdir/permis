import { z } from "zod";

// Validator for creating a new list
export const createListSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),

  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .optional()
    .trim(),

  createdBy: z
    .string({
      required_error: "createdBy is required",
      invalid_type_error: "createdBy must be a valid user ID",
    })
    .regex(/^[0-9a-fA-F]{24}$/, "createdBy must be a valid MongoDB ObjectId"),

  cards: z
    .array(
      z
        .string({
          required_error: "Card ID is required",
          invalid_type_error: "Card ID must be a string",
        })
        .regex(/^[0-9a-fA-F]{24}$/, "Card ID must be a valid MongoDB ObjectId")
    )
    .optional(),
}).strict();

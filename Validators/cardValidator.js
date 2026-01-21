import { z } from "zod";

export const createCardSchema = z.object({
  name: z
    .string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),
  description: z
    .string({ required_error: "Description is required", invalid_type_error: "Description must be a string" })
    .min(5, "Description must be at least 5 characters")
    .trim(),
  category: z
    .string({ required_error: "Category is required", invalid_type_error: "Category must be a string" })
    .min(1, "Category cannot be empty")
    .trim(),
  content: z.any({ required_error: "Content is required" }),
}).strict();


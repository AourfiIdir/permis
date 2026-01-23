import { z } from "zod";

export const createCompleteSchema = z.object({
  cardId: z
    .string({
      required_error: "cardId is required",
      invalid_type_error: "cardId must be a string",
    })
    .regex(/^[0-9a-fA-F]{24}$/, "cardId must be a valid MongoDB ObjectId"),

  userId: z
    .string({
      required_error: "userId is required",
      invalid_type_error: "userId must be a string",
    })
    .regex(/^[0-9a-fA-F]{24}$/, "userId must be a valid MongoDB ObjectId"),

  status: z
    .enum(['completed', 'uncomplete'], {
      required_error: "Status is required",
      invalid_type_error: "Status must be either 'completed' or 'uncomplete'",
    }),
}).strict();

export const getUserCardsSchema = z.object({
  userId: z
    .string({
      required_error: "userId is required",
      invalid_type_error: "userId must be a string",
    })
    .regex(/^[0-9a-fA-F]{24}$/, "userId must be a valid MongoDB ObjectId"),
}).strict();
export const updateUserCardSchema = z.object({
  userId: z
    .string({
      required_error: "userId is required",
      invalid_type_error: "userId must be a string",
    })
    .regex(/^[0-9a-fA-F]{24}$/, "userId must be a valid MongoDB ObjectId"),
  cardId: z
    .string({
      required_error: "cardId is required",
      invalid_type_error: "cardId must be a string",
    })
    .regex(/^[0-9a-fA-F]{24}$/, "cardId must be a valid MongoDB ObjectId"),
  status: z
    .enum(['completed', 'uncomplete'], {
      required_error: "Status is required",
      invalid_type_error: "Status must be either 'completed' or 'uncomplete'",
    }),
}).strict();  



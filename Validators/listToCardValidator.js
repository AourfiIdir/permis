import { z } from "zod";

// Validate request body for adding or deleting a card in a list
export const addOrDeleteCardSchema = z.object({
  listId: z
    .string({ required_error: "listId is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "listId must be a valid MongoDB ObjectId"),
  cardId: z
    .string({ required_error: "cardId is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "cardId must be a valid MongoDB ObjectId"),
});

// Validate params for getting cards from a list
export const getCardsFromListParamsSchema = z.object({
  listId: z
    .string({ required_error: "listId is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "listId must be a valid MongoDB ObjectId"),
});

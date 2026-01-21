import * as cardService from "../services/cardService.js";
import { createCardSchema } from "../validators/card.validator.js";

export async function getCards(req, res, next) {
  try {
    const { category } = req.query;
    const cards = await cardService.getCards({ category });
    res.status(200).json(cards);
  } catch (err) {
    next(err);
  }
}

export async function getCard(req, res, next) {
  try {
    const card = await cardService.getCardById(req.params.id);
    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
}

export async function createCard(req, res, next) {
  try {
    const validatedData = createCardSchema.parse(req.body);
    const card = await cardService.createCard(validatedData);
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
}

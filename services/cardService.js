import * as cardRepo from "../Repositories/cardRepo.js";

export const getCards = async (filters) => {
  return cardRepo.findAll(filters);
};

export const getCardById = async (id) => {
  const card = await cardRepo.findById(id);
  if (!card) {
    const error = new Error("Card not found");
    error.status = 404;
    throw error;
  }
  return card;
};

export const createCard = async (data) => {
  return cardRepo.create(data);
};

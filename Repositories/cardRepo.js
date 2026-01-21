import Card from "../models/Card.js";

export const findAll = () => {
  return Card.find();
};

export const findById = (id) => {
  return Card.findById(id);
};

export const findByCategory = (category) => {
  return Card.find({ category });
};

export const create = (data) => {
  return Card.create(data);
};

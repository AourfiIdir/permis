import mongoose from "mongoose"

const ListToItemSchema = mongoose.Schema({});

export const ListToItem = mongoose.model("ListToItem",ListToItemSchema);



import mongoose from "mongoose"

const MistakeSchema  = mongoose.Schema({
});

export const Mistake = mongoose.model("Mistake",MistakeSchema);

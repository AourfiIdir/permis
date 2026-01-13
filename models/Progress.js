import mongoose from "mongoose"

const ProgressSchema = mongoose.Schema({})

export const Progress = mongoose.model("Progress",ProgressSchema);

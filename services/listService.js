import List from "../models/List.js";
import mongoose from "mongoose";


export async function getLists(req,res){
try {
    const lists = await List.find();
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getListById(req,res){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    try {
        const list = await List.findById(req.params.id);
        if (!list) return res.status(404).json({ message: "List not found" });
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export async function deleteList(req,res){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    try {
        const deletedList = await List.findByIdAndDelete(req.params.id);
        if (!deletedList) return res.status(404).json({ message: "List not found" });
        res.status(200).json({ message: "List deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export async function createList(req,res){
try {
        const newList = new List(req.body);
        const savedList = await newList.save();
        res.status(201).json(savedList);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function updateList(req,res){
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    try {
        const updatedList = await List.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedList) return res.status(404).json({ message: "List not found" });
        res.status(200).json(updatedList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
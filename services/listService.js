
import List from "../models/List.js";
import mongoose from "mongoose";
import { createListSchema } from "../Validators/listValidator.js"; // Zod schema

//get user lists
export async function getLists(req, res) {
  try {
    const userId = req.user.id;
    const lists = await List.find({createdBy:userId});
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// GET a list by ID
export async function getListById(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const list = await List.findById(id);
    if (!list) return res.status(404).json({ message: "List not found" });
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// DELETE a list
export async function deleteList(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const deletedList = await List.findByIdAndDelete(id);
    if (!deletedList) return res.status(404).json({ message: "List not found" });
    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// CREATE a new list with validation
export async function createList(req, res) {
  try {
    const validatedData = req.body; // Zod validation
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const validatedData2 = {...validatedData, createdBy: userId, cards: []};
    const newList = new List(validatedData2);
    const savedList = await newList.save();

    res.status(201).json(savedList);
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.errors?.map(e => e.message) || [];
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: error.message });
  }
}

// UPDATE a list with validation
export async function updateList(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    // Make all fields optional for updates
    const updateListSchema = createListSchema.partial();
    const validatedData = updateListSchema.parse(req.body);

    const updatedList = await List.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!updatedList) return res.status(404).json({ message: "List not found" });
    res.status(200).json(updatedList);
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.errors?.map(e => e.message) || [];
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: error.message });
  }
} 


export async function addCardToList(req,res){
  const userId = req.user.id;
  const {listId,cardId} = req.params;
  try{

      const myList = await List.findByIdAndUpdate(listId,{$addToSet:{cards:cardId}},{new:true});
      if(!myList) return res.status(404).json({message:"failed in adding the card :/"})
        res.status(200).json({message:"added card successfully"})
  }catch(err){
    
    res.status(500).json({message:err.message});
  }
}
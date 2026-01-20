import usertocard from "../models/UserToCard.js";
import mongoose from "mongoose";

//get all the card for a certain user
export async function getUserCards(req,res){
    const {userId1} = req.body;
  try {
    const completions = await usertocard.find({userId:userId1})
    res.status(200).json(completions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//the function grabs the user and card ids and set the status to complete 
export async function setComplete(req,res){
    const {userId1,cardId1} = req.body;
    if(!mongoose.Types.ObjectId.isValid(userId1) || !mongoose.Types.ObjectId.isValid(cardId1)){
        return res.status(401).json({
            err:"the userId or the cardId are not valid"
        })
    }
    try{
    const myCard = await usertocard.updateOne({userId:userId1,cardId:cardId1},{$set:{status:"completed"}})
    }catch(err){
        return res.status(401).json({
            message:err
        })
    }
    res.status(200).json({
        message:"card updated successfully"
    })
}
//the function grabs the user and card ids and set the status to uncomplete
export async function setUncomplete(req,res){
    const {userId1,cardId1} = req.body;
    if(!mongoose.Types.ObjectId.isValid(userId1) || !mongoose.Types.ObjectId.isValid(cardId1)){
        return res.status(401).json({
            err:"the userId or the cardId are not valid"
        })
    }
    try{
    const myCard = await usertocard.updateOne({userId:userId1,cardId:cardId1},{$set:{status:"uncompleted"}})
    }catch(err){
        return res.status(401).json({
            message:err
        })
    }
    res.status(200).json({
        message:"card updated successfully"
    })
}


import {createCardSchema} from "../../Validators/cardValidator.js"
import Card from "../../models/Card.js"
import User from "../../models/User.js"
import UserToCard from "../../models/UserToCard.js"
export async function createCard(req,res){
    const result = createCardSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            error:result.error
        })
    }
    
    try{
        const cardCreated = new Card(result.data)
        const result2 = await cardCreated.save();
        if(!result2){
            return res.status(500).json({
                err:"couldnt create a card"
            })
        }
        const users = await User.find({});
        if(!users){
            return res.status(500).json({
                message:"couldnt retrieve all users"
            })
        }
        const result3 = await Promise.all(
            users.map((user)=>{
                UserToCard.create({
                    cardId:result2._id,
                    userId:user._id,
                    status:"uncompleted",
                    hit:0
                })
            })
        )
        res.status(201).json({
            message:"card created"
        })

    }catch(err){
        res.status(500).json({
            err:err.message
        })
    }
}

export async function assignCards(req,res){
    const user = req.user.id;

    try{
        //retrieve all the cards
        const cards = await Card.find({});
        if(!cards){
            return res.status(500).json({
                message:"cant retrieve cards"
            })
        }
        const result = await Promise.all(
            cards.map((card)=>{
                return UserToCard.create({
                    cardId:card._id,
                    userId:user,
                    status:"uncomplete",
                    hit:0
                })
            })
        )
        if(!result){
            return res.status(500).json({
                message:"couldnt create user to card"
            })
        }
        res.status(201).json({
            message:"assigned successfully",
            created:result
        })
    }catch(err){
        res.status(500).json({
            error:err.message
        })
    }
}
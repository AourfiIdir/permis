import "dotenv/config"
import jwt from "jsonwebtoken"
export default function createToken(user,expires){
    
    try{
        const myToken=jwt.sign(user,process.env.JWT_SECRET_KEY,{expiresIn:"30d"})
        return myToken;
    }
    catch (err){
        console.error("Error here",err);
        throw err
    }
}
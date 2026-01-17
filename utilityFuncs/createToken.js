import "dotenv/config"
import jwt from "jsonwebtoken"
export default function createToken(user){
    
    try{
        const myToken=jwt.sign(user,process.env.JWT_SECRET_KEY,{expiresIn:'30m'})
        return myToken;
    }
    catch (err){
        console.error("Error here",err);
        throw err
    }
}
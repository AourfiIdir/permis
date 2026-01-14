import User from "../models/User.js"

export default  async function signin(req,res){
    const user = req.body;
    //create an user
    try{
        const userCreated = await User.create({
        nom: user.nom,
        prenom:  user.prenom,
        email: user.email,
        password: user.password,
        sexe: user.sexe,
        wilaya: user.wilaya,
        age: user.age,
        role: user.role,
        username: user.username
    })
    }catch(err){
        if(err.code===11000) console.log("duplicated email or username")
        else console.log(err);    
    }
    
    
}
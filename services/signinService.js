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
    }
)
    res.status(200).json({
        message:"user created succussfully",
        user:userCreated
    })
    }catch(err){
        if(err.code===11000) return res.status(401).json({
            err:"duplicated email or username"
        });    
        else return res.status(401).json({
            message:"error in creating the user",
            err:err
        });  
        
    }
    
    
}
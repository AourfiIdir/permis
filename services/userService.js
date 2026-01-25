import User from "../models/User.js";
export async function getUsers(req,res){
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export async function getUserById(req,res){
    const user = req.user;
    const id = user.id;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

    
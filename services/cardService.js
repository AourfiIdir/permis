
import Module from "../models/Card.js"
export async function getCards(req,res){
try {
    const modules = await Module.find();
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getCard(req,res){
    try {
            const module = await Module.findById(req.params.id);
            if (!module) {
                return res.status(404).json({ message: 'Module not found' });
            }
            res.status(200).json(module);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


export async function getByCetag(req,res){
    try {
            const categories = await Module.distinct('category');
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
}
export async function createCard(req,res){
try {
        const newModule = new Module(req.body);
        const savedModule = await newModule.save();
        res.status(201).json(savedModule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
import Mistake from '../models/Mistake.js';

// Create a new mistake
export async function createMistake(req, res) {
    try {
        const { description, userId, timestamp } = req.body;
        const newMistake = new Mistake({ description, userId, timestamp });
        const savedMistake = await newMistake.save();
        res.status(201).json(savedMistake);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export async function getMistakes(req, res) {
    try {
        const mistakes = await Mistake.find();
        res.status(200).json(mistakes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export async function getMistakeById(req, res) {
    try {
        const { id } = req.params;
        const foundMistake = await Mistake.findById(id);
        if (!foundMistake) {
            return res.status(404).json({ message: "Mistake not found" });
        }
        res.status(200).json(foundMistake);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// ...existing code...

export async function getMistakeByUserId(req, res) {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find all mistakes where user field matches userId
        const mistakes = await Mistake.find({ user: userId })
            .populate('card')  // Optional: populate card details
            .sort({ createdAt: -1 }); // Sort by newest first
        
        if (mistakes.length === 0) {
            return res.status(200).json({ 
                message: "No mistakes found for this user", 
                mistakes: [] 
            });
        }

        res.status(200).json({ 
            userId: userId,
            mistakeCount: mistakes.length,
            mistakes: mistakes 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// ...existing code...

// Update a mistake
export async function updateMistake(req, res) {
    try {
        const { id } = req.params;
        const { description, userId, timestamp } = req.body;
        const updatedMistake = await Mistake.findByIdAndUpdate(
            id,
            { description, userId, timestamp },
            { new: true }
        );
        if (!updatedMistake) {
            return res.status(404).json({ message: "Mistake not found" });
        }
        res.status(200).json(updatedMistake);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Delete a mistake
export async function deleteMistake(req, res) {
    try {
        const { id } = req.params;
        const deletedMistake = await Mistake.findByIdAndDelete(id);
        if (!deletedMistake) {
            return res.status(404).json({ message: "Mistake not found" });
        }
        res.status(200).json({ message: "Mistake deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
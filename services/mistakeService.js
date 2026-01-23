import mistake from '../models/mistakeModel.js';

// Create a new mistake
export async function createMistake(req, res) {
    try {
        const { description, userId, timestamp } = req.body;
        const newMistake = new mistake({ description, userId, timestamp });
        const savedMistake = await newMistake.save();
        res.status(201).json(savedMistake);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export async function getMistakes(req, res) {
    try {
        const mistakes = await mistake.find();
        res.status(200).json(mistakes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export async function getMistakeById(req, res) {
    try {
        const { id } = req.params;
        const foundMistake = await mistake.findById(id);
        if (!foundMistake) {
            return res.status(404).json({ message: "Mistake not found" });
        }
        res.status(200).json(foundMistake);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a mistake
export async function updateMistake(req, res) {
    try {
        const { id } = req.params;
        const { description, userId, timestamp } = req.body;
        const updatedMistake = await mistake.findByIdAndUpdate(
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
        const deletedMistake = await mistake.findByIdAndDelete(id);
        if (!deletedMistake) {
            return res.status(404).json({ message: "Mistake not found" });
        }
        res.status(200).json({ message: "Mistake deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
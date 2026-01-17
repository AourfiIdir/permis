import express from 'express';
import mongoose from "mongoose";
import List from "../models/List.js";
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.use(authenticateToken);

// GET all lists
router.get('/', async (_req, res) => {
    try {
        const lists = await List.find();
        res.json(lists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET list by id
router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const list = await List.findById(req.params.id);
        if (!list) return res.status(404).json({ message: "List not found" });
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE
router.post('/', async (req, res) => {
    try {
        const list = await List.create(req.body);
        res.status(201).json(list);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const updatedList = await List.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedList) return res.status(404).json({ message: "List not found" });
        res.json(updatedList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const deleted = await List.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "List not found" });
        res.json({ message: "List deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

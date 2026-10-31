
const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Fetch all notes belonging to the logged-in user
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ROUTE 2: Add a new note
router.post('/addnote', fetchuser, [
    body('title', 'Title must contain at least 3 characters')
        .trim()
        .isLength({ min: 3 }),

    body('description', 'Description must contain at least 5 characters')
        .trim()
        .isLength({ min: 5 }),

    body('tag').optional().trim()
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, tag } = req.body;

        const note = await Note.create({
            title,
            description,
            tag,
            user: req.user.id
        });

        res.status(201).json(note);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ROUTE 3: Update an existing note
router.put('/updatenote/:id', fetchuser, [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Title must contain at least 3 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ min: 5 })
        .withMessage('Description must contain at least 5 characters'),

    body('tag').optional().trim()
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, tag } = req.body;

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid note ID" });
        }

        const updatedFields = {};

        if (title !== undefined) updatedFields.title = title;
        if (description !== undefined) updatedFields.description = description;
        if (tag !== undefined) updatedFields.tag = tag;

        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ error: "No fields provided for update" });
        }

        // Update only if the note belongs to the logged-in user
        const note = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            { $set: updatedFields },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({
                error: "Note not found"
            });
        }

        res.json({ note });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ROUTE 4: Delete an existing note
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid note ID" });
        }

        // Delete only if the note belongs to the logged-in user
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                error: "Note not found"
            });
        }

        res.json({
            success: true,
            message: "Note has been deleted"
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;

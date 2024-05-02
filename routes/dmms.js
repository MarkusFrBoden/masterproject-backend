const router = require("express").Router();
const DMM = require("../models/FlexibleDMM");
const mongoose = require('mongoose');

// Get all DMMS
router.get('/DmmOverview', async (req, res) => {
    try {
        const dmms = await DMM.find().sort({ createdAt: 1 });
        res.status(200).json(dmms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch the documents' });
    }
});

// Get published DMMS
router.get('/PublishedDmm', async (req, res) => {
    try {
        const dmms = await DMM.find({ published: true }).sort({ createdAt: 1 });
        res.status(200).json(dmms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch the documents' });
    }
});

// Get DMM by ID
router.get('/DmmById/:id', async (req, res) => {
    try {
        const dmm = await DMM.findById(req.params.id);
        if (!dmm) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json(dmm);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch the document' });
    }
});

// Create a new DMM
router.post('/Dmm', async (req, res) => {
    try {
        const dmm = new DMM(req.body);
        const savedDMM = await dmm.save();
        res.status(201).json(savedDMM);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not create the document' });
    }
});

// Update DMM by ID
router.patch('/DmmById/:id', async (req, res) => {
    try {
        const updatedDMM = await DMM.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDMM) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json(updatedDMM);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not update the document' });
    }
});

// Delete multiple DMMS
router.post('/deleteMultipleDmms', async (req, res) => {
    const dmmIds = req.body.dmmIds;
    
    if (!dmmIds || !Array.isArray(dmmIds)) {
        return res.status(400).json({ error: 'dmmIds is not a valid array.' });
    }

    const areValidIds = dmmIds.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!areValidIds) {
        return res.status(400).json({ error: 'One or more provided dmm IDs are not valid.' });
    }
    try {
        // Check the acronym for each DMM before deleting
        for (const id of dmmIds) {
            const dmm = await getDmmById(id);
            if (dmm.acronym === 'BIM4VID' || dmm.acronym === 'EUPSO') {
                return res.status(200).json({ invalidIds: true });
            }
        }
        // If all checks pass, delete the DMMS
        const result = await DMM.deleteMany({ _id: { $in: dmmIds } });
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting dmms:', error);
        res.status(500).json({ error: 'Could not delete dmms.' });
    }
});

// Function to get DMM by ID
async function getDmmById(id) {
    if (mongoose.Types.ObjectId.isValid(id)) {
        const dmm = await DMM.findById(id);
        if (!dmm) {
            throw new Error(`DMM document with ID ${id} not found.`);
        }
        return dmm;
    } else {
        throw new Error(`Not a valid DMM document ID: ${id}`);
    }
}

module.exports = router;
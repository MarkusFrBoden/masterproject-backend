const router = require("express").Router();
const DMM = require("../models/FlexibleDMM");

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
router.delete('/deleteMultipleDmms', async (req, res) => {
    const dmmIds = req.body.dmmIds;
    if (!dmmIds || !Array.isArray(dmmIds)) {
        return res.status(400).json({ error: 'dmmIds is not a valid array.' });
    }
    try {
        const result = await DMM.deleteMany({ _id: { $in: dmmIds } });
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting dmms:', error);
        res.status(500).json({ error: 'Could not delete dmms.' });
    }
});

module.exports = router;
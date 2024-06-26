const router = require("express").Router();
const DMA = require("../models/FlexibleDMA");
const { Types } = require('mongoose');

// Get all DMAs
router.get('/DmaOverview', async (req, res) => {
    try {
        const dmas = await DMA.find().sort({ createdAt: 1 });
        res.status(200).json(dmas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch the documents' });
    }
});

// Get DMA by organization name
router.get('/DmaByOrganization/:organizationName', async (req, res) => {
    try {
        const dmas = await DMA.find({ createdFor: req.params.organizationName }).sort({ createdAt: -1 });
        res.status(200).json(dmas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch the documents' });
    }
});

// Get DMA by ID
router.get('/DmaById/:id', async (req, res) => {
    try {
        const dma = await DMA.findById(req.params.id);
        if (!dma) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json(dma);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch the document' });
    }
});

// Get counts of T values
router.get('/DmaTValues', async (req, res) => {
    try {
        const dmaCounts = await DMA.aggregate([
            {
                $group: {
                    _id: "$euDMA",
                    count: { $sum: 1 }
                }
            },
            {
                $match: {
                    _id: { $in: ["T0", "T1", "T2"] }
                }
            }
        ]);
        const counts = {
            T0: 0,
            T1: 0,
            T2: 0
        };
        dmaCounts.forEach(({ _id, count }) => {
            counts[_id] = count;
        });
        res.status(200).json(counts);
    } catch (error) {
        console.error('Error fetching document counts:', error);
        res.status(500).json({ error: 'Could not fetch the document counts' });
    }
});

// Create a new DMA
router.post('/Dma', async (req, res) => {
    try {
        const dma = new DMA(req.body);
        const savedDMA = await dma.save();
        res.status(201).json(savedDMA);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not create the document' });
    }
});

// Delete many dmas if it's not an EU-DMA
router.post('/deleteMultipleDmas', async (req, res) => {
    const dmaIds = req.body.dmaIds;
    if (!dmaIds || !Array.isArray(dmaIds)) {
        return res.status(400).json({ error: 'dmaIds is not a valid array.' });
    }
    const areValidIds = dmaIds.every(id => Types.ObjectId.isValid(id));
    if (!areValidIds) {
        return res.status(400).json({ error: 'One or more provided dma IDs are not valid.' });
    }
    try {
        for (const id of dmaIds) {
            const dma = await getDmaById(id);
            if (dma.euDMA != '0' && dma.euDMA != 'false' && dma.euDMA != 'kein EU-DMA mehr') {
                return res.status(200).json({ invalidIds: true });
            }
        }
        const result = await DMA.deleteMany({ _id: { $in: dmaIds } });
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting dmas:', error);
        res.status(500).json({ error: 'Could not delete dmas.' });
    }
});
// Check if it's an EU-DMA
async function getDmaById(id) {
    if (Types.ObjectId.isValid(id)) {
        const dma = await DMA.findById(id);
        if (!dma) {
            throw new Error(`DMA document with ID ${id} not found.`);
        }
        return dma;
    } else {
        throw new Error(`Not a valid DMA document ID: ${id}`);
    }
}

// Update DMA by ID
router.patch('/DmaById/:id', async (req, res) => {
    try {
        const updatedDMA = await DMA.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDMA) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json(updatedDMA);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not update the document' });
    }
});

module.exports = router;
const router = require("express").Router();
const User = require("../models/FlexibleUSER");

// ---------------------------- User ----------------------------------
// Get all users
router.get('/UsersOverview', async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch the documents' });
    }
});

// Get user by email
router.get('/UserByMail/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }, { password: 0 });
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch the document' });
    }
});

// Get user by ID
router.get('/UserById/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id, { password: 0 });
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch the document' });
    }
});

// Get user by email and password
router.get('/UserByMailAndPassword/:email/:password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email, password: req.params.password }, { password: 0 });
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch the document' });
    }
});

// Create a new user
router.post('/User', async (req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not create the document' });
    }
});

// Update user by ID
router.patch('/UserById/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not update the document' });
    }
});

// ---------------------------- Organization ----------------------------------
// Get organization by name
router.get('/OrganizationByName/:organizationName', async (req, res) => {
    try {
        const organization = await User.findOne({ 'organization.name': req.params.organizationName });
        res.status(200).json(organization);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch the document' });
    }
});

// Get all organizations
router.get('/OrganizationOverview', async (req, res) => {
    try {
        const organizations = await User.aggregate([
            { $match: { 'organization.name': { $ne: 'EDIH Thuringia' } } },
            { $group: { _id: "$organization.name", organization: { $first: "$organization" } } }
        ]);
        res.status(200).json(organizations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch the documents' });
    }
});

// Update organization's DMA status by ID
router.patch('/OrganizationDmaStatusById/:id', async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        const updateDmaStatus = { $set: { "organization.euDmaStatus": req.body.organization.euDmaStatus } };
        const updateDmaResults = { $push: { "organization.euDmaResults": req.body.organization.euDmaResults } };
        const updateLastDma = { $set: { "organization.lastDma": req.body.organization.lastDma } };

        await User.updateOne(filter, updateDmaStatus);
        await User.updateOne(filter, updateDmaResults);
        const result = await User.updateOne(filter, updateLastDma);
        
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not update the document' });
    }
});

// Delete multiple organizations
router.post('/deleteMultipleOrganizations', async (req, res) => {
    const orgaNames = req.body.orgaNames;
    if (!orgaNames || !Array.isArray(orgaNames)) {
        return res.status(400).json({ error: 'orgaNames is not a valid array.' });
    }
    try {
        const result = await User.deleteMany({ 'organization.name': { $in: orgaNames } });
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting organization:', error);
        res.status(500).json({ error: 'Could not delete Organization.' });
    }
});

module.exports = router;
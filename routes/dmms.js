const router = require("express").Router();
const FlexibleDMM = require("../models/FlexibleDMM"); // Stelle sicher, dass der Pfad zum Modell korrekt ist

router.get('/DmmOverview', (req, res) => {
    FlexibleDMM.find()
        .sort({ createdAt: 1 })
        .then(dmms => {
            res.status(200).json(dmms);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Could not fetch the documents' });
        });
});

module.exports = router;
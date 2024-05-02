const mongoose = require('mongoose');

// Definiere das flexible Schema
const FlexibleSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('FlexibleDMM', FlexibleSchema,'DMMs');
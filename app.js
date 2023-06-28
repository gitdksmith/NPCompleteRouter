const express = require('express');
const app = express();
const NationalParksAPIProxy = require('./routes/NationalParksAPI').router;
app.use('/npapi', NationalParksAPIProxy);
module.exports = app;
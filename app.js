require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const express = require('express');
const app = express();

const NationalParksAPIProxy = require('./routes/NationalParksAPI').npProxy;
app.use('/npapi', NationalParksAPIProxy);

module.exports = app;
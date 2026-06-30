/**
 * main.js - Routes for the main landing page
 */
const express = require('express');
const router = express.Router();

/**
 * GET /
 * Purpose: Display the main home page with links to Organiser and Attendee
 * Inputs: None
 * Outputs: Renders index.ejs
 */
router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;
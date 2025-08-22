const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const feedbackPath = path.join(__dirname, '../data/feedback.json');

// POST
router.post('/', (req, res) => {
    const { recipeId, feedback } = req.body;

    if (!recipeId) {
        return res.status(400).json({ error: 'Missing paramter: request'});
    }

    try {
        let feedbacks = [];
        if (fs.existsSync(feedbackPath, 'utf-8')) {
            feedbacks = JSON.parse(data);
        }

        feedbacks.push({
            recipeId,
            feedback
        });
        fs.writeFileSync(feedbackPath, JSON.stringify(feedbacks, null, 2));
        res.json({ message: 'Feedback saved successfully!' });

    } catch(error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
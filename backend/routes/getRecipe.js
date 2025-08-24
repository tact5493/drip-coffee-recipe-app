const express = require('express');
const router = express.Router();
const recipes = require('../data/recipes.json');

router.post('/', (req, res) => {
    const { beans, taste, temperature, amount} = req.query;
    
    if (!beans || !taste || !temperature || !amount || isNaN(Number(amount))) {
        return res.status(400).json({ error: 'Missing Parameter' });
    }

    const numAmount = Number(amount);
    const recipe = recipes.find(r =>
        r.beans === beans &&
        r.taste === taste &&
        r.temperature === temperature &&
        Number(r.amount) === numAmount
    );

    if (!recipe) {
        return res.status(404).json({ error: 'No matching recipes found' })
    }

    const factor = numAmount / recipe.amount;
    const adjustedRecipe = JSON.parse(JSON.stringify(recipe)); //copy of recipe

    if (Array.isArray(adjustedRecipe.steps)) {
           adjustedRecipe.steps.forEach(step => {
            if (typeof step.water === 'number') {
                step.water = Math.round(step.water * factor);
            }
       });
    }
    adjustedRecipe.amount = numAmount; //userのamountに変更
    adjustedRecipe.beans_amount = Math.round(recipe.beans_amount * factor * 10) / 10;

    res.json(adjustedRecipe);
});

module.exports = router;
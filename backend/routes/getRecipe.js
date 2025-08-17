async function getRecipe(userInput) {
    /**
     * userInput = {
     *      beans: "dark",
     *      taste: "bitter",
     *      temperture: "hot",
     *      amount: 200
     * }
     */
    try {
        // get recipe.json
        const response = await fetch('data/recipe.json');
        const recipes = await response.json();
        
        // userInputに一致するレシピをフィルタ
        const filtered = recipes.filter(recipe => 
            recipe.beans === userInput.beans &&
            recipe.taste === userInput.taste &&
            recipe.temperature === userInput.temperature
        );
        if (filtered.length === 0) {
            return null;
        }

        // 量に応じて水の量を調整
        const recipe = JSON.parse(JSON.stringify(filtered[0]));
        const factor = userInput.amount / recipe.amount;
        recipe.steps.forEach(step => {
            step.water = Math.round(step.water * factor);
        });
        recipe.amount = userInput.amount;

        return recipe;

    } catch (error) {
        console.error("Error: get recipe", error);
        return null;
    }
}
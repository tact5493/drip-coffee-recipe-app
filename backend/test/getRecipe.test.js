// getRecipe.test.js
import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';

// getRecipe関数のインポート例
import { getRecipe } from '../routes/getRecipe.js';

// モック用のrecipes.json
const recipesMock = [
    {
        "id": 1,
        "name": "深煎りホットコーヒー（200g）",
        "beans": "dark",
        "amount": 200,
        "taste": "bitter",
        "temperature": "ホット",
        "steps": [
            { "step": 1, "water": 40, "duration_sec": 30 },
            { "step": 2, "water": 30, "duration_sec": 30 }
        ]
    },
    {
        "id": 2,
        "name": "浅煎りホットコーヒー（200g）",
        "beans": "light",
        "amount": 200,
        "taste": "sweet",
        "temperature": "ホット",
        "steps": [
            { "step": 1, "water": 40, "duration_sec": 30 },
            { "step": 2, "water": 120, "duration_sec": 50 }
        ]
    }
];

// fetch をモック
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(recipesMock)
    })
);

describe('getRecipe', () => {
    test('条件に合うレシピを取得できる', async () => {
        const userInput = {
            beans: "dark",
            taste: "bitter",
            temperature: "ホット",
            amount: 200
        };

        const recipe = await getRecipe(userInput);

        expect(recipe).not.toBeNull();
        expect(recipe.name).toBe("深煎りホットコーヒー（200g）");
        expect(recipe.amount).toBe(200);
        expect(recipe.steps.length).toBe(2);
        expect(recipe.steps[0].water).toBe(40);
    });

    test('量に応じて水量が調整される', async () => {
        const userInput = {
            beans: "dark",
            taste: "bitter",
            temperature: "ホット",
            amount: 400
        };

        const recipe = await getRecipe(userInput);
        expect(recipe.steps[0].water).toBe(80); // 40 * 400/200
        expect(recipe.steps[1].water).toBe(60); // 30 * 400/200
    });

    test('条件に合わない場合は null を返す', async () => {
        const userInput = {
            beans: "medium",
            taste: "bitter",
            temperature: "ホット",
            amount: 200
        };

        const recipe = await getRecipe(userInput);
        expect(recipe).toBeNull();
    });
});
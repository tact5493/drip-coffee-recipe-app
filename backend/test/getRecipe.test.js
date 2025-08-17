const request = require('supertest');
const express = require('express');
const getRecipeRoute = require('../routes/getRecipe');

const app = express();
app.use(express.json());
app.use('/api/getRecipe', getRecipeRoute);

describe('GET /api/getRecipe', () => {
    it('should return a recipe for valid parameters', async () => {
        const res = await request(app)
            .get('/api/getRecipe')
            .query({
                beans: 'dark',
                taste: 'bitter',
                temperature: 'hot',
                amount: 200
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('beans', 'dark');
        expect(res.body).toHaveProperty('taste', 'bitter');
        expect(res.body).toHaveProperty('temperature', 'hot');
        expect(res.body).toHaveProperty('amount', 200);
        expect(Array.isArray(res.body.steps)).toBe(true);
    });

    it('should return 400 if missing parameters', async () => {
        const res = await request(app)
            .get('/api/getRecipe')
            .query({ beans: 'dark' });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should return 404 if no matching recipe', async () => {
        const res = await request(app)
            .get('/api/getRecipe')
            .query({
                beans: 'unknown',
                taste: 'bitter',
                temperature: 'hot',
                amount: 999
            });
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
    });
});
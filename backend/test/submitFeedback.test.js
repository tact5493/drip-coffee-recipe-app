const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');

// テスト用サーバーのセットアップ
const app = express();
app.use(express.json());
app.use('/', require('../routes/submitFeedback'));

const feedbackPath = path.join(__dirname, '../data/feedback.json');

// テスト前にフィードバックファイルを初期化
beforeEach(() => {
    fs.writeFileSync(feedbackPath, '[]', 'utf-8');
});

describe('POST /', () => {
    it('新しいレシピIDのフィードバックを追加できる', async () => {
        const res = await request(app)
            .post('/')
            .send({
                recipeId: 99,
                feedback: { comment: 'test', rating: 5, time: '2025-08-23T12:00:00' }
            });
        expect(res.statusCode).toBe(200);

        // ファイルの内容を確認
        const data = JSON.parse(fs.readFileSync(feedbackPath, 'utf-8'));
        expect(data).toEqual([
            {
                recipeId: 99,
                feedback: [
                    { comment: 'test', rating: 5, time: '2025-08-23T12:00:00' }
                ]
            }
        ]);
    });

    it('既存レシピIDのフィードバック配列に追加できる', async () => {
        // 事前に1件追加
        fs.writeFileSync(feedbackPath, JSON.stringify([
            {
                recipeId: 99,
                feedback: [
                    { comment: 'first', rating: 4, time: '2025-08-23T11:00:00' }
                ]
            }
        ]), 'utf-8');

        const res = await request(app)
            .post('/')
            .send({
                recipeId: 99,
                feedback: { comment: 'second', rating: 5, time: '2025-08-23T12:00:00' }
            });
        expect(res.statusCode).toBe(200);

        // ファイルの内容を確認
        const data = JSON.parse(fs.readFileSync(feedbackPath, 'utf-8'));
        expect(data[0].feedback.length).toBe(2);
        expect(data[0].feedback[1].comment).toBe('second');
    });
});
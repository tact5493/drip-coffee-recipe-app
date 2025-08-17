const express = require('express');
const cors = require('cors');

const getRecipeRoute = require('./routes/getRecipe');
const submitFeedbackRoute = require('./routes/submitFeedback');

const app = express();
const port = 3000;

app.use(cors()); // フロントと通信するため
app.use(express.json()); // JSONリクエストをパース

// ルーティング
app.use('/api/getRecipe', getRecipeRoute);
app.use('/api/submitFeedback', submitFeedbackRoute);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
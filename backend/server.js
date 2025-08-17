const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

// ミドルウェア
app.use(cors()); // フロントエンドからのアクセス許可
app.use(express.json()); // JSONボディをパース

// データ読み込み
const recipesPath = path.join(__dirname, "data", "recipes.json");
let recipes = [];

try {
  const data = fs.readFileSync(recipesPath, "utf-8");
  recipes = JSON.parse(data);
} catch (err) {
  console.error("Error loading recipes.json:", err);
}

// エンドポイント: POST /get-recipe
app.post("/get-recipe", (req, res) => {
  const { beans, taste, temperature, amount } = req.body;

  // 入力チェック
  if (!beans || !taste || !temperature || !amount) {
    return res.status(400).json({ error: "Invalid input" });
  }

  // 条件に一致するレシピを探す
  const filtered = recipes.filter(
    (r) =>
      r.beans === beans &&
      r.taste === taste &&
      r.temperature.toLowerCase() === temperature.toLowerCase()
  );

  if (filtered.length === 0) {
    return res.status(404).json({ error: "No recipe found" });
  }

  // マッチしたレシピをコピー
  const recipe = JSON.parse(JSON.stringify(filtered[0]));

  // 量に応じて水の量をスケーリング
  const factor = amount / recipe.amount;
  recipe.steps.forEach((s) => {
    s.water = Math.round(s.water * factor);
  });
  recipe.amount = amount;

  res.json(recipe);
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
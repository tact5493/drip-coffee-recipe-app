document.getElementById("recipe-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // フォーム入力を取得
  const userInput = {
    beans: document.getElementById("beans").value,
    taste: document.getElementById("taste").value,
    temperature: document.getElementById("temperature").value,
    amount: Number(document.getElementById("amount").value),
  };

  try {
    // バックエンドにリクエスト送信
    const response = await fetch("http://localhost:3000/get-recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInput),
    });

    const recipe = await response.json();

    // 結果を描画
    const resultDiv = document.getElementById("recipe-result");
    resultDiv.innerHTML = "";

    if (!recipe || !recipe.steps) {
      resultDiv.innerHTML = "<p>該当するレシピが見つかりませんでした。</p>";
      return;
    }

    // レシピ名
    const title = document.createElement("h2");
    title.textContent = recipe.name;
    resultDiv.appendChild(title);

    // ステップ一覧
    const ul = document.createElement("ul");
    recipe.steps.forEach((step) => {
      const li = document.createElement("li");
      li.textContent = `ステップ${step.step}: お湯 ${step.water}ml（${step.duration_sec}秒）`;
      ul.appendChild(li);
    });
    resultDiv.appendChild(ul);

  } catch (error) {
    console.error("Error fetching recipe:", error);
    document.getElementById("recipe-result").innerHTML =
      "<p>エラーが発生しました。</p>";
  }
});
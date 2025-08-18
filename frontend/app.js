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
    let totalAmount = 0;
    let totalTime = 0;
    let totalTimeMin = 0;
    let totalTimeSec = 0;

    recipe.steps.forEach((step) => {
        const li = document.createElement("li");
        totalAmount += Number(step.water);
        totalTime += Number(step.duration_sec);
        totalTimeMin = Math.floor(totalTime / 60);
        totalTimeSec = totalTime % 60;
        li.innerHTML = `<span class="step-label">Step${step.step}:</span><br />Water input-${step.water}ml (total-${totalAmount}ml)<br />Time ${totalTimeMin}m ${totalTimeSec}s`;
        ul.appendChild(li);
    });
    resultDiv.appendChild(ul);

    // async function showSteps(steps) {
    //   for (let i = 0; i < steps.length; i++) {
    //     const step = steps[i];
    //     totalAmount += Number(step.water);
    //     totalTime += Number(step.duration_sec);
    //     const totalTimeMin = Math.floor(totalTime / 60);
    //     const totalTimeSec = totalTime % 60;

    //     // liタグ生成
    //     const li = document.createElement("li");
    //     li.innerHTML = `<span class="step-label">Step${step.step}:</span><br />Water input-${step.water}ml, total-${totalAmount}ml<br />Time ${totalTimeMin}m ${totalTimeSec}s`;
    //     ul.appendChild(li);

    //     // Step1は即時表示、2ステップ目以降は前ステップのduration_sec秒待機
    //     if (i < steps.length - 1) {
    //       await new Promise(resolve => setTimeout(resolve, step.duration_sec * 1000));
    //     }
    //   }
    // }

    // // ステップ表示開始
    // await showSteps(recipe.steps);
    
    
  } catch (error) {
    console.error("Error fetching recipe:", error);
    document.getElementById("recipe-result").innerHTML =
      "<p>エラーが発生しました。</p>";
  }
});
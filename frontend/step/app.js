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
    title.textContent = `${recipe.name} (${userInput.amount}ml)`;
    resultDiv.appendChild(title);

    // ステップ一覧
    const ul = document.createElement("ul");
    resultDiv.appendChild(ul);
    let totalAmount = 0;
    let totalTime = 0;

    // カウントアップタイマー付きステップ表示関数
    async function showSteps(steps) {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        totalAmount += Number(step.water);
        totalTime += Number(step.duration_sec);
        const totalTimeMin = Math.floor(totalTime / 60);
        const totalTimeSec = totalTime % 60;

        // liタグ生成
        const li = document.createElement("li");
        li.innerHTML = `
          <span class="step-label">Step${step.step}:</span>
          <table style="margin-top:8px; margin-bottom:8px;">
            <tr>
              <td style="padding-right:12px; font-weight:bold;">Input Water:</td>
              <td><strong>${step.water}ml</strong> (total ${totalAmount}ml)</td>
            </tr>
            <tr>
              <td style="padding-right:12px; font-weight:bold;">Time:</td>
              <td>${totalTimeMin}m ${totalTimeSec}s</td>
            </tr>
          </table>
        `;

        // タイマー表示用spanを追加
        const timerSpan = document.createElement("span");
        timerSpan.style.fontWeight = "bold";
        timerSpan.style.marginLeft = "8px";
        timerSpan.style.fontSize = "1.5em"
        timerSpan.textContent = "Count: 0.0s";
        li.appendChild(document.createElement("br"));
        li.appendChild(timerSpan);

        ul.appendChild(li);

        // カウントアップタイマーのロジック（0.1秒単位）
        let elapsed = 0;
        timerSpan.textContent = `Count: 0.0s`;

        await new Promise(resolve => {
          const intervalId = setInterval(() => {
            elapsed += 0.1; // 0.1秒ずつ加算
            timerSpan.textContent = `Count: ${elapsed.toFixed(1)}s`;
            // 指定秒数に達したら停止
            if (elapsed >= step.duration_sec) {
              clearInterval(intervalId);
              timerSpan.textContent = `Count: ${step.duration_sec.toFixed(1)}s`; // 最終値を揃える
              resolve();
            }
          }, 100); // 100msごとに更新
        });
      }
    }

    // ステップ表示開始
    await showSteps(recipe.steps);

  } catch (error) {
    console.error("Error fetching recipe:", error);
    document.getElementById("recipe-result").innerHTML =
      "<p>エラーが発生しました。</p>";
  }
});
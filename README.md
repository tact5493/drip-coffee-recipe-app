# Coffee Resipe app
## Overview
このアプリは、ユーザーの好みに合わせて最適なドリップコーヒーレシピを提供するMVPです。  
好みの入力に応じて、手順と抽出時間をステップごとに表示し、ユーザーからのフィードバックを反映してレシピを改善できます。

---

## Function

### 1. 好みの入力
- チェックボックスやフォームで入力
- 入力例：
  - 使用量（50g刻み）
  - 甘み or 苦味
  - ホット or アイス（氷の量）
  - 使用豆の種類（深煎り / 浅煎り）

### 2. レシピ出力
- 入力条件に応じてDBからレシピを取得
- 抽出手順をステップごとに表示
- 秒数カウントで次の手順へ自動更新（オプション）

### 3. フィードバックループ
- 「良い / 普通 / だめ」を選択可能
- フィードバックをDBに保存し、レシピ改善に活用

---

## Tech Stack(for MVP)
### フロントエンド
- React または Vanilla JS + HTML/CSS

### バックエンド / サーバレス
- AWS Lambda（Node.js or Python）
- API Gateway
- DynamoDB（レシピとフィードバック管理）

### 代替案（簡易プロトタイプ用）
- DB代わりに Googleスプレッドシート / Airtable
- ホスティング: Vercel / Netlify

---

## Data Structure (Overview)
- Recipes テーブル
  - id
  - 豆の種類
  - 焙煎度
  - 量
  - 甘み/苦味
  - 手順リスト
  - 平均評価

- Feedback テーブル
  - user_id
  - recipe_id
  - 評価（良い/普通/だめ）

---

## Future Enhancements
- ユーザーが自分のレシピを登録・共有
- モバイルアプリ化（Flutter / React Native）
- 秒数カウントや通知機能の追加
- SNS連携でシェアやバズを狙う
### フロントエンド
- React または Vanilla JS + HTML/CSS

### バックエンド / サーバレス
- AWS Lambda（Node.js or Python）
- API Gateway
- DynamoDB（レシピとフィードバック管理）

### 代替案（簡易プロトタイプ用）
- DB代わりに Googleスプレッドシート / Airtable
- ホスティング: Vercel / Netlify

---

## Development Rule

### Branch Strategy
- `main`: 本番用
- `develop`: 開発用
- `feature/xxxx`: 新機能開発
- `fix/xxxx`: バグ修正

### コミットメッセージ
[コミット種別] 要約
#### コミット種別
- FIX：バグ修正
- ADD：新規（ファイル）機能追加
- UPDATE：機能修正（バグではない）
- REMOVE：削除（ファイル）
#### example
[ADD] REDAME.md

---

## Directory Structure
```
drip-coffee-recipe-app/
├─ frontend/                      # ユーザーが操作する画面（HTML・CSS・JS）
│  ├─ index.html                  # 入力フォームと結果表示のページ
│  ├─ styles.css                  # 画面の見た目を整えるスタイル
│  └─ app.js                      # 入力内容をAPIに送り、結果を表示するスクリプト
│
├─ backend/                       # レシピAPIやフィードバックAPIなどサーバー側
│  ├─ server.js                   # サーバーの起動・APIのルーティング
│  ├─ data/
│  │   └─ recipes.json            # レシピデータ（JSON形式）
│  ├─ routes/
│  │   ├─ getRecipe.js            # レシピ取得APIの処理
│  │   └─ submitFeedback.js       # フィードバック送信APIの処理
│  └─ test/
│      └─ getRecipe.test.js       # レシピ取得APIのテストコード
│
├─ README.md                      # プロジェクトの説明・使い方
└─ .gitignore                     # Git管理から除外するファイル一覧
```
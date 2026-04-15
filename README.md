# AI Powered Product Generator

## 📌 Overview

AI Product Generator is a full-stack web application that generates product card details (title, description, and tags) using AI.

Users can input a product name and category, and the system dynamically generates structured product content and displays it in a clean, styled UI.

---

## 🛠 Tech Stack

### 🔹 Frontend

* React (Vite)
* JavaScript (ES6+)
* Custom CSS (Modern UI Design)

### 🔹 Backend

* Node.js
* Express.js (API server)

### 🔹 AI Integration

* REST API-based AI content generation

---

## ✨ Features

* Input form for product name & category
* AI-generated:

  * Product Title
  * Description
  * Tags
* Clean and responsive UI
* Loading indicator while fetching AI data
* Regenerate functionality
* Refresh button to reset form and results
* Form validation (input handling)

---

## 📂 Project Structure

```bash
ai-product-generator/
│
├── server/                     # Backend (Node + Express)
│   ├── index.js
│   ├── package.json
│   ├── .env                   # Environment variables (NOT committed)
│   └── node_modules/
│
├── src/                       # Frontend (React)
│   ├── assets/
│   ├── components/
│   │   ├── Form.jsx
│   │   ├── ProductCard.jsx
│   │   └── Loader.jsx
│   │
│   ├── services/
│   │   └── aiService.js
│   │
│   ├── styles/
│   │   └── app.css
│   │
│   ├── utils/
│   │   └── validate.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── .gitignore
```

---

## ⚙️ Setup Instructions

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-product-generator.git
cd ai-product-generator
```

---

### 🔹 2. Install Frontend Dependencies

```bash
npm install
```

---

### 🔹 3. Install Backend Dependencies

```bash
cd server
npm install
npm install express cors dotenv axios
```

---

## 📦 Backend Dependencies

The backend uses the following packages:

* **express** → Web server framework
* **cors** → Enables communication between frontend & backend
* **dotenv** → Loads environment variables securely
* **axios** → Makes API calls to AI service
---

### 🔹 4. Setup Environment Variables

Create a `.env` file inside `/server`:

```env
PORT=5000
AI_API_KEY=your_api_key_here
```

⚠️ Do not commit `.env` file to GitHub.

---

### 🔹 5. Run Backend Server

```bash
cd server
npm start
```

Server runs at:

```
http://localhost:5000
```

---

### 🔹 6. Run Frontend

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🧠 How AI Integration Works

1. User enters product name & category
2. Frontend sends request to backend API
3. Backend sends prompt to AI service using `axios`
4. AI generates:

   * Title
   * Description
   * Tags
5. Backend returns structured JSON
6. Frontend renders data as a product card

---

## 📄 Example AI Response

```json
{
  "title": "Smart Fitness Watch Pro X",
  "description": "Track your daily activities, monitor your heart rate, and receive personalized fitness insights.",
  "tags": ["fitness", "smartwatch", "wearable"]
}
```

---

## 💡 Design Decisions

* Used component-based architecture for scalability
* Separated frontend and backend for better maintainability
* Created a service layer (`aiService.js`) for API calls
* Implemented reusable UI components
* Focused on clean UI/UX and readability

---

## 📌 Author

**Dipanshu Sandhaki**

---

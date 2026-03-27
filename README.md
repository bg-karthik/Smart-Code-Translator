# 🚀 Smart Code Translator

An AI-powered web application that helps developers **translate, analyze, optimize, and understand code** across multiple programming languages.

---

## 🌟 Features

* 🔄 **Code Translation**
  Convert code between languages like Python, Java, C, C++, and C#

* 📊 **Complexity Analysis**
  Get time and space complexity with explanations

* ⚡ **Code Optimization**
  Improve performance with AI suggestions

* 🧠 **Code Explanation**
  Understand code in simple language

* 🕘 **History Tracking**
  Save and revisit previous operations

* 🔐 **Authentication**

  * Email & Password login
  * Google OAuth login

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* Monaco Editor
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### AI Integration

* Google Gemini API

---

## 📁 Project Structure

```
smart-code-translator/
├── client/       # Frontend (React)
├── server/       # Backend (Node.js)
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

### 🔹 Backend (`server/.env`)

```
PORT=5000
CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_api_key
```

### 🔹 Frontend (`client/.env`)

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/smart-code-translator.git
cd smart-code-translator
```

---

### 2️⃣ Install Dependencies

#### Backend

```
cd server
npm install
```

#### Frontend

```
cd ../client
npm install
```

---

### 3️⃣ Run Application

#### Start Backend

```
cd server
npm run dev
```

#### Start Frontend

```
cd client
npm run dev
```

---

## 🌐 API Endpoints

### 🔐 Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/google`
* `GET /api/auth/me`

### 💻 Code Features

* `POST /api/code/translate`
* `POST /api/code/analyze`
* `POST /api/code/optimize`
* `POST /api/code/explain`

### 🕘 History

* `GET /api/history`
* `DELETE /api/history/:id`
* `DELETE /api/history/clear`

---

## ⚠️ Important Notes

* Do NOT commit `.env` files
* Keep API keys secure
* Use a new Gemini API key if exposed

---

## 📦 Deployment

* Frontend → Vercel
* Backend → Render
* Database → MongoDB Atlas

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork and improve the project.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Karthik**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

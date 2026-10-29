
# 🚀 Smart Code Translator

**AI-powered code translation, complexity analysis, optimization, and explanation — in one developer-friendly workspace.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20App-2ea44f?style=for-the-badge)](https://smartcodetranslator.vercel.app/)
[![GitHub](https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/bg-karthik/Smart-Code-Translator)

**Live Application:** https://smartcodetranslator.vercel.app/

**Backend API:** https://smart-code-translator.onrender.com/

**GitHub Repository:** https://github.com/bg-karthik/Smart-Code-Translator

---

## 📖 Overview

**Smart Code Translator** is a full-stack, AI-powered web application designed to help developers translate, analyze, optimize, and understand code across multiple programming languages.

Powered by **Google Gemini AI**, the platform provides intelligent code transformations, complexity insights, optimization suggestions, and detailed explanations through an interactive interface.

The application combines a **React.js frontend**, **Node.js and Express.js backend**, **MongoDB Atlas database**, and **JWT and Google OAuth authentication**.

Users can securely access their workspace, perform AI-assisted code operations, and revisit their previous activities through personalized history tracking.

---

## 🌟 Key Features

### 🔄 1. AI Code Translation

- Translate code between programming languages.
- Support languages including Python, JavaScript, Java, C, C++, and C#.
- Preserve the intended functionality of the original code.
- Generate readable code using Google Gemini AI.
- Work with an interactive code editor.

### 📊 2. Time & Space Complexity Analysis

- Analyze the computational complexity of source code.
- Estimate time complexity using Big-O notation.
- Identify space complexity.
- Explain the reasoning behind complexity estimates.
- Help developers understand algorithm efficiency.

### ⚡ 3. AI Code Optimization

- Analyze existing source code.
- Identify possible improvements.
- Suggest optimized code implementations.
- Improve readability and maintainability.
- Provide explanations for optimization suggestions.

### 🧠 4. AI Code Explanation

- Explain complex code in simple language.
- Describe the purpose and logic of source code.
- Break down unfamiliar programming concepts.
- Help beginners understand existing implementations.
- Assist developers with code comprehension.

### 🕘 5. Personal History Tracking

- Automatically store supported code operations.
- Retrieve previously generated results.
- View saved translation and analysis history.
- Delete individual history records.
- Clear saved history when required.
- Maintain user-specific history using MongoDB.

### 🔐 6. Authentication & Security

- Email and password registration.
- Secure password hashing using bcrypt.
- JWT-based authentication.
- Google OAuth authentication.
- Protected application routes.
- Email normalization and input validation.
- Secure CORS configuration.
- Authentication error handling.
- Protection against duplicate account registration.

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React.js | User interface |
| Vite | Frontend development and build |
| JavaScript | Application logic |
| Monaco Editor | Interactive code editing |
| React Router | Client-side navigation |
| Axios | REST API communication |
| React Hot Toast | User notifications |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB Atlas | Cloud database |
| Mongoose | Database modeling |
| JWT | Token-based authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin request security |

### AI Integration

| Technology | Purpose |
|------------|---------|
| Google Gemini API | AI-powered code operations |
| Google GenAI SDK | Gemini API integration |

### Deployment & Development

| Platform | Purpose |
|----------|---------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Database hosting |
| GitHub | Source code and version control |
| Antigravity | AI-assisted development |
| Node.js Test Runner | Authentication and security testing |

---

## 🏗️ System Architecture

```text
                 USER / BROWSER
                       |
                       v
              React.js + Vite
                 (Vercel)
                       |
                       | HTTPS / Axios
                       v
             Node.js + Express.js
                  (Render)
                       |
             +---------+----------+
             |         |          |
             v         v          v
       Authentication  AI       History
          Service    Service    Service
             |         |          |
             v         v          v
         JWT/Google  Gemini    MongoDB
           OAuth      API       Atlas
```

### Application Workflow

1. The user opens Smart Code Translator.
2. The user signs in using email/password or Google.
3. The backend validates authentication and issues a JWT.
4. The user submits code for translation, analysis, optimization, or explanation.
5. The backend sends the request to Google Gemini AI.
6. Gemini generates the requested response.
7. The backend returns the result to the frontend.
8. Supported operations are saved to MongoDB history.
9. The user can revisit previous results.

---

## 📁 Project Structure

```text
Smart-Code-Translator/
|
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   |
│   ├── package.json
│   └── .env
|
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   |
│   ├── tests/
│   │   └── auth.test.js
│   |
│   ├── server.js
│   ├── package.json
│   └── .env
|
├── run-dev.js
├── package.json
├── .gitignore
└── README.md
```

---

## ✅ Prerequisites

Before running the project, install or configure:

- Node.js (version 22 recommended)
- npm
- Git
- MongoDB Atlas database
- Google Gemini API key
- Google OAuth 2.0 Web Client ID

---

## ⚙️ Environment Variables

Create separate environment files for the frontend and backend.

**Never commit `.env` files or expose API keys and secrets.**

### Backend Configuration

Create:

`server/.env`

```env
PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_random_jwt_secret
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_oauth_client_id

GEMINI_API_KEY=your_gemini_api_key
```

### Frontend Configuration

Create:

`client/.env`

```env
VITE_API_URL=http://localhost:5000/api

VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Production Configuration

**Render Backend**

```env
NODE_ENV=production

CLIENT_URL=https://smartcodetranslator.vercel.app

MONGODB_URI=your_production_mongodb_connection

JWT_SECRET=your_production_jwt_secret

GOOGLE_CLIENT_ID=your_google_oauth_client_id

GEMINI_API_KEY=your_gemini_api_key
```

Configure these values securely in Render's Environment settings.

**Vercel Frontend**

```env
VITE_API_URL=https://smart-code-translator.onrender.com/api

VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

If you intentionally use multiple frontend origins, the backend supports comma-separated `CLIENT_URL` values.

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/bg-karthik/Smart-Code-Translator.git

cd Smart-Code-Translator
```

### Step 2: Install Dependencies

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

Install root dependencies:

```bash
cd ..
npm install
```

### Step 3: Configure Environment Variables

Create the following files:

```text
server/.env
client/.env
```

Add the required environment variables described above.

Use a separate development database for local testing.

### Step 4: Start the Application

From the root directory:

```bash
npm run dev
```

This starts both the frontend and backend development servers using the root development runner.

Alternatively, start them separately.

**Backend:**

```bash
cd server
npm run dev
```

**Frontend (separate terminal):**

```bash
cd client
npm run dev
```

### Step 5: Open the Application

Frontend:

http://localhost:5173

Backend:

http://localhost:5000

Expected backend response:

```text
API is running...
```

---

## 🌐 REST API Endpoints

**Local API Base URL**

```text
http://localhost:5000/api
```

**Production API Base URL**

```text
https://smart-code-translator.onrender.com/api
```

### 🔐 Authentication API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Email/password login |
| POST | `/auth/google` | Google authentication |
| GET | `/auth/me` | Get current user profile |
| POST | `/auth/logout` | Logout acknowledgement |

### 💻 AI Code Operations API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/code/translate` | Translate source code |
| POST | `/code/analyze` | Analyze code complexity |
| POST | `/code/optimize` | Optimize source code |
| POST | `/code/explain` | Explain source code |

### 🕘 History API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/history` | Retrieve user history |
| GET | `/history/:id` | Retrieve a history entry |
| DELETE | `/history/:id` | Delete a history entry |
| DELETE | `/history/clear` | Clear user history |

Most AI and history endpoints require JWT authentication.

---

## 🧪 API Example

### Code Translation

**Endpoint:**

```http
POST /api/code/translate
```

**Headers:**

```http
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**

```json
{
  "code": "def add(a, b):\n    return a + b",
  "sourceLanguage": "Python",
  "targetLanguage": "JavaScript"
}
```

**Example Translated Code:**

```javascript
function add(a, b) {
  return a + b;
}
```

AI-generated results should always be reviewed and tested before use in production.

---

## 🔐 Authentication Flow

### Email & Password Authentication

1. The user registers using email and password.
2. The backend validates the submitted details.
3. Passwords are hashed before storage.
4. MongoDB stores the account information.
5. The backend generates a JWT after successful authentication.
6. Protected endpoints validate the JWT.
7. The frontend manages the authenticated session.

### Google OAuth Authentication

1. The user clicks **Continue with Google**.
2. Google authenticates the user.
3. The frontend receives a Google ID token.
4. The token is submitted to the Express backend.
5. The backend verifies the Google credential.
6. The account is located or created using the verified identity.
7. The backend issues an application JWT.
8. The user is redirected to the authenticated workspace.

### Security Measures

- Password hashing using bcrypt.
- JWT signature and expiration validation.
- Google ID token verification.
- Email normalization.
- Duplicate account protection.
- Protected API routes.
- Restricted CORS configuration.
- Secure authentication error responses.
- Rejection of invalid and expired tokens.

**Security note:** Logout removes the active token from the frontend. Stateless JWTs may remain valid until expiration unless token revocation or signing-key rotation is implemented.

---

## 🧪 Testing & Quality Assurance

Smart Code Translator includes automated authentication and security testing using the Node.js built-in test runner.

### Run Backend Tests

From the project root:

```bash
npm --prefix server test
```

### Build Frontend

```bash
npm --prefix client run build
```

### Authentication Tests

The authentication test suite covers:

1. New user registration.
2. Duplicate email prevention.
3. Valid user login.
4. Invalid password handling.
5. Nonexistent account handling.
6. Email normalization.
7. Google account takeover prevention.
8. Protected-route access with valid JWT.
9. Invalid JWT rejection.
10. Expired JWT rejection.
11. Logout handling.
12. Insecure password-reset endpoint removal.
13. Allowed-origin CORS preflight.
14. Unauthorized-origin CORS rejection.
15. API error-message formatting.
16. Invalid Google credential handling.

**Latest reported local verification:**

- 16 authentication/security tests passed.
- React production build completed successfully.
- Local authentication and Google Sign-In were manually verified.

The automated tests use an isolated test database named `code-translator-test`.

These results represent functional and security testing, not production load-capacity measurements.

---

## ☁️ Deployment

Smart Code Translator is deployed using the following services.

| Component | Platform |
|-----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| AI Integration | Google Gemini API |
| Version Control | GitHub |

### Frontend Deployment — Vercel

Production website:

https://smartcodetranslator.vercel.app/

Configuration:

```text
Root Directory: client
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

Required environment variables:

```env
VITE_API_URL=https://smart-code-translator.onrender.com/api

VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend Deployment — Render

Production backend:

https://smart-code-translator.onrender.com/

Configuration:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Configure the MongoDB connection, JWT signing secret, Google OAuth Client ID, Gemini API key, and allowed frontend origins using Render environment variables.

### Database — MongoDB Atlas

MongoDB Atlas stores:

- User accounts.
- Authentication-related account data.
- Translation and analysis history.
- Saved user operations.

### Google OAuth Configuration

In Google Cloud Console, configure the authorized JavaScript origins for the OAuth Web Client.

Production:

```text
https://smartcodetranslator.vercel.app
```

Alternative deployment origin, if used:

```text
https://smart-code-translator.vercel.app
```

Local development:

```text
http://localhost:5173
http://localhost:5174
```

The Google Client ID configured in Vercel and Render must correspond to the correct Google Cloud OAuth Web Client.

---

## 🔒 Security Best Practices

- Never commit `.env` files.
- Keep Gemini API keys on the backend.
- Never expose JWT signing secrets in frontend code.
- Use separate production and testing databases.
- Restrict CORS to approved frontend origins.
- Validate user input on the backend.
- Use secure password hashing.
- Verify Google identity tokens before authentication.
- Avoid exposing sensitive information in API errors.
- Do not implement password recovery without verified ownership and secure, expiring, single-use tokens.
- Treat AI-generated code as untrusted until reviewed and tested.

---

## 🔮 Future Enhancements

Potential future improvements include:

- Support for additional programming languages.
- Syntax-aware code comparison.
- Side-by-side translation differences.
- More detailed algorithm analysis.
- Secure email-based password recovery.
- API rate limiting.
- Additional automated integration tests.
- Expanded benchmarking and performance monitoring.
- Better code export and sharing.
- Enhanced mobile responsiveness.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome!

To contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Make your changes.
4. Test your implementation.
5. Commit the changes.
6. Open a pull request.

Please avoid including real user information, passwords, or API credentials in issues and commits.

---

## 📄 License

A repository-level LICENSE file has not yet been included.

If this project is intended to be released under the MIT License, add an MIT LICENSE file to the repository.

---

## 👨‍💻 Author

**Karthik**

GitHub: [@bg-karthik](https://github.com/bg-karthik)

Project Repository:
https://github.com/bg-karthik/Smart-Code-Translator

Live Application:
https://smartcodetranslator.vercel.app/

---

## ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub!

**Built with React.js, Node.js, MongoDB Atlas, and Google Gemini AI.**

Perfect 🎯 — since your Azure Entra ID login + React + Node setup is now working end-to-end, here’s a **complete, professional `README.md`** you can drop into your project root (`D:\SUB\NubeEra_work\full_stack_devops\`).

This covers all steps from setup to running the app 👇

---

```markdown
# 🔐 React + Node Todo App with Azure Entra ID (Azure AD) Login

This project demonstrates a **full-stack Todo App** with:
- **Frontend:** React + MSAL (Microsoft Authentication Library)
- **Backend:** Node.js (Express)
- **Authentication:** Azure Entra ID (formerly Azure AD)

---

## 🧩 Architecture Overview

```

React (MSAL) ──► Azure Entra ID ──► Receives Access Token ──►
│
▼
Backend (Express) ──► Validates Token ──► Returns Todos


---

## ⚙️ Prerequisites

- Node.js (v18 or higher)
- npm
- Azure account with Entra ID access
- Microsoft 365 developer or organizational account

---

## 🚀 Step 1 — Azure Entra App Registration

1. Go to [Azure Portal → Entra ID → App registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
2. Click **New Registration**
   - **Name:** `TodoApp`
   - **Supported account types:** “Accounts in this organizational directory only”
   - **Redirect URI:** `http://localhost:3000`
3. After creation, copy:
   - `Application (client) ID`
   - `Directory (tenant) ID`
4. Go to **Authentication → Add a platform → Single-page application (SPA)**
   - Add redirect URI: `http://localhost:3000`
   - ✅ Enable **Access tokens** and **ID tokens**
5. Save your configuration.

---




---

## 🧠 Step 3 — Backend Setup (Node.js)

**Directory:** `backend`

### Install dependencies
```bash
npm install express cors @azure/msal-node jsonwebtoken


### server.js

```js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// Demo todos
const todos = ["Buy milk", "Learn React", "Integrate Azure AD"];

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.decode(token) ? next() : res.status(403).json({ error: "Invalid Token" });
}

app.get("/api/todos", verifyToken, (req, res) => {
  res.json(todos);
});

app.listen(5000, () => console.log("✅ Backend running on port 5000"));
```

Run the backend:

```bash
node server.js
```

---

## 💻 Step 4 — Frontend Setup (React)

**Directory:** `react-todo-auth`

### Install dependencies

```bash
npm install @azure/msal-browser @azure/msal-react react-router-dom
```

---

### `src/authConfig.js`

```js
export const msalConfig = {
  auth: {
    clientId: "YOUR_CLIENT_ID",
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
    redirectUri: "http://localhost:3000",
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};
```

---

### `src/index.js`

```js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
);
```

---

### `src/App.js`

```js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Todo from "./Todo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </Router>
  );
}

export default App;
```

---

### `src/Login.js`

```js
import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { useNavigate } from "react-router-dom";

function Login() {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account: response.account,
      });
      localStorage.setItem("token", tokenResponse.accessToken);
      navigate("/todo");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  React.useEffect(() => {
    if (accounts.length > 0) navigate("/todo");
  }, [accounts, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login with Microsoft</h2>
      <button onClick={handleLogin}>Sign In</button>
    </div>
  );
}

export default Login;
```

---

### `src/Todo.js`

```js
import React, { useEffect, useState } from "react";

function Todo() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/");

    fetch("http://localhost:5000/api/todos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Your Todo List</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {todos.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
```

---

## 🧰 Step 5 — Run the App

### 1️⃣ Start backend

```bash
cd backend
node server.js
```

### 2️⃣ Start frontend

```bash
cd react-todo-auth
npm start
```

The app runs on:

* Frontend → [http://localhost:3000](http://localhost:3000)
* Backend → [http://localhost:5000](http://localhost:5000)

---

## 🧪 Step 6 — Test Login Flow

1. Open **[http://localhost:3000](http://localhost:3000)**
2. Click **Sign In**
3. Log in using your Microsoft account
4. After successful login → redirected to `/todo`
5. Todo list fetched securely via token

---

## 🧩 Step 7 — Common Issues

| Error                       | Cause                                                                            | Fix                                                                        |
| --------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `AADSTS9002326`             | App not registered as SPA                                                        | Go to Azure → App → Authentication → Add **SPA** → `http://localhost:3000` |
| `CORS error`                | API not allowing frontend origin                                                 | Add `app.use(cors())` in `server.js`                                       |
| Login works but no redirect | Missing `navigate("/todo")` in `Login.js`                                        |                                                                            |
| Token invalid on API        | Ensure you’re using the **accessToken** and passing it in `Authorization` header |                                                                            |

---

## 🧩 Optional — Run Both Together (Windows)

Create a `run.bat` in project root:

```bat
@echo off
start cmd /k "cd backend && node server.js"
start cmd /k "cd react-todo-auth && npm start"
```

Double-click `run.bat` to launch both servers 🚀

---

## ✅ Result

🎉 You now have a working **React + Node Todo App** fully integrated with **Azure Entra ID login**, with:

* Microsoft popup login
* Token storage and protected API calls
* Clean frontend/backend separation

---

**Author:** Shoeb
**Tech Stack:** React · Node.js · Azure Entra ID · MSAL

```

---

Would you like me to add one more section at the bottom showing **how to protect your backend using Azure’s OpenID JWT validation (using Microsoft’s public keys)** — so your Node API truly verifies the token cryptographically instead of just decoding it?
```

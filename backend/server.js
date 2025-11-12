const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { ConfidentialClientApplication } = require("@azure/msal-node");

const app = express();
app.use(cors());
app.use(express.json());

// Example public todos
const todos = ["Buy milk", "Learn React", "Integrate Azure AD"];

// Middleware: verify token (from frontend)
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  // (Simplified demo verification)
  jwt.decode(token)
    ? next()
    : res.status(403).json({ error: "Invalid Token" });
}

app.get("/api/todos", verifyToken, (req, res) => {
  res.json(todos);
});

app.listen(5000, () => console.log("✅ Backend running on port 5000"));

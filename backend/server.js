// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Simple logger (put before routes)
app.use((req, res, next) => {
  console.log("👉", req.method, req.url);
  next();
});

// ---------- USERS FILE HELPERS ----------
const USERS_FILE = path.join(__dirname, "users.json");

function readUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const raw = fs.readFileSync(USERS_FILE, "utf8").trim();
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ Error reading users.json:", err);
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("❌ Error writing users.json:", err);
  }
}

// ---------- ROUTES ----------

// Root
app.get("/", (req, res) => {
  res.status(200).send("Backend is running successfully! 🚀");
});

// Test
app.get("/test", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Test route working ✅",
  });
});

// GET /register (just test)
app.get("/register", (req, res) => {
  res.status(200).json({
    ok: true,
    route: "GET /register working ✅",
  });
});

// POST /register  (SIGNUP)
app.post("/register", (req, res) => {
  console.log("🔔 /register hit, body =", req.body);

  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password required",
    });
  }

  const users = readUsers();
  const already = users.find((u) => u.email === email);

  if (already) {
    return res.status(409).json({
      success: false,
      message: "This email is already registered",
    });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password, // demo only — don't store plain passwords in production
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  return res.json({
    success: true,
    message: "User registered successfully",
  });
});

// LOGIN
app.post("/login", (req, res) => {
  console.log("🔔 /login hit, body =", req.body);

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required",
    });
  }

  const users = readUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  return res.json({
    success: true,
    name: user.name,
    message: "Login successful!",
  });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://127.0.0.1:${PORT}`);
});

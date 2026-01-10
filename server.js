const express = require("express");
const jsonServer = require("json-server");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// JSON Server setup
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

app.use(express.json());
app.use(middlewares);

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// APIs
app.use("/events", router);
app.use("/registeredEvents", router);
app.use("/users", router);

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

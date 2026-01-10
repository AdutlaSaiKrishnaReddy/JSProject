import express from "express";
import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON Server setup
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

app.use(express.json());
app.use(middlewares);

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// APIs
app.use("/", router);

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

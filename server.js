import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3000;

// Middlewares
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Serve frontend files
server.use(
  jsonServer.defaults({
    static: __dirname,
  })
);

// API routes
server.use(router);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

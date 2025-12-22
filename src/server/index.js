import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { GameManager } from "./GameManager.js";
import { setupSocketHandlers } from "./socketHandlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3004"],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3004;
const gameManager = new GameManager();

app.use(express.static(join(__dirname, "../../dist")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

app.get("/api/games", (req, res) => {
  res.json(gameManager.getAllGames());
});

app.get("/{*splat}", (req, res) => {
  res.sendFile(join(__dirname, "../../dist/index.html"));
});

setupSocketHandlers(io, gameManager);

server.listen(PORT, () => {
  console.log(`Red Tetris server running on http://localhost:${PORT}`);
});

export { app, server, io, gameManager };

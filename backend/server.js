import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";

import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import projectRoutes from "./src/routes/projects.js";
import sessionRoutes from "./src/routes/sessions.js";
import analyticsRoutes from "./src/routes/analytics.js";
import userRoutes from "./src/routes/users.js";
import { registerSocketHandlers } from "./src/sockets/index.js";

const app = express();
const server = http.createServer(app);

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/", (_req, res) => res.json({ name: "Sprinzen API", status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const io = new Server(server, {
  cors: { origin: CLIENT_ORIGIN, credentials: true },
});
registerSocketHandlers(io);
app.set("io", io);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => console.log(`🚀 Sprinzen API listening on :${PORT}`));
});

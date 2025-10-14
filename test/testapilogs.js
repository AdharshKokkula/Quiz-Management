import express from "express";
import logsRouter from "../views/api/logs.js"; // import the router

const app = express();
app.use(express.json());

// Mount the logs router at /api/logs
app.use("/api/logs", logsRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

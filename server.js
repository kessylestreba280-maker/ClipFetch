
const express = require("express");
const path = require("path");
const helmet = require("helmet");

const app = express();
const PORT = 3000;
app.disable("x-powered-by");
app.use(helmet());

app.use(express.json());

// Serve frontend files
app.use(express.static(__dirname));

// Test route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ClipFetch server is running!"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`ClipFetch is running at http://localhost:${PORT}`);
});

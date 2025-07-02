const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3002;

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Middleware to parse JSON
app.use(express.json());

// Mock data for blocks
const mockBlocks = [
  {
    id: 1,
    attributes: {
      data: "Block 1 data from local server",
    },
  },
  {
    id: 2,
    attributes: {
      data: "Block 2 data from local server",
    },
  },
  {
    id: 3,
    attributes: {
      data: "Block 3 data from local server",
    },
  },
];

// Status endpoint
app.get("/api/v1/status", (req, res) => {
  res.json({
    node_name: "Local Test Node",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

// Blocks endpoint
app.get("/api/v1/blocks", (req, res) => {
  res.json({
    data: mockBlocks,
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Local test server running on http://localhost:${PORT}`);
  console.log(`Status endpoint: http://localhost:${PORT}/api/v1/status`);
  console.log(`Blocks endpoint: http://localhost:${PORT}/api/v1/blocks`);
});

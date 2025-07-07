const express = require('express');
const axios = require('axios');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(express.json());

const DEPLOY_API_BASE = 'http://localhost:8000/api';  // Python deploy service

// NEW: POST /deploy → call FastAPI
app.post('/deploy', async (req, res) => {
  try {
    const response = await axios.post(`${DEPLOY_API_BASE}/deploy`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// NEW: GET /apps/:id/status → call FastAPI
app.get('/apps/:id/status', async (req, res) => {
  try {
    const response = await axios.get(`${DEPLOY_API_BASE}/apps/${req.params.id}/status`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// NEW: GET /apps/:id/logs → call FastAPI
app.get('/apps/:id/logs', async (req, res) => {
  try {
    const response = await axios.get(`${DEPLOY_API_BASE}/apps/${req.params.id}/logs`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// EXISTING: Proxy all traffic to /apps/:appId → http://<appId>:80
app.use('/apps/:appId', (req, res, next) => {
  const target = `http://${req.params.appId}:80`;
  return createProxyMiddleware({ target, changeOrigin: true })(req, res, next);
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Gateway listening on port ${PORT}`);
});


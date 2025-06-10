const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Example routing logic: forward /apps/:appId to the service named by :appId
app.use('/apps/:appId', (req, res, next) => {
  const target = `http://${req.params.appId}:80`;
  return createProxyMiddleware({ target, changeOrigin: true })(req, res, next);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Gateway listening on port ${PORT}`);
});

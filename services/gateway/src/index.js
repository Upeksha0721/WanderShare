require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors());

app.use('/api/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
  changeOrigin: true,
}));

app.use('/api/listings', createProxyMiddleware({
  target: process.env.LISTING_SERVICE_URL || 'http://localhost:5002',
  changeOrigin: true,
}));

app.use('/api/admin', createProxyMiddleware({
  target: process.env.ADMIN_SERVICE_URL || 'http://localhost:5003',
  changeOrigin: true,
}));

app.get('/health', (_, res) => res.json({ status: 'Gateway running' }));

app.listen(5000, () => console.log('API Gateway on port 5000'));
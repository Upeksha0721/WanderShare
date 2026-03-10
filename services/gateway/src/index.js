require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors());

app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  logLevel: 'debug',
}));

app.use('/api/listings', createProxyMiddleware({
  target: 'http://localhost:5002',
  changeOrigin: true,
  logLevel: 'debug',
}));

app.get('/health', (_, res) => res.json({ status: 'Gateway running' }));

app.listen(5000, () => console.log('API Gateway on port 5000'));
require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Route to Auth Service
app.use('/api/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
}));

// Route to Listing Service
app.use('/api/listings', createProxyMiddleware({
  target: process.env.LISTING_SERVICE_URL,
  changeOrigin: true,
}));

app.get('/health', (_, res) => res.json({ status: 'Gateway running ✅' }));

app.listen(process.env.PORT || 5000, () =>
  console.log(`API Gateway on port ${process.env.PORT || 5000}`)
);
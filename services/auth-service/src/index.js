require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth.routes'));

app.get('/health', (_, res) => res.json({ status: 'Auth service running' }));

app.listen(process.env.PORT || 5001, () =>
  console.log(`Auth service on port ${process.env.PORT || 5001}`)
);
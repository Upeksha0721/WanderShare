require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/admin', require('./routes/admin.routes'));

app.get('/health', (_, res) => res.json({ status: 'Admin service running ✅' }));

app.listen(process.env.PORT || 5003, () =>
  console.log(`Admin service on port ${process.env.PORT || 5003}`)
);
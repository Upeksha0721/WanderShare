require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/listings', require('./routes/listing.routes'));

app.get('/health', (_, res) => res.json({ status: 'Listing service running' }));

app.listen(process.env.PORT || 5002, () =>
  console.log(`Listing service on port ${process.env.PORT || 5002}`)
);
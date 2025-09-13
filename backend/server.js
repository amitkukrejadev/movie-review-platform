require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Global handlers (visible during development)
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION', err && err.stack ? err.stack : err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION', err && err.stack ? err.stack : err);
});

// middleware
app.use(cors());
app.use(express.json());

// routes (mounted AFTER DB connect below)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/users', require('./routes/users'));

// health
app.get('/', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    console.log('Starting HTTP server after DB connected');
    const server = app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );

    // graceful shutdown handlers
    const shutdown = (sig) => {
      console.log(`Received ${sig}. Shutting down...`);
      server.close(() => process.exit(0));
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('Failed to start server', err && err.stack ? err.stack : err);
    process.exit(1);
  }
};

start();

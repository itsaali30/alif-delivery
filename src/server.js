require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

const { initSocket } = require('./services/socket.service');
const authRoutes = require('./routes/auth.routes');
const orderRoutes = require('./routes/order.routes');
const earningsRoutes = require('./routes/earnings.routes');
const locationRoutes = require('./routes/location.routes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
initSocket(io);

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/location', locationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Alif Delivery - Rider Web App',
    timestamp: new Date().toISOString()
  });
});

// Single Page Application Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🛵 Alif Delivery Rider Web-App running at http://0.0.0.0:${PORT}`);
  console.log(`📦 Technologies: PostgreSQL, Prisma, Redis, Kafka, ClickHouse, MinIO, Socket.io, JWT, Vue.js & Bootstrap 5`);
});

module.exports = { app, server };

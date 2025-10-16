import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import prisma from './config/db.js';
import authRoute from './routes/authRoute.js';
import otpRoute from './routes/otpRoute.js';
import smsRoute from './routes/smsRoute.js';
import flightRoute from './routes/flightRoute.js';
import testRoute from './routes/testRoute.js';
import senderRoute from './routes/senderRoute.js';
import receiverRoute from './routes/receiverRoute.js';
import paymentRoute from './routes/paymentRoute.js';
import supportRoute from './routes/supportRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/otp', otpRoute);
app.use('/api/sms', smsRoute);
app.use('/api/flights', flightRoute);
app.use('/api/sender', senderRoute);
app.use('/api/receiver', receiverRoute);
app.use('/api/payment', paymentRoute);
app.use('/api', testRoute);
app.use('/api/support', supportRoute);

// Socket.IO
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Socket logic (same as before)
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('joinRoom', async (roomId) => {
    try {
      if (!roomId) return;
      socket.join(roomId);
      console.log(`📩 Socket ${socket.id} joined room ${roomId}`);

      const messages = await prisma.supportMessage.findMany({
        where: { userId: roomId },
        orderBy: { createdAt: 'asc' },
      });

      socket.emit('loadMessages', messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  });

  socket.on('sendMessage', async ({ userId, agentId, sentBy, message }) => {
    try {
      if (!userId || !message) return;
      const newMessage = await prisma.supportMessage.create({
        data: {
          userId,
          agentId: agentId || null,
          sentBy,
          message,
        },
      });

      console.log(`💾 Message saved for user ${userId}`);
      io.to(userId).emit('receiveMessage', newMessage);
    } catch (error) {
      console.error('❌ Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// PORT
const PORT = process.env.PORT || 5000;

// Start server only if DB connects
async function startServer() {
  try {
    await prisma.$connect();
    console.log('🟢 Database connected successfully');

    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to database:', err.message);
    process.exit(1); // exit if DB connection fails
  }
}

startServer();

const { cache } = require('../config/redis');
const { logGpsTelemetry } = require('../config/clickhouse');
const { emitRiderEvent } = require('../config/kafka');

let ioInstance = null;

function initSocket(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`🔌 Rider/Client connected: ${socket.id}`);

    // Join Rider Room
    socket.on('rider:join', async ({ riderId, storeId }) => {
      socket.riderId = riderId;
      socket.storeId = storeId;
      socket.join(`rider_${riderId}`);
      if (storeId) socket.join(`store_${storeId}`);
      
      // Mark rider online in Redis cache
      await cache.set(`rider_online:${riderId}`, {
        riderId,
        storeId,
        socketId: socket.id,
        onlineAt: new Date().toISOString()
      }, 7200);

      console.log(`🛵 Rider ${riderId} joined store_${storeId} room`);
    });

    // Real-time GPS Location Ping from Rider device
    socket.on('rider:location_ping', async (data) => {
      const { riderId, orderId, lat, lng, speed, battery, heading } = data;
      if (!riderId) return;

      const locPayload = {
        lat: Number(lat),
        lng: Number(lng),
        speed: Number(speed || 0),
        battery: Number(battery || 100),
        heading: Number(heading || 0),
        updatedAt: new Date().toISOString()
      };

      // 1. Cache current position in Redis
      await cache.set(`rider_loc:${riderId}`, locPayload, 300);

      // 2. Stream GPS telemetry point into ClickHouse for route tracking & analytics
      await logGpsTelemetry({ riderId, orderId, lat, lng, speed, battery, heading });

      // 3. Broadcast live location to customer & store managers tracking this order
      if (orderId) {
        io.to(`order_${orderId}`).emit('order:rider_moved', {
          orderId,
          riderId,
          ...locPayload
        });
      }
    });

    // Join Order tracking room (for customer/manager tracking rider)
    socket.on('order:track', ({ orderId }) => {
      socket.join(`order_${orderId}`);
    });

    // Duty status change (Online / Offline)
    socket.on('rider:set_duty', async ({ riderId, isOnline }) => {
      if (isOnline) {
        await cache.set(`rider_duty:${riderId}`, 'ONLINE', 14400);
      } else {
        await cache.del(`rider_duty:${riderId}`);
      }
      emitRiderEvent('rider.duty_change', {
        riderId,
        isOnline,
        time: new Date().toISOString()
      });
      socket.broadcast.emit('rider:status_changed', { riderId, isOnline });
    });

    socket.on('disconnect', async () => {
      if (socket.riderId) {
        await cache.del(`rider_online:${socket.riderId}`);
        console.log(`❌ Rider ${socket.riderId} disconnected`);
      }
    });
  });
}

function getIO() {
  return ioInstance;
}

/**
 * Dispatch new incoming order to specific rider or all riders in a store
 */
function sendNewOrderAlert(riderId, orderData) {
  if (!ioInstance) return;
  ioInstance.to(`rider_${riderId}`).emit('order:new_assigned', orderData);
}

module.exports = { initSocket, getIO, sendNewOrderAlert };

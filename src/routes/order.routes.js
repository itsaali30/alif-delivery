const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { emitRiderEvent } = require('../config/kafka');
const { logTripAnalytics } = require('../config/clickhouse');
const { minioClient, BUCKET } = require('../config/minio');
const { verifyRiderToken } = require('../middleware/auth.middleware');
const { getIO } = require('../services/socket.service');

// In-memory demo orders storage
let IN_MEMORY_ORDERS = [
  {
    OrderID: 801,
    OrderNo: 'ALIF-ORD-801',
    Status: 'READY_FOR_PICKUP',
    RiderID: 101,
    StoreID: 1,
    StoreName: 'Alif Dark Store - Dabeerpura',
    StoreAddress: 'Chavni, Dabeerpura, Hyderabad',
    StorePhone: '+91 9123456789',
    StoreLat: 17.3616,
    StoreLng: 78.4747,
    CustomerName: 'Shaik Farooq',
    CustomerPhone: '+91 9988776655',
    DeliveryAddress: 'Flat 302, Green Paradise Apts, Chanchalguda, Hyderabad',
    CustomerLat: 17.3700,
    CustomerLng: 78.4867,
    DistanceKm: 2.4,
    EstimatedMinutes: 12,
    ItemsCount: 4,
    Items: [
      { name: 'Fortune Sunlite Sunflower Oil 1L', qty: 2, price: 145 },
      { name: 'India Gate Basmati Rice 5kg', qty: 1, price: 420 },
      { name: 'Tata Salt 1kg', qty: 1, price: 28 }
    ],
    TotalAmount: 738,
    PaymentMethod: 'COD',
    PaymentStatus: 'PENDING',
    DeliveryFee: 45.0,
    TipAmount: 20.0,
    SurgeBonus: 15.0,
    EstimatedPayout: 80.0, // 45 base + 20 tip + 15 surge
    OTP: '4829',
    AssignedAt: new Date().toISOString()
  },
  {
    OrderID: 802,
    OrderNo: 'ALIF-ORD-802',
    Status: 'ASSIGNED',
    RiderID: 101,
    StoreID: 1,
    StoreName: 'Alif Dark Store - Dabeerpura',
    StoreAddress: 'Chavni, Dabeerpura, Hyderabad',
    StorePhone: '+91 9123456789',
    StoreLat: 17.3616,
    StoreLng: 78.4747,
    CustomerName: 'Mirza Baig',
    CustomerPhone: '+91 9849012345',
    DeliveryAddress: 'House # 16-2-705, Judges Colony, Malakpet, Hyderabad',
    CustomerLat: 17.3750,
    CustomerLng: 78.4980,
    DistanceKm: 3.8,
    EstimatedMinutes: 18,
    ItemsCount: 3,
    Items: [
      { name: 'Aashirvaad Shudh Chakki Atta 10kg', qty: 1, price: 440 },
      { name: 'Amul Butter 500g', qty: 2, price: 275 }
    ],
    TotalAmount: 990,
    PaymentMethod: 'ONLINE_PREPAID',
    PaymentStatus: 'PAID',
    DeliveryFee: 55.0,
    TipAmount: 30.0,
    SurgeBonus: 10.0,
    EstimatedPayout: 95.0,
    OTP: '7193',
    AssignedAt: new Date().toISOString()
  }
];

// GET /api/orders/active - Current active order for rider
router.get('/active', verifyRiderToken, async (req, res) => {
  try {
    const riderId = req.rider.riderId;
    let activeOrder = IN_MEMORY_ORDERS.find(
      o => o.RiderID === riderId && ['ASSIGNED', 'ACCEPTED', 'ARRIVED_AT_STORE', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'ARRIVED_AT_CUSTOMER'].includes(o.Status)
    );

    res.json({
      success: true,
      order: activeOrder || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/pending-offers
router.get('/pending-offers', verifyRiderToken, async (req, res) => {
  try {
    const riderId = req.rider.riderId;
    const offers = IN_MEMORY_ORDERS.filter(o => o.RiderID === riderId && o.Status === 'ASSIGNED');
    res.json({ success: true, offers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/:id/accept
router.post('/:id/accept', verifyRiderToken, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const riderId = req.rider.riderId;

    const order = IN_MEMORY_ORDERS.find(o => o.OrderID === orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.Status = 'ACCEPTED';
    order.AcceptedAt = new Date().toISOString();

    // Broadcast Kafka event
    emitRiderEvent('rider.accepted', {
      orderId,
      riderId,
      storeId: order.StoreID,
      time: order.AcceptedAt
    });

    const io = getIO();
    if (io) {
      io.to(`order_${orderId}`).emit('order:status_updated', {
        orderId,
        status: 'ACCEPTED',
        riderName: req.rider.name
      });
    }

    res.json({ success: true, message: 'Order accepted!', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/:id/reject
router.post('/:id/reject', verifyRiderToken, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = IN_MEMORY_ORDERS.find(o => o.OrderID === orderId);
    if (order) {
      order.Status = 'REJECTED';
      order.RiderID = null;
    }
    res.json({ success: true, message: 'Order offer rejected' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/:id/status - Update delivery stage
router.post('/:id/status', verifyRiderToken, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body; // 'ARRIVED_AT_STORE' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'ARRIVED_AT_CUSTOMER'
    const riderId = req.rider.riderId;

    const order = IN_MEMORY_ORDERS.find(o => o.OrderID === orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.Status = status;
    order[`${status}_At`] = new Date().toISOString();

    emitRiderEvent(`rider.${status.toLowerCase()}`, {
      orderId,
      riderId,
      status,
      timestamp: new Date().toISOString()
    });

    const io = getIO();
    if (io) {
      io.to(`order_${orderId}`).emit('order:status_updated', {
        orderId,
        status,
        updatedAt: new Date().toISOString()
      });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/:id/verify-otp
router.post('/:id/verify-otp', verifyRiderToken, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { otp } = req.body;

    const order = IN_MEMORY_ORDERS.find(o => o.OrderID === orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (String(order.OTP) !== String(otp).trim()) {
      return res.status(400).json({ error: 'Invalid Customer OTP. Please check with customer.' });
    }

    order.OtpVerified = true;
    res.json({ success: true, message: 'OTP verified successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/:id/collect-cash (For COD)
router.post('/:id/collect-cash', verifyRiderToken, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { amount } = req.body;
    const riderId = req.rider.riderId;

    const order = IN_MEMORY_ORDERS.find(o => o.OrderID === orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.PaymentStatus = 'PAID';
    order.CashCollected = Number(amount || order.TotalAmount);
    order.CashCollectedAt = new Date().toISOString();

    res.json({ success: true, message: `Collected ₹${order.CashCollected} in Cash!`, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/:id/deliver - Final delivery completion
router.post('/:id/deliver', verifyRiderToken, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const riderId = req.rider.riderId;
    const order = IN_MEMORY_ORDERS.find(o => o.OrderID === orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.Status = 'DELIVERED';
    order.DeliveredAt = new Date().toISOString();

    // 1. Emit Kafka event
    emitRiderEvent('rider.delivered', {
      orderId,
      riderId,
      amount: order.TotalAmount,
      payout: order.EstimatedPayout,
      deliveredAt: order.DeliveredAt
    });

    // 2. Log completed trip analytics to ClickHouse
    await logTripAnalytics({
      tripId: `TRIP-${orderId}`,
      riderId,
      orderId,
      storeId: order.StoreID,
      distanceKm: order.DistanceKm,
      totalPayout: order.EstimatedPayout,
      deliveryDurationSec: 720
    });

    // 3. Socket broadcast
    const io = getIO();
    if (io) {
      io.to(`order_${orderId}`).emit('order:delivered', {
        orderId,
        deliveredAt: order.DeliveredAt
      });
    }

    res.json({
      success: true,
      message: 'Order delivered successfully! Payout credited to your wallet.',
      order,
      payoutCredited: order.EstimatedPayout
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

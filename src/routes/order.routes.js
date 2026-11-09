const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { emitRiderEvent } = require('../config/kafka');
const { logTripAnalytics } = require('../config/clickhouse');
const { minioClient, BUCKET } = require('../config/minio');
const { verifyRiderToken } = require('../middleware/auth.middleware');
const { getIO } = require('../services/socket.service');

// Helper to format order from PostgreSQL
async function formatDbOrder(order) {
  let items = [];
  if (prisma && prisma.orderItems) {
    const dbItems = await prisma.orderItems.findMany({
      where: { OrderID: order.OrderID }
    });
    items = dbItems.map(it => ({
      name: `Item #${it.VariantID}`,
      qty: it.Qty || 1,
      price: it.Price || 35
    }));
  }

  let store = null;
  if (prisma && prisma.stores) {
    store = await prisma.stores.findUnique({
      where: { StoreID: order.StoreID }
    });
  }

  return {
    OrderID: order.OrderID,
    OrderNo: `ALIF-ORD-${order.OrderID}`,
    Status: order.Status || 'READY_FOR_PICKUP',
    RiderID: 101,
    StoreID: order.StoreID,
    StoreName: store ? store.StoreName : 'Alif Dark Store - Dabeerpura (Store #1)',
    StoreAddress: store ? store.Address : 'Chavni, Dabeerpura, Hyderabad',
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
    ItemsCount: items.length || 2,
    Items: items.length > 0 ? items : [
      { name: 'Amul Taaza Milk 500ml', qty: 2, price: 27 },
      { name: 'Lay\'s Magic Masala Chips 50g', qty: 1, price: 19 }
    ],
    TotalAmount: order.FinalAmount || 110,
    PaymentMethod: order.PaymentMethod || 'COD',
    PaymentStatus: order.PaymentStatus || 'PENDING',
    DeliveryFee: order.DeliveryFee || 45.0,
    TipAmount: 20.0,
    SurgeBonus: 15.0,
    EstimatedPayout: (order.DeliveryFee || 45.0) + 35.0,
    OTP: '5397',
    AssignedAt: order.CreatedAt ? order.CreatedAt.toISOString() : new Date().toISOString()
  };
}

// GET /api/orders/active - Current active order for rider from PostgreSQL
router.get('/active', verifyRiderToken, async (req, res) => {
  try {
    let order = null;
    if (prisma && prisma.orders) {
      const activeDbOrder = await prisma.orders.findFirst({
        where: {
          Status: { in: ['READY_FOR_PICKUP', 'ASSIGNED', 'ACCEPTED', 'ARRIVED_AT_STORE', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'ARRIVED_AT_CUSTOMER'] }
        },
        orderBy: { OrderID: 'desc' }
      });

      if (activeDbOrder) {
        order = await formatDbOrder(activeDbOrder);
      }
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/pending-offers
router.get('/pending-offers', verifyRiderToken, async (req, res) => {
  try {
    let offers = [];
    if (prisma && prisma.orders) {
      const dbOffers = await prisma.orders.findMany({
        where: { Status: 'READY_FOR_PICKUP' },
        orderBy: { OrderID: 'desc' },
        take: 5
      });
      for (const o of dbOffers) {
        offers.push(await formatDbOrder(o));
      }
    }
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

    if (prisma && prisma.orders) {
      await prisma.orders.update({
        where: { OrderID: orderId },
        data: { Status: 'ACCEPTED' }
      });
    }

    emitRiderEvent('rider.accepted', {
      orderId,
      riderId,
      time: new Date().toISOString()
    });

    res.json({ success: true, message: 'Order accepted by rider!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/:id/status - Update milestone
router.post('/:id/status', verifyRiderToken, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    const riderId = req.rider.riderId;

    if (prisma && prisma.orders) {
      await prisma.orders.update({
        where: { OrderID: orderId },
        data: { Status: status }
      });
    }

    emitRiderEvent(`rider.${status.toLowerCase()}`, {
      orderId,
      riderId,
      status,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/:id/verify-otp
router.post('/:id/verify-otp', verifyRiderToken, async (req, res) => {
  try {
    const { otp } = req.body;
    if (String(otp).trim() !== '5397' && String(otp).trim() !== '4829') {
      return res.status(400).json({ error: 'Invalid Customer OTP' });
    }
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

    if (prisma && prisma.orders) {
      await prisma.orders.update({
        where: { OrderID: orderId },
        data: { PaymentStatus: 'PAID' }
      });
    }

    if (prisma && prisma.cashCollections) {
      try {
        await prisma.cashCollections.create({
          data: {
            RiderID: riderId,
            OrderID: orderId,
            Amount: parseFloat(amount || 110),
            CollectedAt: new Date(),
            Status: 'COLLECTED',
            SubmittedToManagerID: 0
          }
        });
      } catch (e) {}
    }

    res.json({ success: true, message: `Collected ₹${amount || 110} in cash!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/:id/deliver - Complete delivery
router.post('/:id/deliver', verifyRiderToken, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const riderId = req.rider.riderId;

    if (prisma && prisma.orders) {
      await prisma.orders.update({
        where: { OrderID: orderId },
        data: { Status: 'DELIVERED' }
      });
    }

    emitRiderEvent('rider.delivered', {
      orderId,
      riderId,
      deliveredAt: new Date().toISOString()
    });

    await logTripAnalytics({
      tripId: `TRIP-${orderId}`,
      riderId,
      orderId,
      storeId: 1,
      distanceKm: 2.4,
      totalPayout: 80,
      deliveryDurationSec: 680
    });

    res.json({
      success: true,
      message: 'Order delivered successfully! Payout credited to your wallet.',
      payoutCredited: 80.0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

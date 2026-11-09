const express = require('express');
const router = express.Router();
const { verifyRiderToken } = require('../middleware/auth.middleware');

// GET /api/earnings/summary
router.get('/summary', verifyRiderToken, async (req, res) => {
  try {
    const riderId = req.rider.riderId;

    res.json({
      success: true,
      summary: {
        todayEarnings: 680.0,
        todayDeliveries: 9,
        todayHours: 5.5,
        todayKm: 28.4,
        walletBalance: 2450.0,
        cashInHand: 1476.0, // Collected from COD orders, to deposit to store manager
        breakdown: {
          basePay: 405.0,
          distancePay: 125.0,
          surgeBonus: 80.0,
          customerTips: 70.0,
          fuelAllowance: 50.0
        },
        weeklyEarnings: 4890.0,
        weeklyDeliveries: 62
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/earnings/trips
router.get('/trips', verifyRiderToken, async (req, res) => {
  try {
    const trips = [
      {
        orderId: 799,
        orderNo: 'ALIF-ORD-799',
        customerName: 'Zubair Khan',
        distanceKm: 2.1,
        time: '35 mins ago',
        baseFee: 45,
        tip: 20,
        surge: 10,
        total: 75,
        paymentType: 'PAID'
      },
      {
        orderId: 798,
        orderNo: 'ALIF-ORD-798',
        customerName: 'Syed Tanveer',
        distanceKm: 3.5,
        time: '1 hr 10 mins ago',
        baseFee: 55,
        tip: 0,
        surge: 15,
        total: 70,
        paymentType: 'COD (₹450 collected)'
      },
      {
        orderId: 797,
        orderNo: 'ALIF-ORD-797',
        customerName: 'Ayesha Fatima',
        distanceKm: 1.8,
        time: '2 hrs ago',
        baseFee: 40,
        tip: 25,
        surge: 0,
        total: 65,
        paymentType: 'PAID'
      }
    ];

    res.json({ success: true, trips });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

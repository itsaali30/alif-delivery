const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { cache } = require('../config/redis');
const { verifyRiderToken, JWT_SECRET } = require('../middleware/auth.middleware');

// In-memory demo rider store if DB is empty
const DEMO_RIDERS = [
  {
    RiderID: 101,
    UserID: 501,
    StoreID: 1,
    StoreName: 'Alif Dark Store - Dabeerpura',
    StoreAddress: 'Chavni, Dabeerpura, Hyderabad',
    Name: 'Mohammed Imran',
    Phone: '9876543210',
    VehicleType: 'Motorcycle (Hero Splendor)',
    LicenseNo: 'TS09-2021-998811',
    InsuranceNo: 'HDFC-ERGO-45678',
    Status: 'ACTIVE',
    Rating: 4.85,
    IsActive: true,
    ShiftStatus: 'ONLINE'
  },
  {
    RiderID: 102,
    UserID: 502,
    StoreID: 1,
    StoreName: 'Alif Dark Store - Dabeerpura',
    StoreAddress: 'Chavni, Dabeerpura, Hyderabad',
    Name: 'Syed Ali',
    Phone: '9876543211',
    VehicleType: 'EV Scooter (Ather 450X)',
    LicenseNo: 'TS09-2022-332211',
    InsuranceNo: 'ICICI-LOMBARD-88221',
    Status: 'ACTIVE',
    Rating: 4.92,
    IsActive: true,
    ShiftStatus: 'ONLINE'
  }
];

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { phone, password, riderId } = req.body;

    let rider = null;
    if (prisma && prisma.riders) {
      try {
        if (riderId) {
          rider = await prisma.riders.findUnique({ where: { RiderID: parseInt(riderId) } });
        } else if (phone) {
          // If User table has phone
          const user = await prisma.users.findFirst({ where: { Phone: phone } });
          if (user) {
            rider = await prisma.riders.findFirst({ where: { UserID: user.UserID } });
          }
        }
      } catch (dbErr) {
        console.warn('Prisma query failed, falling back to demo riders:', dbErr.message);
      }
    }

    if (!rider) {
      rider = DEMO_RIDERS.find(r => r.Phone === phone || r.RiderID === parseInt(riderId)) || DEMO_RIDERS[0];
    }

    const payload = {
      riderId: rider.RiderID,
      userId: rider.UserID,
      storeId: rider.StoreID,
      name: rider.Name || 'Mohammed Imran',
      phone: rider.Phone || phone,
      vehicleType: rider.VehicleType
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // Cache online state
    await cache.set(`rider_duty:${rider.RiderID}`, 'ONLINE', 14400);

    res.json({
      success: true,
      token,
      rider: {
        ...payload,
        rating: rider.Rating || 4.85,
        licenseNo: rider.LicenseNo || 'TS09-2021-998811',
        storeName: rider.StoreName || 'Alif Dark Store - Dabeerpura',
        isDutyOnline: true
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', verifyRiderToken, async (req, res) => {
  try {
    const riderId = req.rider.riderId;
    let rider = null;

    if (prisma && prisma.riders) {
      try {
        rider = await prisma.riders.findUnique({ where: { RiderID: riderId } });
      } catch (e) {}
    }

    if (!rider) {
      rider = DEMO_RIDERS.find(r => r.RiderID === riderId) || DEMO_RIDERS[0];
    }

    const duty = await cache.get(`rider_duty:${riderId}`);

    res.json({
      success: true,
      rider: {
        ...req.rider,
        rating: rider.Rating || 4.85,
        licenseNo: rider.LicenseNo || 'TS09-2021-998811',
        insuranceNo: rider.InsuranceNo || 'HDFC-ERGO-45678',
        isDutyOnline: duty === 'ONLINE'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/shift/toggle
router.post('/shift/toggle', verifyRiderToken, async (req, res) => {
  try {
    const { isOnline } = req.body;
    const riderId = req.rider.riderId;

    if (isOnline) {
      await cache.set(`rider_duty:${riderId}`, 'ONLINE', 14400);
    } else {
      await cache.del(`rider_duty:${riderId}`);
    }

    res.json({
      success: true,
      isDutyOnline: Boolean(isOnline),
      message: isOnline ? 'Shift started! You are now ONLINE for deliveries.' : 'Shift ended. You are now OFFLINE.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

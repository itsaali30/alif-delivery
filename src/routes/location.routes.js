const express = require('express');
const router = express.Router();
const { cache } = require('../config/redis');
const { logGpsTelemetry, memoryTripLogs, clickhouseClient } = require('../config/clickhouse');
const { verifyRiderToken } = require('../middleware/auth.middleware');

// POST /api/location/ping
router.post('/ping', verifyRiderToken, async (req, res) => {
  try {
    const { lat, lng, speed, battery, heading, orderId } = req.body;
    const riderId = req.rider.riderId;

    await cache.set(`rider_loc:${riderId}`, {
      lat, lng, speed, battery, heading, updatedAt: new Date().toISOString()
    }, 300);

    await logGpsTelemetry({ riderId, orderId, lat, lng, speed, battery, heading });

    res.json({ success: true, message: 'Telemetry recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/location/telemetry/:riderId
router.get('/telemetry/:riderId', async (req, res) => {
  try {
    const riderId = parseInt(req.params.riderId);
    let points = [];

    if (clickhouseClient) {
      try {
        const queryResult = await clickhouseClient.query({
          query: `
            SELECT rider_id, order_id, lat, lng, speed, battery, heading, timestamp
            FROM rider_gps_telemetry
            WHERE rider_id = {riderId: UInt32}
            ORDER BY timestamp DESC
            LIMIT 50
          `,
          query_params: { riderId },
          format: 'JSONEachRow'
        });
        points = await queryResult.json();
      } catch (chErr) {
        points = memoryTripLogs.filter(p => p.rider_id === riderId);
      }
    } else {
      points = memoryTripLogs.filter(p => p.rider_id === riderId);
    }

    res.json({ success: true, points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

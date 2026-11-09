let clickhouseClient = null;
const memoryTripLogs = [];

try {
  const { createClient } = require('@clickhouse/client');
  clickhouseClient = createClient({
    url: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USER || 'default',
    password: process.env.CLICKHOUSE_PASSWORD || '',
    database: process.env.CLICKHOUSE_DATABASE || 'default'
  });

  // Verify connection asynchronously
  clickhouseClient.ping().then(result => {
    if (result.success) {
      console.log('✅ ClickHouse connected (Telemetry & Trip Analytics).');
      initClickhouseTables();
    }
  }).catch(err => {
    console.warn('⚠️ ClickHouse ping failed (using memory buffer):', err.message);
  });
} catch (e) {
  console.warn('⚠️ @clickhouse/client fallback:', e.message);
}

async function initClickhouseTables() {
  if (!clickhouseClient) return;
  try {
    // Create rider_gps_telemetry table
    await clickhouseClient.command({
      query: `
        CREATE TABLE IF NOT EXISTS rider_gps_telemetry (
          rider_id UInt32,
          order_id UInt32,
          lat Float64,
          lng Float64,
          speed Float32,
          battery Float32,
          heading Float32,
          timestamp DateTime DEFAULT now()
        ) ENGINE = MergeTree()
        ORDER BY (rider_id, timestamp)
      `
    });

    // Create delivery_trip_analytics table
    await clickhouseClient.command({
      query: `
        CREATE TABLE IF NOT EXISTS delivery_trip_analytics (
          trip_id String,
          rider_id UInt32,
          order_id UInt32,
          store_id UInt32,
          pickup_duration_sec UInt32,
          delivery_duration_sec UInt32,
          distance_km Float32,
          total_payout Float32,
          timestamp DateTime DEFAULT now()
        ) ENGINE = MergeTree()
        ORDER BY (rider_id, timestamp)
      `
    });
    console.log('✅ ClickHouse telemetry tables verified.');
  } catch (err) {
    console.warn('ClickHouse table init warning:', err.message);
  }
}

/**
 * Log GPS telemetry point
 */
async function logGpsTelemetry(data) {
  const record = {
    rider_id: Number(data.riderId || 0),
    order_id: Number(data.orderId || 0),
    lat: Number(data.lat || 0),
    lng: Number(data.lng || 0),
    speed: Number(data.speed || 0),
    battery: Number(data.battery || 100),
    heading: Number(data.heading || 0),
    timestamp: new Date()
  };

  if (clickhouseClient) {
    try {
      await clickhouseClient.insert({
        table: 'rider_gps_telemetry',
        values: [record],
        format: 'JSONEachRow'
      });
      return;
    } catch (e) {
      // fallback to memory
    }
  }

  memoryTripLogs.push(record);
  if (memoryTripLogs.length > 500) memoryTripLogs.shift();
}

/**
 * Log Completed Delivery Trip Analytics
 */
async function logTripAnalytics(data) {
  const record = {
    trip_id: String(data.tripId || `TRIP-${Date.now()}`),
    rider_id: Number(data.riderId || 0),
    order_id: Number(data.orderId || 0),
    store_id: Number(data.storeId || 0),
    pickup_duration_sec: Number(data.pickupDurationSec || 0),
    delivery_duration_sec: Number(data.deliveryDurationSec || 0),
    distance_km: Number(data.distanceKm || 0),
    total_payout: Number(data.totalPayout || 0),
    timestamp: new Date()
  };

  if (clickhouseClient) {
    try {
      await clickhouseClient.insert({
        table: 'delivery_trip_analytics',
        values: [record],
        format: 'JSONEachRow'
      });
      return;
    } catch (e) {
      // fallback
    }
  }

  memoryTripLogs.push(record);
}

module.exports = { clickhouseClient, logGpsTelemetry, logTripAnalytics, memoryTripLogs };

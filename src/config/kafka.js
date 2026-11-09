const EventEmitter = require('events');

class RiderEventBus extends EventEmitter {}
const eventBus = new RiderEventBus();

let producer = null;
const isKafkaEnabled = process.env.KAFKA_ENABLED === 'true';

if (isKafkaEnabled) {
  try {
    const { Kafka } = require('kafkajs');
    const kafka = new Kafka({
      clientId: 'alif-delivery-rider',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
    });
    producer = kafka.producer();
    producer.connect().then(() => {
      console.log('✅ Kafka Producer connected (Rider events).');
    }).catch(err => {
      console.warn('⚠️ Kafka connection failed, falling back to local event bus:', err.message);
      producer = null;
    });
  } catch (err) {
    console.warn('⚠️ Kafka init error:', err.message);
  }
}

/**
 * Emit rider delivery event (Kafka topic + internal event bus)
 * e.g., 'rider.assigned', 'rider.accepted', 'rider.reached_store', 'rider.picked_up', 'rider.delivered'
 */
async function emitRiderEvent(topic, payload) {
  const event = {
    topic,
    timestamp: new Date().toISOString(),
    payload
  };

  eventBus.emit(topic, event);
  eventBus.emit('*', event);

  if (producer) {
    try {
      await producer.send({
        topic,
        messages: [{ value: JSON.stringify(event) }]
      });
    } catch (err) {
      console.warn(`⚠️ Kafka send error on topic ${topic}:`, err.message);
    }
  } else {
    console.log(`📡 [RIDER-EVENT] [${topic}]:`, payload.action || topic, payload.summary || '');
  }
}

module.exports = { emitRiderEvent, eventBus };

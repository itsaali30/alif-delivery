const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'alif-delivery-rider-super-secret-key-2026';

function verifyRiderToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Rider token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.rider = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired rider token' });
  }
}

module.exports = { verifyRiderToken, JWT_SECRET };

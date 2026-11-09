const API = {
  baseUrl: window.location.origin,

  getToken() {
    return localStorage.getItem('alif_rider_token');
  },

  setToken(token) {
    localStorage.setItem('alif_rider_token', token);
  },

  removeToken() {
    localStorage.removeItem('alif_rider_token');
  },

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server request failed');
      }
      return data;
    } catch (err) {
      console.error(`API Error on [${endpoint}]:`, err.message);
      throw err;
    }
  },

  // Auth Endpoints
  login(phone, password, riderId) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password, riderId })
    });
  },

  getMe() {
    return this.request('/api/auth/me');
  },

  toggleShift(isOnline) {
    return this.request('/api/auth/shift/toggle', {
      method: 'POST',
      body: JSON.stringify({ isOnline })
    });
  },

  // Order Endpoints
  getActiveOrder() {
    return this.request('/api/orders/active');
  },

  getPendingOffers() {
    return this.request('/api/orders/pending-offers');
  },

  acceptOrder(orderId) {
    return this.request(`/api/orders/${orderId}/accept`, { method: 'POST' });
  },

  rejectOrder(orderId) {
    return this.request(`/api/orders/${orderId}/reject`, { method: 'POST' });
  },

  updateOrderStatus(orderId, status) {
    return this.request(`/api/orders/${orderId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status })
    });
  },

  verifyOtp(orderId, otp) {
    return this.request(`/api/orders/${orderId}/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ otp })
    });
  },

  collectCash(orderId, amount) {
    return this.request(`/api/orders/${orderId}/collect-cash`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  },

  deliverOrder(orderId) {
    return this.request(`/api/orders/${orderId}/deliver`, { method: 'POST' });
  },

  // Earnings Endpoints
  getEarningsSummary() {
    return this.request('/api/earnings/summary');
  },

  getTripHistory() {
    return this.request('/api/earnings/trips');
  },

  // Location / ClickHouse Ping
  pingLocation(coords) {
    return this.request('/api/location/ping', {
      method: 'POST',
      body: JSON.stringify(coords)
    });
  }
};

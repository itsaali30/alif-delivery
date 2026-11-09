const SocketClient = {
  socket: null,
  watchId: null,

  init(riderId, storeId) {
    if (this.socket) return;

    try {
      this.socket = io(window.location.origin, {
        reconnectionAttempts: 5,
        timeout: 5000
      });

      this.socket.on('connect', () => {
        console.log('⚡ Socket connected to delivery server');
        if (riderId) {
          this.socket.emit('rider:join', { riderId, storeId });
        }
      });

      this.socket.on('order:new_assigned', (order) => {
        console.log('🔔 New Order Alert Received:', order);
        window.dispatchEvent(new CustomEvent('alif:new_order', { detail: order }));
      });

      this.startGpsBroadcast(riderId);
    } catch (e) {
      console.warn('Socket.io connection warning:', e.message);
    }
  },

  startGpsBroadcast(riderId) {
    // If browser supports Geolocation API, send periodic coordinates
    if ('geolocation' in navigator) {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          if (!this.socket || !riderId) return;
          this.socket.emit('rider:location_ping', {
            riderId,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            speed: pos.coords.speed ? (pos.coords.speed * 3.6).toFixed(1) : 0,
            heading: pos.coords.heading || 0,
            battery: 92
          });
        },
        (err) => {
          // Simulation fallback for demo/testing without real hardware GPS
          this.simulateGpsMovement(riderId);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    } else {
      this.simulateGpsMovement(riderId);
    }
  },

  simulateGpsMovement(riderId) {
    let lat = 17.3616;
    let lng = 78.4747;
    setInterval(() => {
      if (!this.socket || !riderId) return;
      lat += (Math.random() - 0.48) * 0.0005;
      lng += (Math.random() - 0.48) * 0.0005;
      this.socket.emit('rider:location_ping', {
        riderId,
        lat,
        lng,
        speed: (22 + Math.random() * 8).toFixed(1),
        battery: 88,
        heading: 45
      });
    }, 10000);
  },

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    if (this.watchId && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }
};

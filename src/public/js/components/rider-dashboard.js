// Rider Dashboard Component - Separate JS Template
const RiderDashboard = {
  template: `
    <div class="container py-3" style="max-width: 540px;">
      
      <!-- Duty Online/Offline Card -->
      <div class="card border-0 shadow-sm rounded-4 p-3 mb-3" :class="isOnline ? 'bg-success text-white' : 'bg-light'">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="fw-bold mb-0">
              <i class="bi" :class="isOnline ? 'bi-broadcast-pin text-white' : 'bi-moon-stars text-secondary'"></i>
              {{ isOnline ? "YOU'RE ONLINE" : "YOU'RE OFFLINE" }}
            </h6>
            <small :class="isOnline ? 'text-white-50' : 'text-muted'">
              {{ isOnline ? 'Ready to receive delivery orders' : 'Turn on duty switch to receive orders' }}
            </small>
          </div>
          <button 
            class="btn btn-sm px-3 py-1 fw-bold rounded-pill shadow-sm"
            :class="isOnline ? 'btn-light text-success' : 'btn-success text-white'"
            @click="toggleDuty"
            :disabled="toggling"
          >
            <span v-if="toggling" class="spinner-border spinner-border-sm me-1"></span>
            {{ isOnline ? 'Go Offline' : 'Go Online' }}
          </button>
        </div>
      </div>

      <!-- Current Store Badge -->
      <div class="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
        <div class="d-flex align-items-center">
          <div class="p-2 rounded-3 bg-primary bg-opacity-10 text-primary me-3">
            <i class="bi bi-geo-alt-fill fs-4"></i>
          </div>
          <div class="flex-grow-1">
            <div class="small text-muted fw-semibold">CURRENT HUB / DARK STORE</div>
            <div class="fw-bold text-dark">{{ riderInfo?.storeName || 'Alif Dark Store - Dabeerpura' }}</div>
            <div class="small text-muted">Radius: 4.5 km coverage</div>
          </div>
        </div>
      </div>

      <!-- Active In-Progress Order Notification -->
      <div v-if="activeOrder" class="order-card p-3 border-start border-4 border-warning mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="badge bg-warning text-dark fw-bold">ACTIVE ORDER IN PROGRESS</span>
          <span class="small fw-bold text-success">Payout: ₹{{ activeOrder.EstimatedPayout }}</span>
        </div>
        <h6 class="fw-bold mb-1 text-dark">{{ activeOrder.OrderNo }} ({{ activeOrder.CustomerName }})</h6>
        <p class="small text-muted mb-2 text-truncate">
          <i class="bi bi-geo-alt text-danger me-1"></i> {{ activeOrder.DeliveryAddress }}
        </p>
        <div class="d-flex gap-2">
          <router-link :to="'/active-order/' + activeOrder.OrderID" class="btn btn-warning btn-sm w-100 fw-bold rounded-3">
            <i class="bi bi-arrow-right-circle me-1"></i> Open Order Screen
          </router-link>
        </div>
      </div>

      <!-- Today's Metrics Grid -->
      <div class="row g-2 mb-3">
        <div class="col-6">
          <div class="metric-card">
            <div class="d-flex justify-content-between">
              <span class="metric-label">Today Payout</span>
              <i class="bi bi-currency-rupee text-success"></i>
            </div>
            <div class="metric-value text-success">₹{{ summary.todayEarnings }}</div>
            <div class="small text-muted">9 orders completed</div>
          </div>
        </div>
        <div class="col-6">
          <div class="metric-card">
            <div class="d-flex justify-content-between">
              <span class="metric-label">Deliveries</span>
              <i class="bi bi-bag-check text-primary"></i>
            </div>
            <div class="metric-value text-primary">{{ summary.todayDeliveries }}</div>
            <div class="small text-muted">100% on time</div>
          </div>
        </div>
        <div class="col-6">
          <div class="metric-card">
            <div class="d-flex justify-content-between">
              <span class="metric-label">Distance</span>
              <i class="bi bi-speedometer2 text-warning"></i>
            </div>
            <div class="metric-value text-dark">{{ summary.todayKm }} <span class="fs-6 fw-normal">km</span></div>
            <div class="small text-muted">Fuel bonus: ₹50</div>
          </div>
        </div>
        <div class="col-6">
          <div class="metric-card">
            <div class="d-flex justify-content-between">
              <span class="metric-label">Cash in Hand</span>
              <i class="bi bi-cash-stack text-danger"></i>
            </div>
            <div class="metric-value text-danger">₹{{ summary.cashInHand }}</div>
            <div class="small text-muted">Deposit to Lead</div>
          </div>
        </div>
      </div>

      <!-- Pending Delivery Offers List -->
      <div class="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-dark">
            <i class="bi bi-bell-fill text-warning me-1"></i> Delivery Requests
          </h6>
          <span class="badge bg-light text-dark">{{ pendingOffers.length }} Available</span>
        </div>

        <div v-if="pendingOffers.length === 0" class="text-center py-4 text-muted">
          <i class="bi bi-inbox fs-1 d-block mb-1 text-secondary opacity-50"></i>
          <small>No pending order offers at this moment.<br>Stay online, new orders will alert automatically.</small>
        </div>

        <div v-for="offer in pendingOffers" :key="offer.OrderID" class="p-3 mb-2 rounded-3 bg-light border">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <span class="fw-bold text-dark">{{ offer.OrderNo }}</span>
              <div class="small text-muted">{{ offer.ItemsCount }} items • {{ offer.DistanceKm }} km away</div>
            </div>
            <span class="fw-bold text-success fs-6">+ ₹{{ offer.EstimatedPayout }}</span>
          </div>
          <div class="small text-muted mb-2">
            <i class="bi bi-geo-alt text-danger"></i> {{ offer.DeliveryAddress }}
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-danger w-50 rounded-pill" @click="rejectOffer(offer.OrderID)">Reject</button>
            <button class="btn btn-sm btn-success w-50 fw-bold rounded-pill" @click="acceptOffer(offer.OrderID)">Accept Offer</button>
          </div>
        </div>
      </div>

      <!-- Quick Action Floating/Shortcut -->
      <div class="d-grid gap-2">
        <router-link to="/map" class="btn btn-outline-secondary py-2 rounded-3 small fw-semibold">
          <i class="bi bi-map me-1 text-primary"></i> Open GPS Route Simulator
        </router-link>
      </div>

    </div>
  `,
  data() {
    return {
      isOnline: true,
      toggling: false,
      summary: {
        todayEarnings: 680,
        todayDeliveries: 9,
        todayKm: 28.4,
        cashInHand: 1476
      },
      activeOrder: null,
      pendingOffers: []
    };
  },
  computed: {
    riderInfo() {
      return this.$root.rider;
    }
  },
  async mounted() {
    await this.fetchDashboardData();
    window.addEventListener('alif:new_order', this.handleNewOrderEvent);
  },
  beforeUnmount() {
    window.removeEventListener('alif:new_order', this.handleNewOrderEvent);
  },
  methods: {
    async fetchDashboardData() {
      try {
        const [meRes, actRes, offRes, earnRes] = await Promise.all([
          API.getMe().catch(() => null),
          API.getActiveOrder().catch(() => null),
          API.getPendingOffers().catch(() => null),
          API.getEarningsSummary().catch(() => null)
        ]);

        if (meRes?.rider) {
          this.isOnline = meRes.rider.isDutyOnline;
          this.$root.isOnline = this.isOnline;
        }
        if (actRes?.order) {
          this.activeOrder = actRes.order;
        }
        if (offRes?.offers) {
          this.pendingOffers = offRes.offers;
        }
        if (earnRes?.summary) {
          this.summary = earnRes.summary;
        }
      } catch (e) {
        console.warn('Dashboard fetch warning:', e.message);
      }
    },
    async toggleDuty() {
      this.toggling = true;
      try {
        const nextState = !this.isOnline;
        const res = await API.toggleShift(nextState);
        this.isOnline = res.isDutyOnline;
        this.$root.isOnline = this.isOnline;
        if (SocketClient.socket) {
          SocketClient.socket.emit('rider:set_duty', {
            riderId: this.$root.rider?.riderId,
            isOnline: this.isOnline
          });
        }
      } catch (err) {
        alert(err.message || 'Could not change duty status');
      } finally {
        this.toggling = false;
      }
    },
    async acceptOffer(orderId) {
      try {
        const res = await API.acceptOrder(orderId);
        if (res.success) {
          this.activeOrder = res.order;
          this.pendingOffers = this.pendingOffers.filter(o => o.OrderID !== orderId);
          this.$router.push(`/active-order/${orderId}`);
        }
      } catch (e) {
        alert(e.message || 'Error accepting offer');
      }
    },
    async rejectOffer(orderId) {
      try {
        await API.rejectOrder(orderId);
        this.pendingOffers = this.pendingOffers.filter(o => o.OrderID !== orderId);
      } catch (e) {
        console.warn(e.message);
      }
    },
    handleNewOrderEvent(e) {
      const order = e.detail;
      if (order && !this.pendingOffers.some(o => o.OrderID === order.OrderID)) {
        this.pendingOffers.unshift(order);
      }
    }
  }
};

// Order View Component - Alif Delivery (/order/:id)
const OrderView = {
  template: `
    <div class="container py-3" style="max-width: 540px;" v-if="order">
      <!-- Top Header -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0 text-dark">Order Request #{{ order.OrderID }}</h5>
        <span class="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold">POC ID: POC-{{ order.StoreID }}-{{ order.OrderID }}</span>
      </div>

      <!-- Main Order Fare & Distance Card -->
      <div class="card border-0 shadow-sm rounded-4 p-4 text-center bg-white mb-3">
        <div class="small text-muted fw-bold text-uppercase">TOTAL DELIVERY FARE</div>
        <div class="display-5 fw-bold text-success my-1">₹{{ order.EstimatedPayout }}</div>
        <div class="small text-muted mb-3">Base: ₹{{ order.DeliveryFee }} • Surge: ₹{{ order.SurgeBonus }} • Tip: ₹{{ order.TipAmount }}</div>

        <div class="row g-2 border-top pt-3 text-start">
          <div class="col-6">
            <div class="small text-muted">Distance to Customer</div>
            <div class="fw-bold fs-5 text-dark"><i class="bi bi-geo-alt-fill text-danger me-1"></i>{{ order.DistanceKm }} km</div>
          </div>
          <div class="col-6">
            <div class="small text-muted">Estimated Trip Time</div>
            <div class="fw-bold fs-5 text-dark"><i class="bi bi-clock-fill text-primary me-1"></i>~{{ order.EstimatedMinutes }} mins</div>
          </div>
        </div>
      </div>

      <!-- Locations Card -->
      <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
        <div class="d-flex align-items-start mb-3">
          <div class="p-2 bg-success bg-opacity-10 text-success rounded-circle me-3 mt-1">
            <i class="bi bi-shop"></i>
          </div>
          <div>
            <div class="small text-muted fw-bold">PICKUP: DARK STORE</div>
            <div class="fw-bold text-dark">{{ order.StoreName }}</div>
            <div class="small text-muted">{{ order.StoreAddress }}</div>
          </div>
        </div>

        <div class="d-flex align-items-start">
          <div class="p-2 bg-danger bg-opacity-10 text-danger rounded-circle me-3 mt-1">
            <i class="bi bi-house-door-fill"></i>
          </div>
          <div>
            <div class="small text-muted fw-bold">DROP: CUSTOMER LOCATION</div>
            <div class="fw-bold text-dark">{{ order.CustomerName }}</div>
            <div class="small text-muted">{{ order.DeliveryAddress }}</div>
          </div>
        </div>
      </div>

      <!-- Items Details Summary -->
      <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <h6 class="fw-bold text-dark mb-2">Package Items ({{ order.ItemsCount }} items)</h6>
        <div v-for="it in order.Items" :key="it.name" class="d-flex justify-content-between py-1 border-bottom small">
          <span>{{ it.qty }}x {{ it.name }}</span>
          <span class="fw-semibold">₹{{ it.price }}</span>
        </div>
        <div class="d-flex justify-content-between pt-2 fw-bold small">
          <span>Payment: {{ order.PaymentMethod }}</span>
          <span :class="order.PaymentMethod === 'COD' ? 'text-danger' : 'text-success'">
            {{ order.PaymentMethod === 'COD' ? 'Collect ₹' + order.TotalAmount : 'PREPAID' }}
          </span>
        </div>
      </div>

      <!-- 2 Buttons: ACCEPT / PASS -->
      <div class="row g-2 mb-4">
        <div class="col-5">
          <button class="btn btn-outline-danger w-100 py-3 rounded-4 fw-bold" @click="passOrder">
            <i class="bi bi-x-circle me-1"></i> Pass
          </button>
        </div>
        <div class="col-7">
          <button class="btn btn-success w-100 py-3 rounded-4 fw-bold shadow" @click="acceptOrder" :disabled="accepting">
            <span v-if="accepting" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi bi-check2-circle me-1"></i> Accept Order
          </button>
        </div>
      </div>

    </div>
  `,
  data() {
    return {
      order: null,
      accepting: false
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    await this.fetchOrder(id);
  },
  methods: {
    async fetchOrder(id) {
      try {
        const res = await API.getActiveOrder();
        if (res.order) {
          this.order = res.order;
        }
      } catch (e) {
        console.warn(e);
      }
    },
    async acceptOrder() {
      this.accepting = true;
      try {
        const res = await API.acceptOrder(this.order.OrderID);
        // Generate ROC ID (Rider Order Code)
        const rocid = `ROC-${this.order.StoreID}-${this.order.OrderID}-${Math.floor(100 + Math.random() * 900)}`;
        localStorage.setItem(`roc_${this.order.OrderID}`, rocid);
        // Navigate to status or bin pickup
        this.$router.push(`/order/${this.order.OrderID}/status`);
      } catch (e) {
        alert(e.message || 'Error accepting order');
      } finally {
        this.accepting = false;
      }
    },
    passOrder() {
      if (confirm('Are you sure you want to pass this order?')) {
        this.$router.push('/home');
      }
    }
  }
};

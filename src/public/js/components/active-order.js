// Active Order Component - Separate JS Template
const ActiveOrder = {
  template: `
    <div class="container py-3" style="max-width: 540px;" v-if="order">
      
      <!-- Top Order Status Banner -->
      <div class="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill">
            {{ formatStatus(order.Status) }}
          </span>
          <span class="fw-bold text-success fs-5">₹{{ order.EstimatedPayout }}</span>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="fw-bold mb-0 text-dark">{{ order.OrderNo }}</h5>
          <span class="badge" :class="order.PaymentMethod === 'COD' ? 'bg-danger' : 'bg-primary'">
            {{ order.PaymentMethod === 'COD' ? 'CASH ON DELIVERY' : 'PREPAID ONLINE' }}
          </span>
        </div>
      </div>

      <!-- Step-by-Step Delivery Journey Progress -->
      <div class="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
        <h6 class="fw-bold mb-3 text-secondary text-uppercase small">Trip Milestones</h6>

        <!-- Step 1: Reach Store -->
        <div class="journey-step" :class="getStepClass('ARRIVED_AT_STORE')">
          <div class="journey-icon">
            <i class="bi bi-shop"></i>
          </div>
          <div class="flex-grow-1">
            <div class="fw-bold text-dark">Step 1: Reach Hub / Dark Store</div>
            <div class="small text-muted">{{ order.StoreName }}</div>
            <div class="small text-muted">{{ order.StoreAddress }}</div>
            <div class="mt-2" v-if="order.Status === 'ACCEPTED'">
              <button class="btn btn-sm btn-outline-success fw-bold rounded-pill" @click="advanceStatus('ARRIVED_AT_STORE')" :disabled="updating">
                <i class="bi bi-geo-alt me-1"></i> I Have Reached Store
              </button>
              <a :href="'tel:' + order.StorePhone" class="btn btn-sm btn-light ms-1 rounded-pill">
                <i class="bi bi-telephone text-primary"></i> Call Hub
              </a>
            </div>
          </div>
        </div>

        <!-- Step 2: Pick Items -->
        <div class="journey-step" :class="getStepClass('PICKED_UP')">
          <div class="journey-icon">
            <i class="bi bi-box-seam"></i>
          </div>
          <div class="flex-grow-1">
            <div class="fw-bold text-dark">Step 2: Collect & Verify Items</div>
            <div class="small text-muted">{{ order.ItemsCount }} items bagged by packer</div>
            
            <!-- Items Checklist Dropdown -->
            <div class="mt-1 mb-2">
              <div v-for="item in order.Items" :key="item.name" class="small py-1 border-bottom d-flex justify-content-between">
                <span>{{ item.qty }}x {{ item.name }}</span>
                <span class="text-muted">₹{{ item.price }}</span>
              </div>
            </div>

            <div class="mt-2" v-if="order.Status === 'ARRIVED_AT_STORE'">
              <button class="btn btn-sm btn-success fw-bold rounded-pill" @click="advanceStatus('PICKED_UP')" :disabled="updating">
                <i class="bi bi-check2-circle me-1"></i> Order Picked Up & Bagged
              </button>
            </div>
          </div>
        </div>

        <!-- Step 3: Out for Delivery -->
        <div class="journey-step" :class="getStepClass('OUT_FOR_DELIVERY')">
          <div class="journey-icon">
            <i class="bi bi-bicycle"></i>
          </div>
          <div class="flex-grow-1">
            <div class="fw-bold text-dark">Step 3: Head to Customer</div>
            <div class="small text-muted">{{ order.DistanceKm }} km • ~{{ order.EstimatedMinutes }} mins</div>
            <div class="mt-2" v-if="order.Status === 'PICKED_UP'">
              <button class="btn btn-sm btn-primary fw-bold rounded-pill" @click="advanceStatus('OUT_FOR_DELIVERY')" :disabled="updating">
                <i class="bi bi-play-circle me-1"></i> Start Navigation
              </button>
              <router-link to="/map" class="btn btn-sm btn-outline-primary ms-1 rounded-pill">
                <i class="bi bi-map"></i> View Map
              </router-link>
            </div>
          </div>
        </div>

        <!-- Step 4: Reached Customer -->
        <div class="journey-step" :class="getStepClass('ARRIVED_AT_CUSTOMER')">
          <div class="journey-icon">
            <i class="bi bi-house-door"></i>
          </div>
          <div class="flex-grow-1">
            <div class="fw-bold text-dark">Step 4: At Customer Doorstep</div>
            <div class="small text-dark fw-semibold">{{ order.CustomerName }}</div>
            <div class="small text-muted">{{ order.DeliveryAddress }}</div>
            <div class="mt-2" v-if="order.Status === 'OUT_FOR_DELIVERY'">
              <button class="btn btn-sm btn-warning text-dark fw-bold rounded-pill" @click="advanceStatus('ARRIVED_AT_CUSTOMER')" :disabled="updating">
                <i class="bi bi-geo-fill me-1"></i> I Have Reached Customer
              </button>
              <a :href="'tel:' + order.CustomerPhone" class="btn btn-sm btn-light ms-1 rounded-pill">
                <i class="bi bi-telephone text-success"></i> Call Customer
              </a>
            </div>
          </div>
        </div>

        <!-- Step 5: Verification & Delivery Completion -->
        <div class="journey-step" :class="getStepClass('DELIVERED')">
          <div class="journey-icon">
            <i class="bi bi-shield-check"></i>
          </div>
          <div class="flex-grow-1">
            <div class="fw-bold text-dark">Step 5: Handover & Confirm</div>
            <div class="small text-muted">Customer OTP & Cash collection</div>

            <!-- OTP & Cash Form if Arrived at Customer -->
            <div v-if="['ARRIVED_AT_CUSTOMER'].includes(order.Status) && !isDelivered" class="mt-3 p-3 bg-light rounded-3 border">
              
              <!-- COD Collection Alert -->
              <div v-if="order.PaymentMethod === 'COD'" class="alert alert-warning py-2 mb-3 small">
                <div class="fw-bold text-danger fs-6">
                  <i class="bi bi-cash-coin me-1"></i> COLLECT CASH: ₹{{ order.TotalAmount }}
                </div>
                <div class="text-muted">Collect cash from customer before handing over package</div>
                <div class="form-check mt-2">
                  <input class="form-check-input" type="checkbox" id="cashCheck" v-model="cashCollected">
                  <label class="form-check-label fw-bold small text-dark" for="cashCheck">
                    Cash ₹{{ order.TotalAmount }} Collected
                  </label>
                </div>
              </div>

              <!-- Customer OTP -->
              <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">Customer 4-Digit Delivery OTP</label>
                <div class="input-group">
                  <input type="text" class="form-control text-center fs-4 fw-bold letter-spacing-2" maxlength="4" placeholder="••••" v-model="customerOtp">
                  <button class="btn btn-outline-secondary btn-sm" type="button" @click="useDemoOtp">Demo OTP</button>
                </div>
                <small class="text-muted">Customer receives this 4-digit code on SMS</small>
              </div>

              <button 
                class="btn btn-success w-100 py-2 fw-bold rounded-pill shadow-sm"
                @click="completeDelivery"
                :disabled="delivering || (order.PaymentMethod === 'COD' && !cashCollected)"
              >
                <span v-if="delivering" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-check-circle-fill me-1"></i> Verify OTP & Complete Delivery
              </button>

            </div>
          </div>
        </div>

      </div>

      <!-- Success Card when Delivered -->
      <div v-if="isDelivered" class="card border-0 shadow rounded-4 p-4 text-center bg-success text-white mb-3">
        <i class="bi bi-trophy-fill fs-1 mb-2 text-warning"></i>
        <h4 class="fw-bold">Delivery Completed!</h4>
        <p class="mb-3 text-white-50">Great job! Payout has been credited to your Alif Rider Wallet.</p>
        <div class="bg-white text-dark rounded-3 p-3 mb-3 shadow-sm">
          <div class="small text-muted">EARNED ON THIS TRIP</div>
          <div class="fs-2 fw-bold text-success">+ ₹{{ order.EstimatedPayout }}</div>
          <div class="small text-muted mt-1">Base: ₹{{ order.DeliveryFee }} • Tip: ₹{{ order.TipAmount }} • Surge: ₹{{ order.SurgeBonus }}</div>
        </div>
        <router-link to="/dashboard" class="btn btn-light text-success fw-bold py-2 rounded-pill">
          Back to Dashboard for Next Order
        </router-link>
      </div>

    </div>

    <!-- Empty State -->
    <div v-else class="container py-5 text-center text-muted">
      <i class="bi bi-box2 fs-1 d-block mb-2 text-secondary opacity-50"></i>
      <h5>No Active Order Selected</h5>
      <p class="small">Return to the dashboard to accept pending orders.</p>
      <router-link to="/dashboard" class="btn btn-success btn-sm rounded-pill px-4">Go to Dashboard</router-link>
    </div>
  `,
  data() {
    return {
      order: null,
      updating: false,
      delivering: false,
      customerOtp: '',
      cashCollected: false,
      isDelivered: false
    };
  },
  async mounted() {
    const orderId = this.$route.params.id;
    await this.loadOrder(orderId);
  },
  methods: {
    async loadOrder(orderId) {
      try {
        const res = await API.getActiveOrder();
        if (res.order) {
          this.order = res.order;
          if (this.order.Status === 'DELIVERED') {
            this.isDelivered = true;
          }
        }
      } catch (e) {
        console.warn('Error loading order:', e.message);
      }
    },
    useDemoOtp() {
      if (this.order && this.order.OTP) {
        this.customerOtp = this.order.OTP;
      }
    },
    formatStatus(status) {
      const map = {
        'ASSIGNED': 'Order Assigned',
        'ACCEPTED': 'Offer Accepted - Head to Store',
        'ARRIVED_AT_STORE': 'At Dark Store',
        'PICKED_UP': 'Items Picked Up',
        'OUT_FOR_DELIVERY': 'Out for Delivery',
        'ARRIVED_AT_CUSTOMER': 'At Customer Door',
        'DELIVERED': 'Delivered Successfully'
      };
      return map[status] || status;
    },
    getStepClass(stepKey) {
      const orderSteps = ['ACCEPTED', 'ARRIVED_AT_STORE', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'ARRIVED_AT_CUSTOMER', 'DELIVERED'];
      const currentIndex = orderSteps.indexOf(this.order?.Status || '');
      const stepIndex = orderSteps.indexOf(stepKey);

      if (this.order?.Status === 'DELIVERED' || currentIndex > stepIndex) {
        return 'done';
      }
      if (currentIndex === stepIndex) {
        return 'active';
      }
      return '';
    },
    async advanceStatus(newStatus) {
      this.updating = true;
      try {
        const res = await API.updateOrderStatus(this.order.OrderID, newStatus);
        if (res.success) {
          this.order = res.order;
        }
      } catch (e) {
        alert(e.message || 'Error updating milestone');
      } finally {
        this.updating = false;
      }
    },
    async completeDelivery() {
      if (!this.customerOtp || this.customerOtp.length !== 4) {
        alert('Please enter 4-digit Customer OTP');
        return;
      }

      this.delivering = true;
      try {
        // 1. Verify OTP
        await API.verifyOtp(this.order.OrderID, this.customerOtp);

        // 2. If COD, collect cash
        if (this.order.PaymentMethod === 'COD') {
          await API.collectCash(this.order.OrderID, this.order.TotalAmount);
        }

        // 3. Mark delivery completed
        const res = await API.deliverOrder(this.order.OrderID);
        if (res.success) {
          this.order.Status = 'DELIVERED';
          this.isDelivered = true;
        }
      } catch (err) {
        alert(err.message || 'Verification failed');
      } finally {
        this.delivering = false;
      }
    }
  }
};

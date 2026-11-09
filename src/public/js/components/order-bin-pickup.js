// Order Bin Pickup Component - Alif Delivery (/order/:id/roc/:rocid)
const OrderBinPickup = {
  template: `
    <div class="container py-3" style="max-width: 540px;" v-if="order">
      
      <!-- Top Stage Banner -->
      <div class="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <span class="small text-muted fw-bold">PICKUP VERIFICATION</span>
            <h5 class="fw-bold mb-0 text-dark">Scan Bin & Collect Package</h5>
          </div>
          <span class="badge bg-primary text-white rounded-pill px-3 py-1">{{ rocid }}</span>
        </div>
      </div>

      <!-- State 1: Before Bin Scan / Matching -->
      <div v-if="!isBinMatched" class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3">
        <div class="text-center mb-3">
          <div class="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 text-warning mb-2">
            <i class="bi bi-box-arrow-in-down fs-1"></i>
          </div>
          <h5 class="fw-bold text-dark">Go to Assigned Bin: <span class="text-primary">{{ targetBinId }}</span></h5>
          <p class="small text-muted">Scan the barcode on the bin or enter Bin ID manually to verify.</p>
        </div>

        <!-- Items Checklist -->
        <div class="p-3 bg-light rounded-3 border mb-3">
          <div class="fw-bold small text-dark mb-2">Order Items to Pick (Order #{{ order.OrderID }}):</div>
          <div v-for="it in order.Items" :key="it.name" class="d-flex justify-content-between py-1 small border-bottom">
            <span>{{ it.qty }}x {{ it.name }}</span>
            <span class="text-success fw-bold"><i class="bi bi-check-circle-fill"></i> Bagged</span>
          </div>
        </div>

        <form @submit.prevent="verifyBin">
          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Enter or Scan Bin Barcode ID</label>
            <div class="input-group">
              <input type="text" class="form-control text-uppercase fw-bold" v-model="scannedBinId" placeholder="e.g. BIN-D04" required>
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="scannedBinId = targetBinId">
                Auto-Fill
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-success w-100 py-3 rounded-3 fw-bold shadow-sm" :disabled="verifying">
            <span v-if="verifying" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi bi-check2-circle me-1"></i> Verify Bin & Confirm Pick Up
          </button>
        </form>
      </div>

      <!-- State 2: Bin Matched -> Picked! Show Customer Location, Customer Contact, Delivery Code Generated -->
      <div v-else class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3">
        
        <div class="alert alert-success d-flex align-items-center mb-3 py-2 rounded-3">
          <i class="bi bi-check-circle-fill fs-4 me-2"></i>
          <div>
            <strong>Bin Matched & Items Picked!</strong>
            <div class="small">Status updated: Out for delivery</div>
          </div>
        </div>

        <!-- Generated Delivery Code ID -->
        <div class="p-3 bg-primary bg-opacity-10 border border-primary rounded-4 text-center mb-3">
          <div class="small text-primary fw-bold text-uppercase">GENERATED DELIVERY CODE</div>
          <div class="display-6 fw-bold text-primary my-1">{{ deliveryCode }}</div>
          <div class="small text-muted">Show this code or ask customer for delivery OTP on arrival</div>
        </div>

        <!-- Customer Location & Contact Details -->
        <div class="p-3 bg-light rounded-3 border mb-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold mb-0 text-dark">{{ order.CustomerName }}</h6>
            <span class="badge bg-danger text-white">Deliver in ~{{ order.EstimatedMinutes }}m</span>
          </div>

          <div class="small text-muted mb-3">
            <i class="bi bi-geo-alt-fill text-danger me-1"></i> {{ order.DeliveryAddress }}
          </div>

          <!-- Customer Contact Button -->
          <div class="row g-2">
            <div class="col-6">
              <a :href="'tel:' + order.CustomerPhone" class="btn btn-outline-success w-100 py-2 rounded-3 fw-bold small">
                <i class="bi bi-telephone-fill me-1"></i> Call Customer
              </a>
            </div>
            <div class="col-6">
              <a :href="'https://www.google.com/maps/dir/?api=1&destination=' + order.CustomerLat + ',' + order.CustomerLng" target="_blank" class="btn btn-outline-primary w-100 py-2 rounded-3 fw-bold small">
                <i class="bi bi-compass-fill me-1"></i> Google Maps
              </a>
            </div>
          </div>
        </div>

        <!-- Handover & OTP Verification -->
        <div class="p-3 border rounded-3 bg-white mb-3">
          <label class="form-label small fw-bold text-secondary">Customer Handover OTP</label>
          <div class="input-group mb-2">
            <input type="text" class="form-control text-center fs-4 fw-bold letter-spacing-2" maxlength="4" placeholder="••••" v-model="customerOtp">
            <button class="btn btn-outline-secondary btn-sm" type="button" @click="customerOtp = order.OTP">Auto-Fill</button>
          </div>

          <div v-if="order.PaymentMethod === 'COD'" class="form-check mb-2">
            <input class="form-check-input" type="checkbox" id="codCheck" v-model="cashCollected">
            <label class="form-check-label small fw-bold text-danger" for="codCheck">
              Collected Cash ₹{{ order.TotalAmount }} from customer
            </label>
          </div>

          <button 
            class="btn btn-success w-100 py-3 rounded-3 fw-bold shadow mt-2"
            @click="completeAndRate"
            :disabled="completing || (order.PaymentMethod === 'COD' && !cashCollected)"
          >
            <span v-if="completing" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi bi-check-all me-1"></i> Confirm Delivery & Proceed to Rating
          </button>
        </div>

      </div>

    </div>
  `,
  data() {
    return {
      order: null,
      rocid: '',
      targetBinId: 'BIN-D04',
      scannedBinId: '',
      isBinMatched: false,
      verifying: false,
      completing: false,
      deliveryCode: '',
      customerOtp: '',
      cashCollected: false
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    this.rocid = this.$route.params.rocid || localStorage.getItem(`roc_${id}`) || `ROC-1-${id}-742`;
    try {
      const res = await API.getActiveOrder();
      if (res.order) this.order = res.order;
    } catch (e) {
      console.warn(e);
    }
  },
  methods: {
    verifyBin() {
      if (this.scannedBinId.toUpperCase() !== this.targetBinId) {
        alert(`Bin mismatch! You scanned "${this.scannedBinId}", but order is at "${this.targetBinId}". Please verify shelf.`);
        return;
      }
      this.verifying = true;
      setTimeout(() => {
        this.verifying = false;
        this.isBinMatched = true;
        this.deliveryCode = `DEL-${this.order.OrderID}-${Math.floor(1000 + Math.random() * 9000)}`;
        API.updateOrderStatus(this.order.OrderID, 'OUT_FOR_DELIVERY').catch(() => {});
      }, 500);
    },
    async completeAndRate() {
      if (!this.customerOtp || this.customerOtp.length !== 4) {
        alert('Please enter 4-digit Customer OTP');
        return;
      }
      this.completing = true;
      try {
        await API.verifyOtp(this.order.OrderID, this.customerOtp);
        if (this.order.PaymentMethod === 'COD') {
          await API.collectCash(this.order.OrderID, this.order.TotalAmount);
        }
        await API.deliverOrder(this.order.OrderID);
        this.$router.push(`/order/${this.order.OrderID}/completed`);
      } catch (e) {
        alert(e.message || 'Error completing delivery');
      } finally {
        this.completing = false;
      }
    }
  }
};

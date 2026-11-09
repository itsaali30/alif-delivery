// Order Status Component - Alif Delivery (/order/:id/status)
const OrderStatus = {
  template: `
    <div class="container py-3" style="max-width: 540px;" v-if="order">
      
      <!-- Top Order Bar -->
      <div class="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <span class="small text-muted fw-bold">ORDER ID: {{ order.OrderNo }}</span>
            <h5 class="fw-bold mb-0 text-dark">Dark Store Packing Status</h5>
          </div>
          <span class="badge bg-primary text-white rounded-pill px-3 py-1">ROC: {{ rocid }}</span>
        </div>
      </div>

      <!-- Packing Pipeline Stages (Process, Packed, Bin:ID) -->
      <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3 text-center">
        
        <!-- Status Indicator Icon -->
        <div class="my-3">
          <div v-if="packingState === 'process'">
            <div class="spinner-border text-warning" style="width: 4rem; height: 4rem;" role="status"></div>
            <h5 class="fw-bold text-dark mt-3 mb-1">Items Being Picked & Packed</h5>
            <p class="small text-muted">Warehouse picker is collecting items in Dark Store aisles.</p>
          </div>

          <div v-else>
            <div class="d-inline-flex p-3 rounded-circle bg-success bg-opacity-10 text-success mb-2">
              <i class="bi bi-box-seam-fill fs-1"></i>
            </div>
            <h5 class="fw-bold text-success mt-2 mb-1">Packed & Staged at Bin!</h5>
            <div class="badge bg-success fs-5 px-4 py-2 my-2 rounded-pill shadow-sm">
              <i class="bi bi-upc-scan me-1"></i> ASSIGNED BIN: {{ binId }}
            </div>
            <p class="small text-muted">Proceed to Shelf/Bin staging area to scan and pick up package.</p>
          </div>
        </div>

        <!-- Simulation Toggle for Demo -->
        <div class="p-2 rounded-3 bg-light border small text-muted mb-3 d-flex justify-content-between align-items-center">
          <span>Staging Simulation:</span>
          <button class="btn btn-sm btn-outline-secondary" @click="togglePacked">
            {{ packingState === 'process' ? 'Fast-Forward to "Packed"' : 'Reset to "Process"' }}
          </button>
        </div>

        <button 
          class="btn btn-success w-100 py-3 rounded-3 fw-bold shadow-sm"
          :disabled="packingState !== 'packed'"
          @click="goToBinPickup"
        >
          <i class="bi bi-qr-code-scan me-1"></i> Proceed to Bin Pickup (Scan {{ binId }})
        </button>

      </div>

      <!-- Store Contact Footer -->
      <div class="text-center small text-muted">
        <span>Need help finding bin? Ask Hub Incharge at Dark Store</span>
      </div>

    </div>
  `,
  data() {
    return {
      order: null,
      rocid: '',
      packingState: 'packed', // 'process' | 'packed'
      binId: 'BIN-D04'
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    this.rocid = localStorage.getItem(`roc_${id}`) || `ROC-1-${id}-742`;
    try {
      const res = await API.getActiveOrder();
      if (res.order) this.order = res.order;
    } catch (e) {
      console.warn(e);
    }
  },
  methods: {
    togglePacked() {
      this.packingState = this.packingState === 'process' ? 'packed' : 'process';
    },
    goToBinPickup() {
      this.$router.push(`/order/${this.order.OrderID}/roc/${this.rocid}`);
    }
  }
};

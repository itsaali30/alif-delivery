// Home View Component - Alif Delivery
const HomeView = {
  template: `
    <div class="pb-5">
      <!-- Top Sticky Navigation Bar -->
      <nav class="navbar rider-top-bar d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <div class="bg-success text-white rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style="width: 38px; height: 38px;">
            <i class="bi bi-geo-alt-fill"></i>
          </div>
          <div>
            <div class="small text-muted fw-bold" style="font-size: 0.65rem;">CURRENT DARK STORE</div>
            <div class="fw-bold text-dark text-truncate" style="max-width: 175px;">
              {{ currentStoreName }}
            </div>
          </div>
        </div>

        <!-- Duty ON/OFF Toggle Switch Button -->
        <div>
          <button 
            class="btn duty-switch-btn d-flex align-items-center gap-1 shadow-sm"
            :class="isDutyOnline ? 'duty-online' : 'duty-offline'"
            @click="toggleDuty"
            :disabled="togglingDuty"
          >
            <span class="spinner-border spinner-border-sm" v-if="togglingDuty"></span>
            <i class="bi" :class="isDutyOnline ? 'bi-circle-fill text-success' : 'bi-circle text-secondary'" style="font-size: 0.7rem;"></i>
            <span>{{ isDutyOnline ? 'DUTY ON' : 'DUTY OFF' }}</span>
          </button>
        </div>
      </nav>

      <div class="container py-3" style="max-width: 540px;">
        
        <!-- Assigned Order Urgent Banner (If assigned, rider must proceed to /order/:id) -->
        <div v-if="assignedOrder" class="alert alert-warning border-2 border-warning shadow-sm rounded-4 p-3 mb-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-danger text-white px-2 py-1 fw-bold animate__animated animate__pulse animate__infinite">
              <i class="bi bi-bell-fill me-1"></i> ORDER ASSIGNED
            </span>
            <span class="fw-bold text-success fs-5">₹{{ assignedOrder.EstimatedPayout }}</span>
          </div>
          <h6 class="fw-bold mb-1 text-dark">{{ assignedOrder.OrderNo }} • {{ assignedOrder.CustomerName }}</h6>
          <div class="small text-muted mb-2 text-truncate">
            <i class="bi bi-geo-alt text-danger"></i> {{ assignedOrder.DeliveryAddress }}
          </div>
          <router-link :to="'/order/' + assignedOrder.OrderID" class="btn btn-success w-100 fw-bold py-2 rounded-3 shadow">
            <i class="bi bi-arrow-right-circle-fill me-1"></i> Open Order Screen
          </router-link>
        </div>

        <!-- Waiting For Order Template (Radar radar pulse animation) -->
        <div v-else class="card border-0 shadow-sm rounded-4 p-4 text-center bg-white mb-3">
          <div class="my-3">
            <div class="position-relative d-inline-block">
              <div class="spinner-grow text-success" style="width: 5rem; height: 5rem; opacity: 0.2;" role="status"></div>
              <div class="position-absolute top-50 start-50 translate-middle bg-success bg-opacity-10 text-success rounded-circle p-3">
                <i class="bi bi-bicycle fs-2"></i>
              </div>
            </div>
          </div>
          <h5 class="fw-bold text-dark mb-1">
            {{ isDutyOnline ? 'Waiting for New Orders...' : 'You are currently Offline' }}
          </h5>
          <p class="small text-muted mb-3">
            {{ isDutyOnline ? 'Searching nearby customer orders from ' + currentStoreName : 'Turn Duty ON from top right corner to start receiving delivery orders' }}
          </p>

          <div v-if="isDutyOnline" class="d-inline-flex align-items-center justify-content-center gap-2 p-2 px-3 rounded-pill bg-light border small text-muted mx-auto">
            <span class="spinner-grow spinner-grow-sm text-success"></span>
            <span>GPS Radar Active • 0-4.5 km</span>
          </div>
        </div>

        <!-- Current Week Ratecard / Incentive Template Widget -->
        <div class="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
              <span class="badge bg-primary bg-opacity-10 text-primary fw-bold">TODAY'S TARGET & INCENTIVE</span>
              <h6 class="fw-bold text-dark mt-1 mb-0">Ratecard: {{ activeDayLabel }}</h6>
            </div>
            <router-link to="/profile/ratecard/current-week" class="btn btn-outline-primary btn-sm rounded-pill py-0 px-2 small">
              View Week <i class="bi bi-chevron-right"></i>
            </router-link>
          </div>

          <!-- Week Days Top Navigation Row -->
          <div class="d-flex gap-1 overflow-auto py-2 mb-2 no-scrollbar">
            <button 
              v-for="d in currentWeekDays" 
              :key="d.date"
              class="btn btn-sm px-2 py-1 rounded-3 text-nowrap fw-semibold"
              :class="selectedDay === d.dayKey ? 'btn-primary text-white shadow-sm' : 'btn-light text-secondary'"
              @click="selectedDay = d.dayKey"
            >
              {{ d.label }}
            </button>
          </div>

          <!-- Target & Incentive Tiers for Selected Day -->
          <div class="p-2 rounded-3 bg-light border">
            <div class="d-flex justify-content-between py-1 border-bottom small">
              <span class="text-muted"><i class="bi bi-check2-circle text-success me-1"></i> Tier 1 (10 Orders)</span>
              <span class="fw-bold text-success">+ ₹150 Incentive</span>
            </div>
            <div class="d-flex justify-content-between py-1 border-bottom small">
              <span class="text-muted"><i class="bi bi-check2-circle text-success me-1"></i> Tier 2 (18 Orders)</span>
              <span class="fw-bold text-success">+ ₹320 Incentive</span>
            </div>
            <div class="d-flex justify-content-between py-1 small">
              <span class="text-muted"><i class="bi bi-trophy text-warning me-1"></i> Super Tier (25 Orders)</span>
              <span class="fw-bold text-danger">+ ₹550 Super Bonus</span>
            </div>
          </div>
        </div>

        <!-- Today's Fast Summary Cards -->
        <div class="row g-2 mb-3">
          <div class="col-6">
            <div class="p-3 bg-white rounded-4 border shadow-sm text-center">
              <div class="text-muted small">COMPLETED TODAY</div>
              <div class="fs-3 fw-bold text-dark">9 <span class="fs-6 text-muted">orders</span></div>
            </div>
          </div>
          <div class="col-6">
            <div class="p-3 bg-white rounded-4 border shadow-sm text-center">
              <div class="text-muted small">EARNED TODAY</div>
              <div class="fs-3 fw-bold text-success">₹680</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Navigation Bar -->
      <nav class="bottom-nav">
        <router-link to="/home" class="bottom-nav-item active">
          <i class="bi bi-house-door-fill"></i>
          <span>Home</span>
        </router-link>
        <router-link to="/slot" class="bottom-nav-item">
          <i class="bi bi-calendar-check"></i>
          <span>Slot</span>
        </router-link>
        <router-link to="/earning" class="bottom-nav-item">
          <i class="bi bi-wallet2"></i>
          <span>Earning</span>
        </router-link>
        <router-link to="/profile" class="bottom-nav-item">
          <i class="bi bi-person-circle"></i>
          <span>Profile</span>
        </router-link>
      </nav>
    </div>
  `,
  data() {
    return {
      togglingDuty: false,
      isDutyOnline: true,
      currentStoreName: 'Alif Dark Store - Dabeerpura (Store #1)',
      assignedOrder: null,
      selectedDay: '09-sun',
      currentWeekDays: [
        { dayKey: '09-sun', label: '09-Sun' },
        { dayKey: '10-mon', label: '10-Mon' },
        { dayKey: '11-tue', label: '11-Tue' },
        { dayKey: '12-wed', label: '12-Wed' },
        { dayKey: '13-thu', label: '13-Thu' },
        { dayKey: '14-fri', label: '14-Fri' },
        { dayKey: '15-sat', label: '15-Sat' }
      ]
    };
  },
  computed: {
    activeDayLabel() {
      const match = this.currentWeekDays.find(d => d.dayKey === this.selectedDay);
      return match ? match.label : 'Today';
    }
  },
  async mounted() {
    if (this.$root.rider) {
      this.currentStoreName = this.$root.rider.storeName || this.currentStoreName;
      this.isDutyOnline = this.$root.isOnline;
    }
    await this.checkAssignedOrder();
  },
  methods: {
    async checkAssignedOrder() {
      try {
        const res = await API.getActiveOrder();
        if (res.order) {
          this.assignedOrder = res.order;
        }
      } catch (e) {
        console.warn(e.message);
      }
    },
    async toggleDuty() {
      this.togglingDuty = true;
      try {
        const nextState = !this.isDutyOnline;
        const res = await API.toggleShift(nextState);
        this.isDutyOnline = res.isDutyOnline;
        this.$root.isOnline = this.isDutyOnline;
      } catch (e) {
        alert(e.message || 'Error updating duty');
      } finally {
        this.togglingDuty = false;
      }
    }
  }
};

// Rider Auth Component - Separate JS Template
const RiderAuth = {
  template: `
    <div class="container py-4" style="max-width: 440px;">
      <div class="text-center my-4">
        <div class="d-inline-flex p-3 rounded-circle bg-success bg-opacity-10 mb-2">
          <i class="bi bi-bicycle text-success fs-1"></i>
        </div>
        <h3 class="fw-bold text-dark mt-2">Alif Delivery</h3>
        <p class="text-muted small">Rider Partner Portal & Delivery Console</p>
      </div>

      <div class="card border-0 shadow-sm rounded-4 p-4">
        <h5 class="fw-bold mb-3 text-dark">Rider Sign In</h5>
        
        <div v-if="errorMessage" class="alert alert-danger py-2 small mb-3">
          <i class="bi bi-exclamation-triangle-fill me-1"></i> {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label small fw-semibold text-secondary">Registered Mobile Number</label>
            <div class="input-group">
              <span class="input-group-text bg-light text-muted border-end-0">+91</span>
              <input type="tel" class="form-control bg-light border-start-0" v-model="phone" placeholder="9876543210" required autofocus>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold text-secondary">Password / PIN</label>
            <input type="password" class="form-control bg-light" v-model="password" placeholder="••••••••" required>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold text-secondary">Quick Demo Rider Profile</label>
            <select class="form-select bg-light" v-model="selectedRiderId" @change="onQuickSelect">
              <option value="101">Rider 101: Mohammed Imran (Motorcycle - Dabeerpura)</option>
              <option value="102">Rider 102: Syed Ali (EV Scooter - Dabeerpura)</option>
            </select>
          </div>

          <button type="submit" class="btn btn-success w-100 py-2 fw-bold rounded-3 shadow-sm mt-2" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi bi-box-arrow-in-right me-1"></i> Start Shift & Sign In
          </button>
        </form>

        <div class="mt-4 pt-3 border-top text-center text-muted small">
          <span>Need help? Contact Hub Manager at Store</span>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      phone: '9876543210',
      password: 'password123',
      selectedRiderId: '101',
      loading: false,
      errorMessage: ''
    };
  },
  methods: {
    onQuickSelect() {
      if (this.selectedRiderId === '101') {
        this.phone = '9876543210';
      } else {
        this.phone = '9876543211';
      }
    },
    async handleLogin() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const res = await API.login(this.phone, this.password, this.selectedRiderId);
        if (res.success) {
          API.setToken(res.token);
          this.$root.rider = res.rider;
          this.$root.isLoggedIn = true;
          this.$root.isOnline = res.rider.isDutyOnline;
          
          // Connect Socket
          SocketClient.init(res.rider.riderId, res.rider.storeId);

          this.$router.push('/dashboard');
        }
      } catch (err) {
        this.errorMessage = err.message || 'Login failed. Please verify credentials.';
      } finally {
        this.loading = false;
      }
    }
  }
};

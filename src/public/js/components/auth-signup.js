// Auth Signup Component
const AuthSignup = {
  template: `
    <div class="container py-4" style="max-width: 460px;">
      <div class="text-center mb-3">
        <div class="d-inline-flex p-3 rounded-circle bg-success bg-opacity-10 mb-2">
          <i class="bi bi-person-plus-fill text-success fs-1"></i>
        </div>
        <h3 class="fw-bold text-dark">Join Alif Delivery</h3>
        <p class="text-muted small">Register as a Quick-Commerce Dark Store Rider</p>
      </div>

      <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div v-if="successMsg" class="alert alert-success py-2 small mb-3">
          <i class="bi bi-check-circle-fill me-1"></i> {{ successMsg }}
        </div>

        <form @submit.prevent="handleSignup">
          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Full Name</label>
            <input type="text" class="form-control" v-model="form.name" placeholder="e.g. Mohammed Imran" required>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Mobile Number</label>
            <div class="input-group">
              <span class="input-group-text bg-light text-muted">+91</span>
              <input type="tel" class="form-control" v-model="form.phone" placeholder="9876543210" required>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Select Primary Dark Store</label>
            <select class="form-select" v-model="form.storeId" required>
              <option value="1">Alif Dark Store - Dabeerpura (Store #1)</option>
              <option value="2">Alif Dark Store - Malakpet (Store #2)</option>
              <option value="3">Alif Dark Store - Tolichowki (Store #3)</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Vehicle Type</label>
            <select class="form-select" v-model="form.vehicleType" required>
              <option value="BIKE">Motorcycle / Bike</option>
              <option value="EV">Electric Scooter (EV)</option>
              <option value="CYCLE">Bicycle</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Driving License Number</label>
            <input type="text" class="form-control" v-model="form.licenseNo" placeholder="TS09-2022-XXXX" required>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Create Password / PIN</label>
            <input type="password" class="form-control" v-model="form.password" placeholder="••••••••" required>
          </div>

          <button type="submit" class="btn btn-success w-100 py-2 fw-bold rounded-3 shadow-sm mt-2" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
            Submit Application & Register
          </button>
        </form>

        <div class="text-center mt-3 small">
          <span class="text-muted">Already registered? </span>
          <router-link to="/login" class="fw-bold text-success text-decoration-none">Sign In here</router-link>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      form: {
        name: '',
        phone: '',
        storeId: '1',
        vehicleType: 'BIKE',
        licenseNo: '',
        password: ''
      },
      loading: false,
      successMsg: ''
    };
  },
  methods: {
    async handleSignup() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.successMsg = 'Registration successful! Your profile is approved. Redirecting to login...';
        setTimeout(() => {
          this.$router.push('/login');
        }, 1500);
      }, 800);
    }
  }
};

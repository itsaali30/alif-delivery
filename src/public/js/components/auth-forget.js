// Auth Forget Password Component
const AuthForget = {
  template: `
    <div class="container py-4" style="max-width: 440px;">
      <div class="text-center mb-3">
        <div class="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 mb-2">
          <i class="bi bi-key-fill text-warning fs-1"></i>
        </div>
        <h4 class="fw-bold text-dark">Reset Rider PIN</h4>
        <p class="text-muted small">Enter your phone number to receive a verification OTP</p>
      </div>

      <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div v-if="successMsg" class="alert alert-success py-2 small mb-3">
          <i class="bi bi-check-circle-fill me-1"></i> {{ successMsg }}
        </div>

        <form @submit.prevent="handleReset">
          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Registered Mobile Number</label>
            <div class="input-group">
              <span class="input-group-text bg-light">+91</span>
              <input type="tel" class="form-control" v-model="phone" placeholder="9876543210" required>
            </div>
          </div>

          <div v-if="otpSent" class="mb-3">
            <label class="form-label small fw-bold text-secondary">4-Digit SMS OTP</label>
            <input type="text" class="form-control text-center fs-5 fw-bold" v-model="otp" maxlength="4" placeholder="••••" required>
            <small class="text-success">Demo OTP: <strong>1234</strong></small>
          </div>

          <div v-if="otpSent" class="mb-3">
            <label class="form-label small fw-bold text-secondary">Enter New PIN</label>
            <input type="password" class="form-control" v-model="newPin" placeholder="••••••••" required>
          </div>

          <button v-if="!otpSent" type="button" class="btn btn-warning w-100 fw-bold py-2 rounded-3 text-dark mt-2" @click="sendOtp">
            Send Reset OTP
          </button>

          <button v-else type="submit" class="btn btn-success w-100 fw-bold py-2 rounded-3 mt-2">
            Confirm & Update PIN
          </button>
        </form>

        <div class="text-center mt-3 small">
          <router-link to="/login" class="text-decoration-none text-muted">
            <i class="bi bi-arrow-left me-1"></i> Back to Login
          </router-link>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      phone: '9876543210',
      otp: '',
      newPin: '',
      otpSent: false,
      successMsg: ''
    };
  },
  methods: {
    sendOtp() {
      if (!this.phone) return alert('Enter phone number');
      this.otpSent = true;
      this.otp = '1234';
    },
    handleReset() {
      if (this.otp !== '1234') return alert('Invalid OTP');
      this.successMsg = 'PIN updated successfully! Redirecting to login...';
      setTimeout(() => this.$router.push('/login'), 1500);
    }
  }
};

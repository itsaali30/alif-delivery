// Profile View Component - Alif Delivery (/profile)
const ProfileView = {
  template: `
    <div class="pb-5">
      <!-- Top Sticky Bar -->
      <div class="rider-top-bar d-flex justify-content-between align-items-center">
        <h5 class="fw-bold mb-0 text-dark"><i class="bi bi-person-circle text-success me-1"></i> Rider Profile</h5>
        <button class="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 fw-bold" @click="handleLogout">
          <i class="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </div>

      <div class="container py-3" style="max-width: 540px;">
        
        <!-- Rider Identity Card -->
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
          <div class="d-flex align-items-center">
            <div class="position-relative me-3">
              <div class="bg-success text-white rounded-circle p-3 d-flex align-items-center justify-content-center fs-2 shadow-sm" style="width: 64px; height: 64px;">
                <i class="bi bi-person-fill"></i>
              </div>
              <span class="position-absolute bottom-0 end-0 p-1 bg-success border border-white rounded-circle"></span>
            </div>
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between">
                <h5 class="fw-bold text-dark mb-0">{{ rider?.name || 'Mohammed Imran' }}</h5>
                <span class="badge bg-warning text-dark"><i class="bi bi-star-fill text-warning"></i> 4.85</span>
              </div>
              <div class="small text-muted">Rider ID: #{{ rider?.riderId || 101 }} • {{ rider?.phone || '9876543210' }}</div>
              <div class="small text-success fw-semibold mt-1">
                <i class="bi bi-check-circle-fill"></i> Verified Dark Store Delivery Partner
              </div>
            </div>
          </div>
        </div>

        <!-- Comprehensive Profile Menu List -->
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-3">
          <div class="list-group list-group-flush">
            
            <!-- 1. Store Management -->
            <router-link to="/profile/store" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3">
              <div class="d-flex align-items-center">
                <i class="bi bi-shop fs-5 text-primary me-3"></i>
                <div>
                  <div class="fw-semibold text-dark">Dark Store Allocation</div>
                  <small class="text-muted">Current Hub: {{ rider?.storeName || 'Dabeerpura Store #1' }}</small>
                </div>
              </div>
              <i class="bi bi-chevron-right text-muted"></i>
            </router-link>

            <!-- 2. Ratecard & Incentives -->
            <router-link to="/profile/ratecard" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3">
              <div class="d-flex align-items-center">
                <i class="bi bi-cash-coin fs-5 text-success me-3"></i>
                <div>
                  <div class="fw-semibold text-dark">Ratecard & Incentives</div>
                  <small class="text-muted">Current & Next Week Day Targets</small>
                </div>
              </div>
              <i class="bi bi-chevron-right text-muted"></i>
            </router-link>

            <!-- 3. Star Ratings & Performance -->
            <router-link to="/profile/star" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3">
              <div class="d-flex align-items-center">
                <i class="bi bi-star-fill fs-5 text-warning me-3"></i>
                <div>
                  <div class="fw-semibold text-dark">Performance & Star Ratings</div>
                  <small class="text-muted">Customer Reviews, Completed & Returns</small>
                </div>
              </div>
              <i class="bi bi-chevron-right text-muted"></i>
            </router-link>

            <!-- 4. Order History (20 Limit with Load More) -->
            <router-link to="/profile/orderHistiry" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3">
              <div class="d-flex align-items-center">
                <i class="bi bi-bag-check-fill fs-5 text-info me-3"></i>
                <div>
                  <div class="fw-semibold text-dark">Trip & Order History</div>
                  <small class="text-muted">Packed, Picked, Drop Timings & Address</small>
                </div>
              </div>
              <i class="bi bi-chevron-right text-muted"></i>
            </router-link>

            <!-- 5. Cash Balance & Deposit (COD) -->
            <router-link to="/profile/cashbalance" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3">
              <div class="d-flex align-items-center">
                <i class="bi bi-cash-stack fs-5 text-danger me-3"></i>
                <div>
                  <div class="fw-semibold text-dark">Cash Balance & Store Deposit</div>
                  <small class="text-muted">In Hand: ₹1,476 • QR Scan Approval</small>
                </div>
              </div>
              <i class="bi bi-chevron-right text-muted"></i>
            </router-link>

            <!-- 6. Insurance Card -->
            <router-link to="/profile/insurancecard" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3">
              <div class="d-flex align-items-center">
                <i class="bi bi-shield-check fs-5 text-secondary me-3"></i>
                <div>
                  <div class="fw-semibold text-dark">Medical & Accidental Insurance</div>
                  <small class="text-muted">₹5 Lakh Coverage Policy Card</small>
                </div>
              </div>
              <i class="bi bi-chevron-right text-muted"></i>
            </router-link>

            <!-- 7. Rider Training Videos -->
            <router-link to="/profile/training" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3">
              <div class="d-flex align-items-center">
                <i class="bi bi-play-btn-fill fs-5 text-primary me-3"></i>
                <div>
                  <div class="fw-semibold text-dark">Rider Academy & Training</div>
                  <small class="text-muted">Safety & SOP Videos</small>
                </div>
              </div>
              <i class="bi bi-chevron-right text-muted"></i>
            </router-link>

            <!-- 8. Kyc & Official Documents -->
            <router-link to="/profile/Documents" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3">
              <div class="d-flex align-items-center">
                <i class="bi bi-file-earmark-person fs-5 text-dark me-3"></i>
                <div>
                  <div class="fw-semibold text-dark">KYC, Bank & Nominee Documents</div>
                  <small class="text-muted">Aadhaar, PAN, Bank Passbook, Nominee</small>
                </div>
              </div>
              <i class="bi bi-chevron-right text-muted"></i>
            </router-link>

          </div>
        </div>

      </div>

      <!-- Bottom Nav -->
      <nav class="bottom-nav">
        <router-link to="/home" class="bottom-nav-item">
          <i class="bi bi-house-door"></i>
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
        <router-link to="/profile" class="bottom-nav-item active">
          <i class="bi bi-person-circle"></i>
          <span>Profile</span>
        </router-link>
      </nav>
    </div>
  `,
  computed: {
    rider() {
      return this.$root.rider;
    }
  },
  methods: {
    handleLogout() {
      if (confirm('Are you sure you want to log out of Alif Delivery?')) {
        API.removeToken();
        this.$root.isLoggedIn = false;
        this.$router.push('/login');
      }
    }
  }
};

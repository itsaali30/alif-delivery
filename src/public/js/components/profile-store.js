// Profile Store Component - Alif Delivery (/profile/store/*)
const ProfileStore = {
  template: `
    <div class="container py-3" style="max-width: 540px;">
      
      <!-- Top Nav -->
      <div class="d-flex align-items-center mb-3">
        <router-link to="/profile" class="btn btn-light btn-sm rounded-circle p-2 me-2">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <h5 class="fw-bold mb-0 text-dark">Dark Store Allocation</h5>
      </div>

      <!-- View 1: Change Store Form & Store List (/profile/store/change-store) -->
      <div v-if="isChangeView">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3">
          <h6 class="fw-bold text-dark mb-1">Request Store Transfer</h6>
          <p class="small text-muted mb-3">Select your desired Dark Store location. Requests are reviewed by Cluster Lead.</p>

          <form @submit.prevent="submitStoreChange">
            <div class="mb-3">
              <label class="form-label small fw-bold text-secondary">Choose New Dark Store</label>
              <div v-for="st in availableStores" :key="st.id" class="p-3 mb-2 rounded-3 border cursor-pointer" :class="selectedNewStoreId == st.id ? 'border-success bg-success bg-opacity-10' : 'bg-light'" @click="selectedNewStoreId = st.id" style="cursor: pointer;">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <div class="fw-bold text-dark">{{ st.name }}</div>
                    <div class="small text-muted">{{ st.address }}</div>
                    <span class="badge bg-white text-dark border mt-1">{{ st.zone }} • Radius: {{ st.radius }}</span>
                  </div>
                  <input type="radio" class="form-check-input" :value="st.id" v-model="selectedNewStoreId">
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-secondary">Reason for Transfer</label>
              <textarea class="form-control" rows="2" v-model="transferReason" placeholder="e.g. Relocated to closer residential area..." required></textarea>
            </div>

            <button type="submit" class="btn btn-success w-100 py-3 rounded-3 fw-bold shadow-sm" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
              Submit Transfer Request
            </button>
          </form>
        </div>

        <!-- Past Change Store Status History -->
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
          <h6 class="fw-bold text-dark mb-2">Past Store Change Requests</h6>
          
          <div v-for="req in pastRequests" :key="req.id" class="p-2 mb-2 rounded-3 border bg-light">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <span class="fw-bold text-dark">{{ req.targetStore }}</span>
                <div class="small text-muted">Requested on {{ req.date }}</div>
              </div>
              <span class="badge rounded-pill" :class="req.status === 'APPROVED' ? 'bg-success' : (req.status === 'AWAITING_APPROVAL' ? 'bg-warning text-dark' : 'bg-danger')">
                {{ req.status }}
              </span>
            </div>
            <div class="small text-muted mt-1">Remarks: {{ req.remarks }}</div>
          </div>
        </div>

        <div class="text-center">
          <router-link to="/profile/store" class="btn btn-outline-secondary btn-sm rounded-pill px-4">
            <i class="bi bi-arrow-left me-1"></i> Back to Current Store
          </router-link>
        </div>
      </div>

      <!-- View 2: Current Store Info (/profile/store) -->
      <div v-else>
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3 text-center">
          <div class="d-inline-flex p-3 rounded-circle bg-success bg-opacity-10 text-success mb-2">
            <i class="bi bi-shop fs-1"></i>
          </div>
          <span class="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill mx-auto mb-2">CURRENT ACTIVE ALLOCATION</span>
          <h4 class="fw-bold text-dark mb-1">{{ currentStore.name }}</h4>
          <p class="small text-muted mb-3">{{ currentStore.address }}</p>

          <div class="row g-2 border-top pt-3 text-start small">
            <div class="col-6">
              <span class="text-muted">Hub Incharge:</span>
              <div class="fw-bold text-dark">{{ currentStore.incharge }}</div>
            </div>
            <div class="col-6">
              <span class="text-muted">Contact Phone:</span>
              <div class="fw-bold text-dark">{{ currentStore.phone }}</div>
            </div>
            <div class="col-6">
              <span class="text-muted">Operating Hours:</span>
              <div class="fw-bold text-dark">06:00 AM - 03:00 AM</div>
            </div>
            <div class="col-6">
              <span class="text-muted">Active Dark Fleet:</span>
              <div class="fw-bold text-success">38 Riders on Duty</div>
            </div>
          </div>
        </div>

        <!-- Change Store CTA Button -->
        <div class="d-grid gap-2">
          <router-link to="/profile/store/change-store" class="btn btn-success py-3 rounded-3 fw-bold shadow-sm">
            <i class="bi bi-arrow-repeat me-1"></i> Change Store Location
          </router-link>
        </div>
      </div>

    </div>
  `,
  data() {
    return {
      submitting: false,
      selectedNewStoreId: '2',
      transferReason: 'Closer to my current residence in Malakpet.',
      currentStore: {
        id: 1,
        name: 'Alif Dark Store - Dabeerpura (Store #1)',
        address: 'Chavni, Dabeerpura, Hyderabad - 500023',
        incharge: 'Syed Tanveer (Floor Lead)',
        phone: '+91 9123456789'
      },
      availableStores: [
        { id: 1, name: 'Alif Dark Store - Dabeerpura (Store #1)', address: 'Dabeerpura, Hyderabad', zone: 'Old City Zone', radius: '4.5 km' },
        { id: 2, name: 'Alif Dark Store - Malakpet (Store #2)', address: 'Judges Colony, Malakpet, Hyderabad', zone: 'East Zone', radius: '4.0 km' },
        { id: 3, name: 'Alif Dark Store - Tolichowki (Store #3)', address: 'Paramount Hills, Tolichowki, Hyderabad', zone: 'West Zone', radius: '5.0 km' }
      ],
      pastRequests: [
        { id: 51, targetStore: 'Store #2 - Malakpet', date: '01 Nov 2026', status: 'AWAITING_APPROVAL', remarks: 'Under review with Area Manager' },
        { id: 48, targetStore: 'Store #1 - Dabeerpura', date: '15 Sep 2026', status: 'APPROVED', remarks: 'Allocated successfully' }
      ]
    };
  },
  computed: {
    isChangeView() {
      return this.$route.path.includes('/change-store');
    }
  },
  methods: {
    submitStoreChange() {
      this.submitting = true;
      setTimeout(() => {
        this.submitting = false;
        alert('Store transfer request submitted successfully! Awaiting Manager approval.');
        this.$router.push('/profile/store');
      }, 700);
    }
  }
};

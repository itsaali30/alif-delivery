// Profile Cash Balance Component - Alif Delivery (/profile/cashbalance/*)
const ProfileCashBalance = {
  template: `
    <div class="container py-3" style="max-width: 540px;">
      
      <!-- Top Navigation -->
      <div class="d-flex align-items-center mb-3">
        <router-link to="/profile" class="btn btn-light btn-sm rounded-circle p-2 me-2">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <h5 class="fw-bold mb-0 text-dark">Cash Balance & Handover</h5>
      </div>

      <!-- View 1: Deposit to Store (DTS) with Manager QR & Approval -->
      <div v-if="isDtsView">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3">
          <div class="text-center mb-3">
            <div class="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 text-danger mb-2">
              <i class="bi bi-qr-code-scan fs-1"></i>
            </div>
            <h5 class="fw-bold text-dark">Deposit Cash to Dark Store (DTS)</h5>
            <p class="small text-muted">Enter cash amount and scan Incharge/Manager QR code to submit handover.</p>
          </div>

          <!-- Step A: Enter Amount & Scan -->
          <div v-if="!awaitingApproval && !approvedSuccess">
            <div class="mb-3">
              <label class="form-label small fw-bold text-secondary">Deposit Amount (₹)</label>
              <div class="input-group">
                <span class="input-group-text bg-light fw-bold">₹</span>
                <input type="number" class="form-control form-control-lg fw-bold fs-4 text-success" v-model="depositAmount" :max="cashInHand">
                <button class="btn btn-outline-secondary btn-sm" type="button" @click="depositAmount = cashInHand">All Cash</button>
              </div>
              <small class="text-muted">Total Cash-in-Hand Available: <strong>₹{{ cashInHand }}</strong></small>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-secondary">Manager / Incharge QR Scan</label>
              <div class="p-3 bg-light rounded-3 border text-center">
                <i class="bi bi-camera-fill text-muted fs-3 d-block mb-1"></i>
                <div class="small fw-semibold text-dark">{{ scannedManagerName || 'Point Camera at Manager Deposit QR' }}</div>
                <button type="button" class="btn btn-sm btn-outline-primary mt-2 rounded-pill" @click="simulateQrScan">
                  <i class="bi bi-upc-scan me-1"></i> Scan Hub Manager QR
                </button>
              </div>
            </div>

            <button 
              class="btn btn-success w-100 py-3 rounded-3 fw-bold shadow-sm"
              :disabled="!depositAmount || depositAmount <= 0 || !scannedManagerQr"
              @click="submitForApproval"
            >
              Submit Handover & Wait for Approval
            </button>
          </div>

          <!-- Step B: Awaiting Incharge Approval -->
          <div v-else-if="awaitingApproval" class="text-center py-4">
            <div class="spinner-border text-warning mb-3" style="width: 3.5rem; height: 3.5rem;" role="status"></div>
            <h5 class="fw-bold text-dark">Awaiting Hub Lead Approval</h5>
            <p class="small text-muted mb-3">Deposit request of <strong>₹{{ depositAmount }}</strong> sent to Incharge <strong>{{ scannedManagerName }}</strong>.</p>
            <div class="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3">
              <i class="bi bi-hourglass-split me-1"></i> Verifying Cash Count...
            </div>
            
            <div>
              <button class="btn btn-sm btn-outline-success rounded-pill" @click="simulateApproval">
                Simulate Incharge "Approved" (Demo)
              </button>
            </div>
          </div>

          <!-- Step C: Approved Success (Cash balance deducted) -->
          <div v-else-if="approvedSuccess" class="text-center py-3">
            <div class="d-inline-flex p-3 rounded-circle bg-success text-white mb-2 shadow">
              <i class="bi bi-check-lg fs-1"></i>
            </div>
            <h4 class="fw-bold text-success">Cash Deposit Approved!</h4>
            <p class="small text-muted">₹{{ depositAmount }} successfully deposited. Depo ID: <strong>{{ lastDepoId }}</strong></p>
            
            <div class="p-3 bg-light rounded-3 border mb-3 text-start small">
              <div class="d-flex justify-content-between py-1">
                <span class="text-muted">Received By:</span>
                <span class="fw-bold text-dark">{{ scannedManagerName }}</span>
              </div>
              <div class="d-flex justify-content-between py-1">
                <span class="text-muted">New Cash Balance in Hand:</span>
                <span class="fw-bold text-success fs-6">₹{{ cashInHand }}</span>
              </div>
            </div>

            <router-link to="/profile/cashbalance" class="btn btn-success w-100 py-3 rounded-pill fw-bold shadow">
              Back to Cash Balance
            </router-link>
          </div>

        </div>
      </div>

      <!-- View 2: Past Cash Balance History (/profile/cashbalance/past) -->
      <div v-else-if="isPastView">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold text-dark mb-0">Deposit & Collection History</h6>
            <span class="badge bg-light text-muted border">All Records</span>
          </div>

          <!-- List: Depo-ID deposits & Take Cash by Order -->
          <div v-for="rec in pastCashRecords" :key="rec.id" class="p-3 mb-2 rounded-3 border bg-light">
            <div class="d-flex justify-content-between align-items-start mb-1">
              <div>
                <span class="fw-bold text-dark">
                  {{ rec.type === 'DEPOSIT' ? 'Deposit ' + rec.depoId : 'Order ' + rec.orderNo }}
                </span>
                <div class="small text-muted">{{ rec.date }} • {{ rec.desc }}</div>
              </div>
              <span class="fw-bold fs-6" :class="rec.type === 'DEPOSIT' ? 'text-danger' : 'text-success'">
                {{ rec.type === 'DEPOSIT' ? '- ₹' + rec.amount : '+ ₹' + rec.amount }}
              </span>
            </div>
            <div class="small text-muted">
              {{ rec.type === 'DEPOSIT' ? 'Manager: ' + rec.manager : 'Customer: ' + rec.customer }}
            </div>
          </div>

          <div class="text-center mt-3">
            <router-link to="/profile/cashbalance" class="btn btn-outline-secondary btn-sm rounded-pill px-4">
              <i class="bi bi-arrow-left me-1"></i> Back to Cash Balance
            </router-link>
          </div>
        </div>
      </div>

      <!-- View 3: Main Cash Balance Overview (/profile/cashbalance) -->
      <div v-else>
        
        <!-- Cash in Hand Card -->
        <div class="card border-0 shadow-sm rounded-4 p-4 text-center bg-white mb-3">
          <div class="small text-muted fw-bold text-uppercase">TOTAL CASH IN HAND (COLLECTED FROM CUSTOMERS)</div>
          <div class="display-4 fw-bold text-danger my-2">₹{{ cashInHand }}</div>
          <p class="small text-muted mb-3">Max holding limit: ₹3,000. Please deposit to Dark Store Incharge before starting next shift.</p>

          <div class="row g-2">
            <div class="col-6">
              <router-link to="/profile/cashbalance/deposit/DTS" class="btn btn-danger w-100 py-3 rounded-3 fw-bold shadow-sm">
                <i class="bi bi-arrow-up-right-circle me-1"></i> Deposit to Store
              </router-link>
            </div>
            <div class="col-6">
              <router-link to="/profile/cashbalance/past" class="btn btn-outline-secondary w-100 py-3 rounded-3 fw-bold">
                <i class="bi bi-clock-history me-1"></i> Past History
              </router-link>
            </div>
          </div>
        </div>

        <!-- Recent Cash Transactions Quick List -->
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
          <h6 class="fw-bold text-dark mb-2">Today's Collections</h6>
          
          <div class="p-2 mb-2 rounded-3 bg-light border d-flex justify-content-between align-items-center">
            <div>
              <span class="fw-bold text-dark">Order #801 (Shaik Farooq)</span>
              <div class="small text-muted">02:08 PM • COD Handover</div>
            </div>
            <span class="fw-bold text-success">+ ₹738.00</span>
          </div>

          <div class="p-2 mb-2 rounded-3 bg-light border d-flex justify-content-between align-items-center">
            <div>
              <span class="fw-bold text-dark">Order #798 (Syed Tanveer)</span>
              <div class="small text-muted">11:45 AM • COD Handover</div>
            </div>
            <span class="fw-bold text-success">+ ₹450.00</span>
          </div>
        </div>

      </div>

    </div>
  `,
  data() {
    return {
      cashInHand: 1476.0,
      depositAmount: 1476.0,
      scannedManagerQr: '',
      scannedManagerName: '',
      awaitingApproval: false,
      approvedSuccess: false,
      lastDepoId: '',
      pastCashRecords: [
        { id: 1, type: 'DEPOSIT', depoId: 'DEP-101-948', date: '08 Nov 09:30 PM', desc: 'Handed over to Incharge', amount: '1200.00', manager: 'Syed Tanveer (Lead)' },
        { id: 2, type: 'COLLECTION', orderNo: '#801', date: '09 Nov 02:08 PM', desc: 'COD Cash collected', amount: '738.00', customer: 'Shaik Farooq' },
        { id: 3, type: 'COLLECTION', orderNo: '#798', date: '09 Nov 11:45 AM', desc: 'COD Cash collected', amount: '450.00', customer: 'Syed Tanveer' },
        { id: 4, type: 'DEPOSIT', depoId: 'DEP-101-932', date: '07 Nov 10:15 PM', desc: 'Store cash settlement', amount: '950.00', manager: 'Syed Tanveer (Lead)' }
      ]
    };
  },
  computed: {
    isDtsView() {
      return this.$route.path.includes('/deposit') || this.$route.path.includes('/DTS');
    },
    isPastView() {
      return this.$route.path.includes('/past');
    }
  },
  methods: {
    simulateQrScan() {
      this.scannedManagerQr = 'QR-MGR-STORE1-LEAD99';
      this.scannedManagerName = 'Syed Tanveer (Store #1 Incharge)';
    },
    submitForApproval() {
      this.awaitingApproval = true;
    },
    simulateApproval() {
      this.awaitingApproval = false;
      this.approvedSuccess = true;
      this.lastDepoId = `DEP-${Math.floor(100 + Math.random() * 900)}-${Date.now().toString().slice(-4)}`;
      // Deduct cash balance!
      this.cashInHand = Math.max(0, this.cashInHand - this.depositAmount);
      this.pastCashRecords.unshift({
        id: Date.now(),
        type: 'DEPOSIT',
        depoId: this.lastDepoId,
        date: 'Just now',
        desc: 'Handed over to Incharge (DTS)',
        amount: Number(this.depositAmount).toFixed(2),
        manager: this.scannedManagerName
      });
    }
  }
};

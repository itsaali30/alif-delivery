// Profile Documents Component - Alif Delivery (/profile/Documents/*)
const ProfileDocuments = {
  template: `
    <div class="container py-3" style="max-width: 540px;">
      
      <!-- Top Nav -->
      <div class="d-flex align-items-center mb-3">
        <router-link to="/profile" class="btn btn-light btn-sm rounded-circle p-2 me-2">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <h5 class="fw-bold mb-0 text-dark">
          {{ isBankView ? 'Bank Details & Passbook' : (isNomineeView ? 'Family Nominee & Emergency Contact' : 'KYC Documents') }}
        </h5>
      </div>

      <!-- Navigation Tabs between KYC, Bank, Nominee -->
      <div class="d-flex gap-1 mb-3">
        <router-link to="/profile/Documents" class="btn btn-sm px-3 rounded-pill fw-semibold flex-grow-1" :class="isKycView ? 'btn-success text-white' : 'btn-light border'">
          KYC / ID Proof
        </router-link>
        <router-link to="/profile/Documents/bank" class="btn btn-sm px-3 rounded-pill fw-semibold flex-grow-1" :class="isBankView ? 'btn-success text-white' : 'btn-light border'">
          Bank Account
        </router-link>
        <router-link to="/profile/Documents/nomie" class="btn btn-sm px-3 rounded-pill fw-semibold flex-grow-1" :class="isNomineeView ? 'btn-success text-white' : 'btn-light border'">
          Nominee
        </router-link>
      </div>

      <!-- View 1: Bank Documents (/profile/Documents/bank) -->
      <div v-if="isBankView" class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold text-dark mb-0">Payout Bank Account</h6>
          <span class="badge bg-success bg-opacity-10 text-success">VERIFIED & ACTIVE</span>
        </div>

        <form @submit.prevent="submitBank">
          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Bank Name</label>
            <input type="text" class="form-control" v-model="bankForm.bankName" required>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Account Holder Name</label>
            <input type="text" class="form-control" v-model="bankForm.holderName" required>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Account Number</label>
            <input type="text" class="form-control" v-model="bankForm.accountNumber" required>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">IFSC Code</label>
            <input type="text" class="form-control text-uppercase" v-model="bankForm.ifsc" required>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Upload Passbook / Cancelled Cheque / Statement</label>
            <div class="p-3 bg-light rounded-3 border text-center">
              <i class="bi bi-cloud-arrow-up-fill text-muted fs-3 d-block mb-1"></i>
              <span class="small text-muted">Uploaded file: <strong>passbook_imran.pdf</strong></span>
              <input type="file" class="form-control form-control-sm mt-2">
            </div>
          </div>

          <button type="submit" class="btn btn-success w-100 py-3 rounded-3 fw-bold">
            Update Bank Details
          </button>
        </form>
      </div>

      <!-- View 2: Nominee & Emergency Contact (/profile/Documents/nomie) -->
      <div v-else-if="isNomineeView" class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3">
        <h6 class="fw-bold text-dark mb-1">Family Nominee & Emergency Contact</h6>
        <p class="small text-muted mb-3">Essential for rider insurance claim settlement and emergency SOS.</p>

        <form @submit.prevent="submitNominee">
          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Nominee Full Name</label>
            <input type="text" class="form-control" v-model="nomineeForm.name" required>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Relationship with Rider</label>
            <select class="form-select" v-model="nomineeForm.relation" required>
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Wife">Spouse / Wife</option>
              <option value="Brother">Brother</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Emergency Mobile Number</label>
            <input type="tel" class="form-control" v-model="nomineeForm.phone" required>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Residential Address</label>
            <textarea class="form-control" rows="2" v-model="nomineeForm.address" required></textarea>
          </div>

          <button type="submit" class="btn btn-success w-100 py-3 rounded-3 fw-bold">
            Save Nominee Details
          </button>
        </form>
      </div>

      <!-- View 3: KYC / ID Documents (/profile/Documents) -->
      <div v-else class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3">
        <h6 class="fw-bold text-dark mb-1">Government ID Documents (Aadhaar / PAN / Voter ID)</h6>
        <p class="small text-muted mb-3">Upload clear front & back photos for identity verification.</p>

        <form @submit.prevent="submitKyc">
          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Aadhaar Card Number</label>
            <input type="text" class="form-control" v-model="kycForm.aadhaar" placeholder="XXXX-XXXX-XXXX" required>
            <div class="mt-1">
              <input type="file" class="form-control form-control-sm">
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">PAN Card Number</label>
            <input type="text" class="form-control text-uppercase" v-model="kycForm.pan" placeholder="ABCDE1234F" required>
            <div class="mt-1">
              <input type="file" class="form-control form-control-sm">
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Driving License (DL)</label>
            <input type="text" class="form-control" v-model="kycForm.dl" placeholder="TS09-2022-XXXX" required>
            <div class="mt-1">
              <input type="file" class="form-control form-control-sm">
            </div>
          </div>

          <button type="submit" class="btn btn-success w-100 py-3 rounded-3 fw-bold shadow-sm">
            Submit Documents for Verification
          </button>
        </form>
      </div>

    </div>
  `,
  data() {
    return {
      bankForm: {
        bankName: 'State Bank of India (SBI)',
        holderName: 'Mohammed Imran',
        accountNumber: '38192039120',
        ifsc: 'SBIN0001234'
      },
      nomineeForm: {
        name: 'Fatima Begum',
        relation: 'Mother',
        phone: '9849098765',
        address: 'House # 16-2-410, Chavni, Dabeerpura, Hyderabad'
      },
      kycForm: {
        aadhaar: '6892-4910-3819',
        pan: 'BSXPI8821K',
        dl: 'TS09-2021-998811'
      }
    };
  },
  computed: {
    isBankView() {
      return this.$route.path.includes('/bank');
    },
    isNomineeView() {
      return this.$route.path.includes('/nomie');
    },
    isKycView() {
      return !this.isBankView && !this.isNomineeView;
    }
  },
  methods: {
    submitBank() {
      alert('Bank details updated successfully! Direct payouts enabled.');
    },
    submitNominee() {
      alert('Family nominee and emergency contact details saved!');
    },
    submitKyc() {
      alert('KYC documents submitted to Hub Manager for compliance verification.');
    }
  }
};

// Profile Insurance Component - Alif Delivery (/profile/insurancecard)
const ProfileInsurance = {
  template: `
    <div class="container py-3" style="max-width: 540px;">
      
      <!-- Top Nav -->
      <div class="d-flex align-items-center mb-3">
        <router-link to="/profile" class="btn btn-light btn-sm rounded-circle p-2 me-2">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <h5 class="fw-bold mb-0 text-dark">Rider Insurance Coverage</h5>
      </div>

      <!-- State 1: Active Insurance Card -->
      <div v-if="hasInsurance" class="card border-0 shadow-lg rounded-4 overflow-hidden mb-3 text-white" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
        <div class="p-4">
          <div class="d-flex justify-content-between align-items-start mb-4">
            <div>
              <span class="badge bg-success px-3 py-1 rounded-pill">ACTIVE COVERAGE</span>
              <h5 class="fw-bold mt-2 mb-0">HDFC ERGO General Insurance</h5>
              <div class="small text-white-50">Group Health & Personal Accident Cover</div>
            </div>
            <i class="bi bi-shield-fill-check text-success fs-1"></i>
          </div>

          <div class="mb-4">
            <div class="small text-white-50">SUM INSURED</div>
            <div class="fs-2 fw-bold text-success">₹ 5,00,000</div>
          </div>

          <div class="row g-2 small text-white-50 pt-2 border-top border-secondary">
            <div class="col-6">
              <span>Policy Number:</span>
              <div class="fw-bold text-white">POL-ALIF-2026-98124</div>
            </div>
            <div class="col-6">
              <span>Insured Rider:</span>
              <div class="fw-bold text-white">Mohammed Imran</div>
            </div>
            <div class="col-6 mt-2">
              <span>Valid Till:</span>
              <div class="fw-bold text-white">31 Dec 2027</div>
            </div>
            <div class="col-6 mt-2">
              <span>TPA Helpline:</span>
              <div class="fw-bold text-success">1800-2666-400</div>
            </div>
          </div>
        </div>
      </div>

      <!-- State 2: If Not Having Insurance, Form Submission & Wait for Approval -->
      <div v-else class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3">
        <div v-if="submittedPending" class="text-center py-3">
          <div class="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 text-warning mb-2">
            <i class="bi bi-hourglass-split fs-1"></i>
          </div>
          <h5 class="fw-bold text-dark">Insurance Application Pending</h5>
          <p class="small text-muted mb-3">Your insurance enrollment has been submitted and is awaiting HR / Insurance Partner verification.</p>
          <span class="badge bg-warning text-dark px-3 py-2 rounded-pill">Status: AWAITING APPROVAL</span>
        </div>

        <div v-else>
          <h6 class="fw-bold text-dark mb-2">Apply for Free ₹5 Lakh Rider Insurance</h6>
          <p class="small text-muted mb-3">All active Alif dark store delivery riders are eligible for company-sponsored medical and accidental protection.</p>

          <form @submit.prevent="submitInsurance">
            <div class="mb-3">
              <label class="form-label small fw-bold text-secondary">Aadhaar Linked Full Name</label>
              <input type="text" class="form-control" v-model="form.name" required>
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold text-secondary">Date of Birth</label>
              <input type="date" class="form-control" v-model="form.dob" required>
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold text-secondary">Nominee Name & Relation</label>
              <input type="text" class="form-control" placeholder="e.g. Fatima Begum (Mother)" v-model="form.nominee" required>
            </div>
            <button type="submit" class="btn btn-success w-100 py-3 rounded-3 fw-bold">
              Submit Insurance Enrollment
            </button>
          </form>
        </div>
      </div>

      <!-- Quick Toggle for Demo -->
      <div class="text-center">
        <button class="btn btn-sm btn-link text-muted small text-decoration-none" @click="hasInsurance = !hasInsurance">
          [Switch: {{ hasInsurance ? 'Show "Submit Form Pending Approval"' : 'Show Active Policy Card' }}]
        </button>
      </div>

    </div>
  `,
  data() {
    return {
      hasInsurance: true,
      submittedPending: false,
      form: {
        name: 'Mohammed Imran',
        dob: '1998-05-14',
        nominee: 'Fatima Begum (Mother)'
      }
    };
  },
  methods: {
    submitInsurance() {
      this.submittedPending = true;
    }
  }
};

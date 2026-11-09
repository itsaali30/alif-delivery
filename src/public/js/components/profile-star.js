// Profile Star Component - Alif Delivery (/profile/star)
const ProfileStar = {
  template: `
    <div class="container py-3" style="max-width: 540px;">
      
      <!-- Top Nav -->
      <div class="d-flex align-items-center mb-3">
        <router-link to="/profile" class="btn btn-light btn-sm rounded-circle p-2 me-2">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <h5 class="fw-bold mb-0 text-dark">Rider Performance & Rating</h5>
      </div>

      <!-- Rating Score Card -->
      <div class="card border-0 shadow-sm rounded-4 p-4 text-center bg-white mb-3">
        <div class="display-3 fw-bold text-dark mb-0">4.85</div>
        <div class="text-warning fs-4 mb-1">
          <i class="bi bi-star-fill me-1"></i>
          <i class="bi bi-star-fill me-1"></i>
          <i class="bi bi-star-fill me-1"></i>
          <i class="bi bi-star-fill me-1"></i>
          <i class="bi bi-star-half"></i>
        </div>
        <div class="small text-muted mb-3">Based on 342 customer ratings</div>

        <!-- Star Distribution Bars -->
        <div class="text-start p-3 bg-light rounded-3 border">
          <div class="d-flex align-items-center mb-1 small">
            <span class="me-2" style="width: 45px;">5 Star</span>
            <div class="progress flex-grow-1 me-2" style="height: 6px;">
              <div class="progress-bar bg-success" style="width: 88%;"></div>
            </div>
            <span class="text-muted">88%</span>
          </div>
          <div class="d-flex align-items-center mb-1 small">
            <span class="me-2" style="width: 45px;">4 Star</span>
            <div class="progress flex-grow-1 me-2" style="height: 6px;">
              <div class="progress-bar bg-primary" style="width: 8%;"></div>
            </div>
            <span class="text-muted">8%</span>
          </div>
          <div class="d-flex align-items-center mb-1 small">
            <span class="me-2" style="width: 45px;">3 Star</span>
            <div class="progress flex-grow-1 me-2" style="height: 6px;">
              <div class="progress-bar bg-warning" style="width: 3%;"></div>
            </div>
            <span class="text-muted">3%</span>
          </div>
          <div class="d-flex align-items-center small">
            <span class="me-2" style="width: 45px;">1-2 Star</span>
            <div class="progress flex-grow-1 me-2" style="height: 6px;">
              <div class="progress-bar bg-danger" style="width: 1%;"></div>
            </div>
            <span class="text-muted">1%</span>
          </div>
        </div>
      </div>

      <!-- Lifetime Orders Breakdown Metrics (Total, Incompleted, Completed, Return) -->
      <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
        <h6 class="fw-bold text-dark mb-3">Delivery Order Metrics</h6>

        <div class="row g-2 text-center">
          <div class="col-6">
            <div class="p-3 bg-light rounded-3 border">
              <span class="small text-muted fw-bold">TOTAL ORDERS</span>
              <div class="fs-4 fw-bold text-dark">412</div>
              <div class="small text-muted">Assigned to you</div>
            </div>
          </div>

          <div class="col-6">
            <div class="p-3 bg-success bg-opacity-10 rounded-3 border border-success">
              <span class="small text-success fw-bold">COMPLETED</span>
              <div class="fs-4 fw-bold text-success">398</div>
              <div class="small text-success">96.6% Success</div>
            </div>
          </div>

          <div class="col-6">
            <div class="p-3 bg-warning bg-opacity-10 rounded-3 border border-warning">
              <span class="small text-warning fw-bold">INCOMPLETED</span>
              <div class="fs-4 fw-bold text-warning">8</div>
              <div class="small text-muted">Cancelled by user</div>
            </div>
          </div>

          <div class="col-6">
            <div class="p-3 bg-danger bg-opacity-10 rounded-3 border border-danger">
              <span class="small text-danger fw-bold">RETURNED</span>
              <div class="fs-4 fw-bold text-danger">6</div>
              <div class="small text-muted">Customer unavailable</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Badges / Compliments -->
      <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
        <h6 class="fw-bold text-dark mb-2">Customer Compliments</h6>
        <div class="d-flex flex-wrap gap-2">
          <span class="badge bg-light text-dark border p-2"><i class="bi bi-lightning-charge-fill text-warning me-1"></i> Lightning Fast (182)</span>
          <span class="badge bg-light text-dark border p-2"><i class="bi bi-shield-check text-success me-1"></i> Polite & Helpful (140)</span>
          <span class="badge bg-light text-dark border p-2"><i class="bi bi-box-seam text-primary me-1"></i> Perfect Packaging (98)</span>
          <span class="badge bg-light text-dark border p-2"><i class="bi bi-chat-heart text-danger me-1"></i> Great Attitude (76)</span>
        </div>
      </div>

    </div>
  `
};

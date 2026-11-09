// Order Completed Component - Alif Delivery (/order/:id/completed)
const OrderCompleted = {
  template: `
    <div class="container py-4" style="max-width: 500px;">
      
      <!-- Top Success Icon -->
      <div class="card border-0 shadow-sm rounded-4 p-4 text-center bg-white mb-3">
        <div class="d-inline-flex p-3 rounded-circle bg-success text-white mb-2 shadow">
          <i class="bi bi-check-lg fs-1"></i>
        </div>
        <h4 class="fw-bold text-dark mt-2 mb-1">Delivered Successfully!</h4>
        <p class="small text-muted">Order #{{ orderId }} has been dropped off on time.</p>

        <!-- Customer Rating Given to Rider Card -->
        <div class="p-3 bg-light rounded-4 border my-3">
          <div class="small fw-bold text-secondary text-uppercase mb-1">CUSTOMER RATING FOR RIDER</div>
          <div class="text-warning fs-3 mb-1">
            <i class="bi bi-star-fill me-1"></i>
            <i class="bi bi-star-fill me-1"></i>
            <i class="bi bi-star-fill me-1"></i>
            <i class="bi bi-star-fill me-1"></i>
            <i class="bi bi-star-fill"></i>
          </div>
          <div class="fw-bold text-dark">5.0 Star Rating Received!</div>
          <div class="small text-muted italic mt-1">"Superfast delivery! Very polite and professional rider."</div>
          
          <div class="d-flex justify-content-center gap-1 mt-2">
            <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 small">
              <i class="bi bi-lightning-charge-fill"></i> Lightning Fast
            </span>
            <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 py-1 small">
              <i class="bi bi-shield-check"></i> Package Intact
            </span>
          </div>
        </div>

        <!-- Payout Credited Card -->
        <div class="p-3 bg-success bg-opacity-10 rounded-3 border border-success mb-3 text-start">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="small fw-bold text-success">TOTAL PAYOUT CREDITED</span>
            <span class="fs-4 fw-bold text-success">+ ₹80.00</span>
          </div>
          <div class="small text-muted">
            Base fee: ₹45 • Customer Tip: ₹20 • Surge Bonus: ₹15
          </div>
        </div>

        <router-link to="/home" class="btn btn-success w-100 py-3 rounded-pill fw-bold shadow">
          Back to Home (Wait for Next Order)
        </router-link>
      </div>

    </div>
  `,
  data() {
    return {
      orderId: this.$route.params.id || '801'
    };
  }
};

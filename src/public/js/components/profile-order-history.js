// Profile Order History Component - Alif Delivery (/profile/orderHistiry/*)
const ProfileOrderHistory = {
  template: `
    <div class="container py-3" style="max-width: 540px;">
      
      <!-- Top Navigation -->
      <div class="d-flex align-items-center mb-3">
        <router-link :to="detailOrderId ? '/profile/orderHistiry' : '/profile'" class="btn btn-light btn-sm rounded-circle p-2 me-2">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <h5 class="fw-bold mb-0 text-dark">
          {{ isCustomerDetailView ? 'Customer Details' : (detailOrderId ? 'Order #' + detailOrderId : 'Order History') }}
        </h5>
      </div>

      <!-- View 1: Customer Details View (/profile/orderHistiry/:id/ccb) -->
      <div v-if="isCustomerDetailView" class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3">
        <div class="text-center mb-3">
          <div class="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-10 text-primary mb-2">
            <i class="bi bi-person-lines-fill fs-2"></i>
          </div>
          <h5 class="fw-bold text-dark">{{ currentOrderDetail.customerName }}</h5>
          <span class="badge bg-light text-muted border">Verified Customer</span>
        </div>

        <div class="p-3 bg-light rounded-3 border mb-3 small">
          <div class="mb-2">
            <span class="text-muted d-block">Delivery Address:</span>
            <strong class="text-dark">{{ currentOrderDetail.address }}</strong>
          </div>
          <div class="mb-2">
            <span class="text-muted d-block">Phone:</span>
            <strong class="text-dark">{{ currentOrderDetail.phone }}</strong>
          </div>
          <div>
            <span class="text-muted d-block">Delivery Instructions:</span>
            <span class="text-secondary italic">"Leave at door / ring bell once"</span>
          </div>
        </div>

        <div class="row g-2">
          <div class="col-6">
            <a :href="'tel:' + currentOrderDetail.phone" class="btn btn-success w-100 py-2 rounded-3 fw-bold small">
              <i class="bi bi-telephone-fill me-1"></i> Call Customer
            </a>
          </div>
          <div class="col-6">
            <a :href="'https://wa.me/91' + currentOrderDetail.phone" target="_blank" class="btn btn-outline-success w-100 py-2 rounded-3 fw-bold small">
              <i class="bi bi-whatsapp me-1"></i> WhatsApp
            </a>
          </div>
        </div>

        <div class="text-center mt-3">
          <router-link :to="'/profile/orderHistiry/' + detailOrderId" class="btn btn-link text-decoration-none small text-muted">
            Back to Order Details
          </router-link>
        </div>
      </div>

      <!-- View 2: Order Detail View (/profile/orderHistiry/:id) -->
      <div v-else-if="detailOrderId">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span class="small text-muted fw-bold">ORDER DETAILS</span>
              <h5 class="fw-bold mb-0 text-dark">#{{ detailOrderId }}</h5>
            </div>
            <span class="badge bg-success py-1 px-3 rounded-pill">DELIVERED</span>
          </div>

          <!-- Trip Timestamps: Packed, Picked, Drop -->
          <div class="p-3 bg-light rounded-3 border mb-3">
            <div class="fw-bold small text-dark mb-2">Trip Journey Timestamps</div>
            <div class="small d-flex justify-content-between py-1 border-bottom">
              <span class="text-muted"><i class="bi bi-box-seam me-1 text-primary"></i> Packed Time:</span>
              <span class="fw-semibold text-dark">{{ currentOrderDetail.packedTime }}</span>
            </div>
            <div class="small d-flex justify-content-between py-1 border-bottom">
              <span class="text-muted"><i class="bi bi-bicycle me-1 text-warning"></i> Picked Up Time:</span>
              <span class="fw-semibold text-dark">{{ currentOrderDetail.pickedTime }}</span>
            </div>
            <div class="small d-flex justify-content-between py-1">
              <span class="text-muted"><i class="bi bi-house-door me-1 text-success"></i> Drop Time:</span>
              <span class="fw-semibold text-dark">{{ currentOrderDetail.dropTime }}</span>
            </div>
          </div>

          <!-- Customer Address & Contact Button -->
          <div class="p-3 bg-light rounded-3 border mb-3">
            <div class="small text-muted fw-bold mb-1">DROP LOCATION</div>
            <div class="fw-bold text-dark">{{ currentOrderDetail.customerName }}</div>
            <div class="small text-muted mb-3">{{ currentOrderDetail.address }}</div>

            <!-- Customer Contact Button (opens /profile/orderHistiry/:id/ccb) -->
            <router-link :to="'/profile/orderHistiry/' + detailOrderId + '/ccb'" class="btn btn-primary btn-sm w-100 fw-bold rounded-pill">
              <i class="bi bi-person-lines-fill me-1"></i> Customer Contact & Details (CCB)
            </router-link>
          </div>

          <!-- Payout Detail -->
          <div class="d-flex justify-content-between align-items-center p-3 bg-success bg-opacity-10 border border-success rounded-3">
            <div>
              <div class="small text-muted">Payout Received</div>
              <div class="fw-bold text-success fs-5">₹{{ currentOrderDetail.payout }}</div>
            </div>
            <div class="small text-muted text-end">
              Distance: {{ currentOrderDetail.distance }} km<br>
              Mode: {{ currentOrderDetail.payMode }}
            </div>
          </div>
        </div>
      </div>

      <!-- View 3: Orders List (Last to First by Days, 20 limit + Load More) -->
      <div v-else>
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold text-dark mb-0">Delivered Orders</h6>
            <span class="badge bg-light text-muted border">Showing {{ displayedOrders.length }} of {{ allOrders.length }}</span>
          </div>

          <div v-for="ord in displayedOrders" :key="ord.id" class="p-3 mb-2 rounded-3 border bg-light">
            <div class="d-flex justify-content-between align-items-start mb-1">
              <div>
                <span class="fw-bold text-dark">#{{ ord.id }} • {{ ord.customerName }}</span>
                <div class="small text-muted">{{ ord.date }} • Drop: {{ ord.dropTime }}</div>
              </div>
              <span class="fw-bold text-success">+ ₹{{ ord.payout }}</span>
            </div>

            <div class="small text-muted text-truncate mb-2">
              <i class="bi bi-geo-alt text-danger me-1"></i> {{ ord.address }}
            </div>

            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 small">
                {{ ord.payMode }}
              </span>
              <router-link :to="'/profile/orderHistiry/' + ord.id" class="btn btn-outline-secondary btn-sm rounded-pill py-0 px-3 small fw-semibold">
                Details <i class="bi bi-chevron-right"></i>
              </router-link>
            </div>
          </div>

          <!-- Load More Button (Increases 20 each click) -->
          <div v-if="displayedOrders.length < allOrders.length" class="text-center mt-3">
            <button class="btn btn-outline-success w-100 py-2 rounded-pill fw-bold" @click="loadMore">
              <i class="bi bi-arrow-down-circle me-1"></i> Load More Orders (+20)
            </button>
          </div>

        </div>
      </div>

    </div>
  `,
  data() {
    return {
      limit: 20,
      allOrders: []
    };
  },
  computed: {
    detailOrderId() {
      return this.$route.params.id || null;
    },
    isCustomerDetailView() {
      return this.$route.path.includes('/ccb');
    },
    displayedOrders() {
      return this.allOrders.slice(0, this.limit);
    },
    currentOrderDetail() {
      const match = this.allOrders.find(o => String(o.id) === String(this.detailOrderId));
      return match || {
        id: this.detailOrderId || 801,
        customerName: 'Shaik Farooq',
        phone: '9988776655',
        address: 'Flat 302, Green Paradise Apts, Chanchalguda, Hyderabad',
        packedTime: '01:45 PM',
        pickedTime: '01:52 PM',
        dropTime: '02:08 PM',
        payout: '80.00',
        distance: '2.4',
        payMode: 'COD (₹738 Collected)'
      };
    }
  },
  created() {
    // Generate 45 realistic orders to demonstrate 20 + 20 pagination
    const list = [];
    const names = ['Shaik Farooq', 'Mirza Baig', 'Zubair Khan', 'Syed Tanveer', 'Ayesha Fatima', 'Mohammed Rafi', 'Adnan Ahmed'];
    const areas = ['Dabeerpura', 'Chanchalguda', 'Malakpet', 'Noor Khan Bazar', 'Yakutpura', 'Purani Haveli'];

    for (let i = 801; i >= 755; i--) {
      list.push({
        id: i,
        customerName: names[i % names.length],
        phone: `98490${10000 + i}`,
        address: `House #${(i * 3) % 900}, Road 4, ${areas[i % areas.length]}, Hyderabad`,
        date: i > 790 ? '09 Nov (Today)' : (i > 775 ? '08 Nov (Yesterday)' : '07 Nov'),
        packedTime: '12:30 PM',
        pickedTime: '12:38 PM',
        dropTime: '12:54 PM',
        payout: (45 + (i % 5) * 10).toFixed(2),
        distance: (1.5 + (i % 4) * 0.8).toFixed(1),
        payMode: i % 3 === 0 ? 'COD (Cash Collected)' : 'Online Prepaid'
      });
    }
    this.allOrders = list;
  },
  methods: {
    loadMore() {
      this.limit += 20;
    }
  }
};

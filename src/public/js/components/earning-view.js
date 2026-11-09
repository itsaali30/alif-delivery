// Earnings Component - Alif Delivery (/earning/*)
const EarningView = {
  template: `
    <div class="pb-5">
      <!-- Top Sticky Bar -->
      <div class="rider-top-bar d-flex justify-content-between align-items-center">
        <h5 class="fw-bold mb-0 text-dark"><i class="bi bi-wallet2 text-success me-1"></i> Earnings</h5>
        <router-link to="/earning/history" class="btn btn-outline-success btn-sm rounded-pill px-3 py-1 fw-bold small">
          <i class="bi bi-clock-history me-1"></i> Week History
        </router-link>
      </div>

      <div class="container py-3" style="max-width: 540px;">
        
        <!-- View Mode 1: Week History View (/earning/history) -->
        <div v-if="isHistoryView">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3 text-center">
            <div class="small text-muted fw-bold text-uppercase">TOTAL EARNING THIS WEEK (MON - SUN)</div>
            <div class="display-5 fw-bold text-success my-2">₹4,890.00</div>
            <div class="small text-muted">62 Orders Completed • Avg ₹78.8 per delivery</div>

            <div class="mt-3">
              <select class="form-select form-select-sm" v-model="selectedWeek">
                <option value="current">Current Week (03 Nov - 09 Nov)</option>
                <option value="last">Previous Week (27 Oct - 02 Nov)</option>
                <option value="oct3">19 Oct - 26 Oct (₹5,120)</option>
              </select>
            </div>
          </div>

          <!-- Orders Breakdown for Week -->
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
            <h6 class="fw-bold text-dark mb-3">Order-by-Order Breakdown (Earning + Surge)</h6>
            <div v-for="it in weekOrdersList" :key="it.orderId" class="p-2 mb-2 rounded-3 bg-light border d-flex justify-content-between align-items-center">
              <div>
                <span class="fw-bold text-dark">{{ it.orderNo }}</span>
                <div class="small text-muted">{{ it.date }} • Base: ₹{{ it.base }} + Surge: ₹{{ it.surge }}</div>
              </div>
              <span class="fw-bold text-success fs-6">₹{{ it.total }}</span>
            </div>
            
            <div class="text-center mt-2">
              <router-link to="/earning" class="btn btn-outline-secondary btn-sm rounded-pill px-4">
                <i class="bi bi-arrow-left me-1"></i> Back to Daily Earnings
              </router-link>
            </div>
          </div>
        </div>

        <!-- View Mode 2: Specific Day Detail View (/earning/:day/...) -->
        <div v-else-if="selectedDayKey">
          
          <!-- Day Summary Card -->
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3 text-center">
            <span class="badge bg-primary bg-opacity-10 text-primary fw-bold mx-auto mb-2 px-3 py-1 rounded-pill">
              EARNING FOR {{ selectedDayKey.toUpperCase() }}
            </span>
            <div class="display-5 fw-bold text-success my-1">₹{{ currentDayData.total }}</div>
            <div class="small text-muted">11 Orders Delivered • 32.5 km travelled</div>

            <!-- 4 Navigation Action Buttons for Sub-categories -->
            <div class="row g-2 mt-3 text-start">
              <div class="col-6">
                <button 
                  class="btn w-100 py-2 rounded-3 fw-semibold small text-start shadow-sm border"
                  :class="categoryTab === 'orderearning' ? 'btn-success text-white' : 'btn-light text-dark'"
                  @click="setCategory('orderearning')"
                >
                  <i class="bi bi-box-seam me-1"></i> Order Earning
                  <div class="fw-bold">₹{{ currentDayData.orderEarning }}</div>
                </button>
              </div>

              <div class="col-6">
                <button 
                  class="btn w-100 py-2 rounded-3 fw-semibold small text-start shadow-sm border"
                  :class="categoryTab === 'surge' ? 'btn-warning text-dark' : 'btn-light text-dark'"
                  @click="setCategory('surge')"
                >
                  <i class="bi bi-lightning-charge-fill me-1 text-warning"></i> Surge Pay
                  <div class="fw-bold">₹{{ currentDayData.surge }}</div>
                </button>
              </div>

              <div class="col-6">
                <button 
                  class="btn w-100 py-2 rounded-3 fw-semibold small text-start shadow-sm border"
                  :class="categoryTab === 'rainearning' ? 'btn-info text-white' : 'btn-light text-dark'"
                  @click="setCategory('rainearning')"
                >
                  <i class="bi bi-cloud-rain-fill me-1 text-info"></i> Rain Earning
                  <div class="fw-bold">₹{{ currentDayData.rain }}</div>
                </button>
              </div>

              <div class="col-6">
                <button 
                  class="btn w-100 py-2 rounded-3 fw-semibold small text-start shadow-sm border"
                  :class="categoryTab === 'otherearning' ? 'btn-danger text-white' : 'btn-light text-dark'"
                  @click="setCategory('otherearning')"
                >
                  <i class="bi bi-gift-fill me-1 text-danger"></i> Tips & Heavy
                  <div class="fw-bold">₹{{ currentDayData.tipsAndOther }}</div>
                </button>
              </div>
            </div>
          </div>

          <!-- Category Orders List -->
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
            <h6 class="fw-bold text-dark mb-2 text-capitalize">
              {{ categoryTab }} List (By Order ID)
            </h6>
            
            <div v-for="ord in categoryFilteredOrders" :key="ord.orderId" class="p-2 mb-2 rounded-3 bg-light border d-flex justify-content-between align-items-center">
              <div>
                <span class="fw-bold text-dark">{{ ord.orderNo }}</span>
                <div class="small text-muted">{{ ord.time }} • {{ ord.desc }}</div>
              </div>
              <span class="fw-bold text-success">+ ₹{{ ord.amount }}</span>
            </div>

            <div class="text-center mt-3">
              <router-link to="/earning" class="btn btn-outline-secondary btn-sm rounded-pill px-4">
                <i class="bi bi-arrow-left me-1"></i> Back to All Days
              </router-link>
            </div>
          </div>

        </div>

        <!-- View Mode 3: Main Earnings Dashboard (/earning) -->
        <div v-else>
          
          <!-- Top Current Week Total Earning Card -->
          <div class="card border-0 shadow-sm rounded-4 p-4 text-center bg-white mb-3">
            <div class="small text-muted fw-bold text-uppercase">CURRENT WEEK TOTAL EARNING</div>
            <div class="display-5 fw-bold text-success my-1">₹{{ weekSummary.total }}</div>
            <div class="small text-muted mb-3">{{ weekSummary.deliveries }} Deliveries • Mon 03 Nov to Sun 09 Nov</div>
            
            <div class="row g-2 border-top pt-3">
              <div class="col-4">
                <div class="small text-muted">Orders Pay</div>
                <div class="fw-bold text-dark">₹{{ weekSummary.ordersPay }}</div>
              </div>
              <div class="col-4">
                <div class="small text-muted">Surge & Rain</div>
                <div class="fw-bold text-warning">₹{{ weekSummary.surgeRain }}</div>
              </div>
              <div class="col-4">
                <div class="small text-muted">Tips & Bonus</div>
                <div class="fw-bold text-primary">₹{{ weekSummary.tips }}</div>
              </div>
            </div>
          </div>

          <!-- List of Day Earnings -->
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
            <h6 class="fw-bold text-dark mb-3">Day-by-Day Earnings</h6>

            <div 
              v-for="d in daysList" 
              :key="d.dayKey"
              class="p-3 mb-2 rounded-3 border bg-light d-flex justify-content-between align-items-center cursor-pointer"
              @click="openDayDetail(d.dayKey)"
              style="cursor: pointer;"
            >
              <div>
                <div class="fw-bold text-dark">{{ d.dayName }} ({{ d.date }})</div>
                <div class="small text-muted">{{ d.orders }} orders delivered</div>
              </div>

              <div class="text-end">
                <div class="fw-bold text-success fs-6">₹{{ d.amount }}</div>
                <div class="small text-primary"><i class="bi bi-chevron-right"></i></div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <router-link to="/home" class="bottom-nav-item">
          <i class="bi bi-house-door"></i>
          <span>Home</span>
        </router-link>
        <router-link to="/slot" class="bottom-nav-item">
          <i class="bi bi-calendar-check"></i>
          <span>Slot</span>
        </router-link>
        <router-link to="/earning" class="bottom-nav-item active">
          <i class="bi bi-wallet2"></i>
          <span>Earning</span>
        </router-link>
        <router-link to="/profile" class="bottom-nav-item">
          <i class="bi bi-person-circle"></i>
          <span>Profile</span>
        </router-link>
      </nav>
    </div>
  `,
  data() {
    return {
      selectedWeek: 'current',
      categoryTab: 'orderearning', // 'orderearning' | 'surge' | 'rainearning' | 'otherearning'
      weekSummary: {
        total: '4,890.00',
        deliveries: 62,
        ordersPay: '3,450',
        surgeRain: '890',
        tips: '550'
      },
      daysList: [
        { dayKey: '09-sun', dayName: 'Sunday', date: '09 Nov', orders: 11, amount: '840.00' },
        { dayKey: '08-sat', dayName: 'Saturday', date: '08 Nov', orders: 13, amount: '980.00' },
        { dayKey: '07-fri', dayName: 'Friday', date: '07 Nov', orders: 10, amount: '720.00' },
        { dayKey: '06-thu', dayName: 'Thursday', date: '06 Nov', orders: 8, amount: '590.00' },
        { dayKey: '05-wed', dayName: 'Wednesday', date: '05 Nov', orders: 7, amount: '520.00' },
        { dayKey: '04-tue', dayName: 'Tuesday', date: '04 Nov', orders: 8, amount: '640.00' },
        { dayKey: '03-mon', dayName: 'Monday', date: '03 Nov', orders: 5, amount: '410.00' }
      ],
      currentDayData: {
        total: '840.00',
        orderEarning: '520.00',
        surge: '140.00',
        rain: '100.00',
        tipsAndOther: '80.00'
      },
      weekOrdersList: [
        { orderId: 801, orderNo: 'ORD-801', date: '09 Nov', base: 45, surge: 35, total: 80 },
        { orderId: 800, orderNo: 'ORD-800', date: '09 Nov', base: 50, surge: 25, total: 75 },
        { orderId: 799, orderNo: 'ORD-799', date: '08 Nov', base: 40, surge: 40, total: 80 },
        { orderId: 798, orderNo: 'ORD-798', date: '08 Nov', base: 55, surge: 15, total: 70 },
        { orderId: 797, orderNo: 'ORD-797', date: '07 Nov', base: 45, surge: 20, total: 65 }
      ]
    };
  },
  computed: {
    isHistoryView() {
      return this.$route.path.includes('/earning/history');
    },
    selectedDayKey() {
      return this.$route.params.day || null;
    },
    categoryFilteredOrders() {
      if (this.categoryTab === 'surge') {
        return [
          { orderId: 801, orderNo: 'ORD-801', time: '02:15 PM', desc: 'Evening peak surge 1.4x', amount: '35' },
          { orderId: 800, orderNo: 'ORD-800', time: '12:40 PM', desc: 'Lunch peak surge 1.2x', amount: '25' },
          { orderId: 796, orderNo: 'ORD-796', time: '11:10 AM', desc: 'Demand surge', amount: '80' }
        ];
      }
      if (this.categoryTab === 'rainearning') {
        return [
          { orderId: 801, orderNo: 'ORD-801', time: '02:15 PM', desc: 'Monsoon shower bonus', amount: '50' },
          { orderId: 800, orderNo: 'ORD-800', time: '12:40 PM', desc: 'Rain safety guarantee', amount: '50' }
        ];
      }
      if (this.categoryTab === 'otherearning') {
        return [
          { orderId: 801, orderNo: 'ORD-801', time: '02:15 PM', desc: 'Customer direct app tip', amount: '30' },
          { orderId: 799, orderNo: 'ORD-799', time: '01:05 PM', desc: 'Heavy weight bag allowance (>8kg)', amount: '50' }
        ];
      }
      // default: orderearning
      return [
        { orderId: 801, orderNo: 'ORD-801', time: '02:15 PM', desc: 'Standard dark-store base fee', amount: '45' },
        { orderId: 800, orderNo: 'ORD-800', time: '12:40 PM', desc: 'Long distance delivery fee (3.8km)', amount: '55' },
        { orderId: 799, orderNo: 'ORD-799', time: '10:20 AM', desc: 'Standard base fee', amount: '40' }
      ];
    }
  },
  mounted() {
    this.parseCategory();
  },
  watch: {
    '$route'() {
      this.parseCategory();
    }
  },
  methods: {
    parseCategory() {
      const path = this.$route.path;
      if (path.includes('/surge')) this.categoryTab = 'surge';
      else if (path.includes('/rainearning')) this.categoryTab = 'rainearning';
      else if (path.includes('/otherearning')) this.categoryTab = 'otherearning';
      else if (path.includes('/orderearning')) this.categoryTab = 'orderearning';
    },
    openDayDetail(dayKey) {
      this.$router.push(`/earning/${dayKey}`);
    },
    setCategory(cat) {
      this.categoryTab = cat;
      const day = this.selectedDayKey || '09-sun';
      this.$router.push(`/earning/${day}/${cat}`);
    }
  }
};

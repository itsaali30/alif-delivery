// Profile Ratecard Component - Alif Delivery (/profile/ratecard/*)
const ProfileRatecard = {
  template: `
    <div class="container py-3" style="max-width: 540px;">
      
      <!-- Top Nav -->
      <div class="d-flex align-items-center mb-3">
        <router-link to="/profile" class="btn btn-light btn-sm rounded-circle p-2 me-2">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <h5 class="fw-bold mb-0 text-dark">Ratecard & Incentives</h5>
      </div>

      <!-- Current Week vs Next Week Toggle -->
      <div class="btn-group w-100 mb-3 shadow-sm rounded-4 overflow-hidden p-1 bg-light border">
        <button 
          class="btn rounded-3 fw-bold py-2"
          :class="isCurrentWeek ? 'btn-white bg-white text-success shadow-sm' : 'text-muted'"
          @click="switchWeek('current-week')"
        >
          Current Week (09-15 Nov)
        </button>
        <button 
          class="btn rounded-3 fw-bold py-2"
          :class="!isCurrentWeek ? 'btn-white bg-white text-success shadow-sm' : 'text-muted'"
          @click="switchWeek('next-week')"
        >
          Next Week (16-22 Nov)
        </button>
      </div>

      <!-- Top Nav Showing Week Days (09-Sun, 10-Mon, 11-Tue...) -->
      <div class="d-flex gap-1 overflow-auto py-1 mb-3 no-scrollbar">
        <button 
          v-for="d in daysList" 
          :key="d.key"
          class="btn btn-sm px-3 py-2 rounded-3 text-nowrap fw-semibold d-flex flex-column align-items-center"
          :class="activeDayKey === d.key ? 'btn-success text-white shadow' : 'btn-white bg-white border text-secondary'"
          @click="selectDay(d.key)"
        >
          <span style="font-size: 0.7rem;" class="opacity-75">{{ d.name }}</span>
          <span class="fw-bold fs-6">{{ d.date }}</span>
        </button>
      </div>

      <!-- Target & Incentive Details for Selected Day -->
      <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span class="badge bg-success bg-opacity-10 text-success fw-bold text-uppercase">TARGET TIERS</span>
            <h5 class="fw-bold text-dark mt-1 mb-0">{{ activeDayLabel }} Incentive Plan</h5>
          </div>
          <span class="badge bg-light text-dark border">Base Payout: ₹45 / Order</span>
        </div>

        <div class="p-3 mb-2 rounded-3 bg-light border">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-bold text-dark"><i class="bi bi-award text-secondary me-1"></i> Tier 1 Milestone</span>
            <span class="fw-bold text-success fs-6">+ ₹150 Incentive</span>
          </div>
          <div class="small text-muted">Complete 10 deliveries between 06:00 AM - 11:59 PM</div>
          <div class="progress mt-2" style="height: 6px;">
            <div class="progress-bar bg-success" style="width: 90%;"></div>
          </div>
          <div class="small text-success fw-semibold mt-1">9 / 10 Completed (1 more to unlock!)</div>
        </div>

        <div class="p-3 mb-2 rounded-3 bg-light border">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-bold text-dark"><i class="bi bi-award-fill text-warning me-1"></i> Tier 2 Milestone</span>
            <span class="fw-bold text-success fs-6">+ ₹320 Incentive</span>
          </div>
          <div class="small text-muted">Complete 18 deliveries on {{ activeDayLabel }}</div>
        </div>

        <div class="p-3 mb-2 rounded-3 bg-light border">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-bold text-dark"><i class="bi bi-trophy-fill text-danger me-1"></i> Super Hero Milestone</span>
            <span class="fw-bold text-danger fs-6">+ ₹550 Super Bonus</span>
          </div>
          <div class="small text-muted">Complete 25 deliveries + 95% on-time SLA</div>
        </div>

      </div>

      <!-- Distance & Surge Formula Card -->
      <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
        <h6 class="fw-bold text-dark mb-2">Distance & Special Pay Formula</h6>
        <div class="small text-muted">
          • <strong>0 to 2.5 km:</strong> Base delivery fee ₹45 flat<br>
          • <strong>Above 2.5 km:</strong> + ₹12 per additional km<br>
          • <strong>Rain Surge:</strong> + ₹30 to ₹50 per order during downpour<br>
          • <strong>Late Night (11 PM - 3 AM):</strong> 1.3x Surge Multiplier
        </div>
      </div>

    </div>
  `,
  data() {
    return {
      activeWeek: 'current-week',
      activeDayKey: '09-sun'
    };
  },
  computed: {
    isCurrentWeek() {
      return this.activeWeek === 'current-week';
    },
    daysList() {
      if (this.isCurrentWeek) {
        return [
          { key: '09-sun', name: 'SUN', date: '09' },
          { key: '10-mon', name: 'MON', date: '10' },
          { key: '11-tue', name: 'TUE', date: '11' },
          { key: '12-wed', name: 'WED', date: '12' },
          { key: '13-thu', name: 'THU', date: '13' },
          { key: '14-fri', name: 'FRI', date: '14' },
          { key: '15-sat', name: 'SAT', date: '15' }
        ];
      } else {
        return [
          { key: '16-sun', name: 'SUN', date: '16' },
          { key: '17-mon', name: 'MON', date: '17' },
          { key: '18-tue', name: 'TUE', date: '18' },
          { key: '19-wed', name: 'WED', date: '19' },
          { key: '20-thu', name: 'THU', date: '20' },
          { key: '21-fri', name: 'FRI', date: '21' },
          { key: '22-sat', name: 'SAT', date: '22' }
        ];
      }
    },
    activeDayLabel() {
      const match = this.daysList.find(d => d.key === this.activeDayKey);
      return match ? `${match.name} ${match.date} Nov` : 'Today';
    }
  },
  mounted() {
    this.parseRoute();
  },
  watch: {
    '$route'() {
      this.parseRoute();
    }
  },
  methods: {
    parseRoute() {
      const path = this.$route.path;
      if (path.includes('next-week')) this.activeWeek = 'next-week';
      else this.activeWeek = 'current-week';

      if (this.$route.params.day) {
        this.activeDayKey = this.$route.params.day;
      } else {
        this.activeDayKey = this.isCurrentWeek ? '09-sun' : '16-sun';
      }
    },
    switchWeek(week) {
      this.activeWeek = week;
      this.activeDayKey = week === 'current-week' ? '09-sun' : '16-sun';
      this.$router.push(`/profile/ratecard/${week}`);
    },
    selectDay(key) {
      this.activeDayKey = key;
      this.$router.push(`/profile/ratecard/${this.activeWeek}/${key}`);
    }
  }
};

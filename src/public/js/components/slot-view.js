// Slot Management Component - Alif Delivery (/slot/*)
const SlotView = {
  template: `
    <div class="pb-5">
      <!-- Top Header -->
      <div class="rider-top-bar d-flex justify-content-between align-items-center">
        <h5 class="fw-bold mb-0 text-dark"><i class="bi bi-calendar-range text-success me-1"></i> Shift Slots</h5>
        <router-link to="/slot/slotHistory" class="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1 fw-semibold small">
          <i class="bi bi-clock-history me-1"></i> Slot History
        </router-link>
      </div>

      <div class="container py-3" style="max-width: 540px;">
        
        <!-- Slot History Screen View -->
        <div v-if="isHistoryView">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold mb-0 text-dark">Shift Slot History</h6>
              <select class="form-select form-select-sm w-auto" v-model="selectedHistoryWeek">
                <option value="current">Current Week (09 Nov - 15 Nov)</option>
                <option value="week_minus_1">Last Week (02 Nov - 08 Nov)</option>
                <option value="week_minus_2">2 Weeks Ago (26 Oct - 01 Nov)</option>
                <option value="week_minus_3">3 Weeks Ago (19 Oct - 25 Oct)</option>
              </select>
            </div>

            <!-- Status Filters (Completed, Failed, Cancelled, No-Booked) -->
            <div class="d-flex gap-1 overflow-auto pb-2 mb-3 no-scrollbar">
              <button 
                v-for="st in ['ALL', 'COMPLETED', 'FAILED', 'CANCELLED', 'NO_BOOKED']" 
                :key="st"
                class="btn btn-sm px-3 py-1 rounded-pill text-nowrap fw-semibold"
                :class="historyFilter === st ? 'btn-dark text-white' : 'btn-light text-muted'"
                @click="historyFilter = st"
              >
                {{ st }}
              </button>
            </div>

            <!-- History List -->
            <div v-for="item in filteredHistory" :key="item.id" class="p-3 mb-2 rounded-3 border bg-light">
              <div class="d-flex justify-content-between align-items-start mb-1">
                <div>
                  <div class="fw-bold text-dark">{{ item.date }} • {{ item.timing }}</div>
                  <small class="text-muted">{{ item.store }}</small>
                </div>
                <span class="badge rounded-pill" :class="getStatusBadgeClass(item.status)">{{ item.status }}</span>
              </div>
              <div class="small text-muted mt-1 d-flex justify-content-between">
                <span>Orders: {{ item.orders }}</span>
                <span class="fw-bold text-success">{{ item.earnings }}</span>
              </div>
            </div>

            <div class="mt-3 text-center">
              <router-link to="/slot" class="btn btn-outline-secondary btn-sm rounded-pill px-4">
                <i class="bi bi-arrow-left me-1"></i> Back to Slot Booking
              </router-link>
            </div>
          </div>
        </div>

        <!-- Slot Booking (Current Week / Next Week) -->
        <div v-else>
          <!-- Week Selector Tabs: Current Week vs Next Week -->
          <div class="btn-group w-100 mb-3 shadow-sm rounded-4 overflow-hidden p-1 bg-light border">
            <button 
              class="btn rounded-3 fw-bold py-2"
              :class="weekType === 'current-week' ? 'btn-white bg-white text-success shadow-sm' : 'text-muted'"
              @click="setWeekType('current-week')"
            >
              Current Week (09-15 Nov)
            </button>
            <button 
              class="btn rounded-3 fw-bold py-2"
              :class="weekType === 'next-week' ? 'btn-white bg-white text-success shadow-sm' : 'text-muted'"
              @click="setWeekType('next-week')"
            >
              Next Week (16-22 Nov)
            </button>
          </div>

          <!-- Days Navigation Bar (09-Sun, 10-Mon...) -->
          <div class="d-flex gap-1 overflow-auto py-1 mb-3 no-scrollbar">
            <button 
              v-for="d in activeDaysList" 
              :key="d.key"
              class="btn btn-sm px-3 py-2 rounded-3 text-nowrap fw-semibold d-flex flex-column align-items-center"
              :class="activeDay === d.key ? 'btn-success text-white shadow' : 'btn-white bg-white border text-secondary'"
              @click="setDay(d.key)"
            >
              <span style="font-size: 0.7rem;" class="opacity-75">{{ d.name }}</span>
              <span class="fw-bold fs-6">{{ d.date }}</span>
            </button>
          </div>

          <!-- Filter Sub-Tabs: All / Booked / Available -->
          <div class="d-flex gap-2 mb-3">
            <button 
              class="btn btn-sm px-3 rounded-pill fw-semibold"
              :class="subFilter === 'all' ? 'btn-dark' : 'btn-light border'"
              @click="setSubFilter('all')"
            >
              All Slots ({{ daySlots.length }})
            </button>
            <button 
              class="btn btn-sm px-3 rounded-pill fw-semibold"
              :class="subFilter === 'booked' ? 'btn-success text-white' : 'btn-light border'"
              @click="setSubFilter('booked')"
            >
              Booked ({{ bookedCount }})
            </button>
            <button 
              class="btn btn-sm px-3 rounded-pill fw-semibold"
              :class="subFilter === 'available' ? 'btn-primary text-white' : 'btn-light border'"
              @click="setSubFilter('available')"
            >
              Available ({{ availableCount }})
            </button>
          </div>

          <!-- Slots List -->
          <div v-for="slot in filteredSlots" :key="slot.id" class="card border-0 shadow-sm rounded-4 p-3 mb-2 bg-white">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="fw-bold text-dark fs-6">
                  <i class="bi bi-clock me-1 text-primary"></i> {{ slot.time }}
                </div>
                <div class="small text-muted">{{ slot.hours }} Hours Shift • Min Guarantee: {{ slot.minGuarantee }}</div>
              </div>

              <div>
                <button 
                  v-if="slot.isBooked"
                  class="btn btn-outline-danger btn-sm px-3 rounded-pill fw-bold"
                  @click="cancelSlot(slot)"
                >
                  <i class="bi bi-check-circle-fill text-success me-1"></i> Booked (Cancel)
                </button>
                <button 
                  v-else
                  class="btn btn-success btn-sm px-3 rounded-pill fw-bold shadow-sm"
                  @click="bookSlot(slot)"
                >
                  + Book Slot
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- Bottom Nav -->
      <nav class="bottom-nav">
        <router-link to="/home" class="bottom-nav-item">
          <i class="bi bi-house-door"></i>
          <span>Home</span>
        </router-link>
        <router-link to="/slot" class="bottom-nav-item active">
          <i class="bi bi-calendar-check-fill"></i>
          <span>Slot</span>
        </router-link>
        <router-link to="/earning" class="bottom-nav-item">
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
      weekType: 'current-week', // 'current-week' | 'next-week'
      activeDay: '09-sun',
      subFilter: 'all', // 'all' | 'booked' | 'available'
      historyFilter: 'ALL',
      selectedHistoryWeek: 'current',
      slotsData: {
        '09-sun': [
          { id: 1, time: '06:00 AM - 10:00 AM', hours: 4, minGuarantee: '₹350', isBooked: true },
          { id: 2, time: '10:00 AM - 02:00 PM', hours: 4, minGuarantee: '₹400', isBooked: true },
          { id: 3, time: '02:00 PM - 06:00 PM', hours: 4, minGuarantee: '₹350', isBooked: false },
          { id: 4, time: '06:00 PM - 11:00 PM', hours: 5, minGuarantee: '₹550 (Peak)', isBooked: false },
          { id: 5, time: '11:00 PM - 03:00 AM', hours: 4, minGuarantee: '₹500 (Late Night)', isBooked: false }
        ],
        '10-mon': [
          { id: 6, time: '06:00 AM - 10:00 AM', hours: 4, minGuarantee: '₹320', isBooked: true },
          { id: 7, time: '10:00 AM - 02:00 PM', hours: 4, minGuarantee: '₹380', isBooked: false },
          { id: 8, time: '06:00 PM - 11:00 PM', hours: 5, minGuarantee: '₹500', isBooked: false }
        ]
      },
      historyList: [
        { id: 101, date: '08 Nov (Sat)', timing: '06:00 PM - 11:00 PM', store: 'Alif Dark Store #1', status: 'COMPLETED', orders: 12, earnings: '₹840' },
        { id: 102, date: '07 Nov (Fri)', timing: '10:00 AM - 02:00 PM', store: 'Alif Dark Store #1', status: 'COMPLETED', orders: 9, earnings: '₹580' },
        { id: 103, date: '06 Nov (Thu)', timing: '06:00 PM - 11:00 PM', store: 'Alif Dark Store #1', status: 'CANCELLED', orders: 0, earnings: '₹0' },
        { id: 104, date: '05 Nov (Wed)', timing: '06:00 AM - 10:00 AM', store: 'Alif Dark Store #1', status: 'FAILED', orders: 2, earnings: '₹140' }
      ]
    };
  },
  computed: {
    isHistoryView() {
      return this.$route.path.includes('/slotHistory');
    },
    activeDaysList() {
      if (this.weekType === 'current-week') {
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
    daySlots() {
      return this.slotsData[this.activeDay] || [
        { id: 10, time: '06:00 AM - 10:00 AM', hours: 4, minGuarantee: '₹350', isBooked: false },
        { id: 11, time: '10:00 AM - 02:00 PM', hours: 4, minGuarantee: '₹400', isBooked: false },
        { id: 12, time: '06:00 PM - 11:00 PM', hours: 5, minGuarantee: '₹520', isBooked: false }
      ];
    },
    bookedCount() {
      return this.daySlots.filter(s => s.isBooked).length;
    },
    availableCount() {
      return this.daySlots.filter(s => !s.isBooked).length;
    },
    filteredSlots() {
      if (this.subFilter === 'booked') return this.daySlots.filter(s => s.isBooked);
      if (this.subFilter === 'available') return this.daySlots.filter(s => !s.isBooked);
      return this.daySlots;
    },
    filteredHistory() {
      if (this.historyFilter === 'ALL') return this.historyList;
      return this.historyList.filter(h => h.status === this.historyFilter);
    }
  },
  mounted() {
    this.parseRouteParams();
  },
  watch: {
    '$route'() {
      this.parseRouteParams();
    }
  },
  methods: {
    parseRouteParams() {
      const path = this.$route.path;
      if (path.includes('next-week')) this.weekType = 'next-week';
      else this.weekType = 'current-week';

      if (path.includes('/booked')) this.subFilter = 'booked';
      else if (path.includes('/available')) this.subFilter = 'available';
      else this.subFilter = 'all';

      if (this.$route.params.day) {
        this.activeDay = this.$route.params.day;
      }
    },
    setWeekType(type) {
      this.weekType = type;
      this.activeDay = type === 'current-week' ? '09-sun' : '16-sun';
      this.$router.push(`/slot/${type}`);
    },
    setDay(dayKey) {
      this.activeDay = dayKey;
      this.$router.push(`/slot/${this.weekType}/${dayKey}/${this.subFilter}`);
    },
    setSubFilter(sf) {
      this.subFilter = sf;
      this.$router.push(`/slot/${this.weekType}/${this.activeDay}/${sf}`);
    },
    bookSlot(slot) {
      slot.isBooked = true;
      alert(`Slot booked successfully for ${slot.time}!`);
    },
    cancelSlot(slot) {
      if (confirm(`Cancel your booking for ${slot.time}?`)) {
        slot.isBooked = false;
      }
    },
    getStatusBadgeClass(status) {
      const map = {
        'COMPLETED': 'bg-success text-white',
        'FAILED': 'bg-danger text-white',
        'CANCELLED': 'bg-secondary text-white',
        'NO_BOOKED': 'bg-warning text-dark'
      };
      return map[status] || 'bg-light text-dark';
    }
  }
};

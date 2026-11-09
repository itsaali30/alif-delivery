// Main Vue 3 Application Instance - Alif Delivery
const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      isLoggedIn: !!localStorage.getItem('alif_rider_token'),
      isOnline: true,
      rider: {
        riderId: 101,
        name: 'Mohammed Imran',
        phone: '9876543210',
        storeId: 1,
        storeName: 'Alif Dark Store - Dabeerpura (Store #1)',
        rating: 4.85,
        vehicleType: 'Motorcycle'
      }
    };
  },
  async mounted() {
    if (this.isLoggedIn) {
      try {
        const res = await API.getMe();
        if (res.rider) {
          this.rider = res.rider;
          this.isOnline = res.rider.isDutyOnline;
          SocketClient.init(this.rider.riderId, this.rider.storeId);
        }
      } catch (e) {
        console.warn('Auto auth check warning:', e.message);
      }
    }
  }
});

app.use(router);
app.mount('#app');

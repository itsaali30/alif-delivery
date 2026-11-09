// Vue Router 4 Configuration - Alif Delivery
const routes = [
  { path: '/', redirect: '/home' },
  { path: '/signup', component: AuthSignup },
  { path: '/login', component: AuthLogin },
  { path: '/forget', component: AuthForget },
  { path: '/home', component: HomeView },

  // Order Lifecycle Routes
  { path: '/order/:id', component: OrderView },
  { path: '/order/:id/status', component: OrderStatus },
  { path: '/order/:id/roc/:rocid', component: OrderBinPickup },
  { path: '/order/:id/completed', component: OrderCompleted },

  // Slot Management Routes
  { path: '/slot', component: SlotView },
  { path: '/slot/current-week', component: SlotView },
  { path: '/slot/current-week/:day/booked', component: SlotView },
  { path: '/slot/current-week/:day/available', component: SlotView },
  { path: '/slot/next-week', component: SlotView },
  { path: '/slot/next-week/:day/booked', component: SlotView },
  { path: '/slot/next-week/:day/available', component: SlotView },
  { path: '/slot/slotHistory', component: SlotView },

  // Earning Routes
  { path: '/earning', component: EarningView },
  { path: '/earning/history', component: EarningView },
  { path: '/earning/:day', component: EarningView },
  { path: '/earning/:day/orderearning', component: EarningView },
  { path: '/earning/:day/surge', component: EarningView },
  { path: '/earning/:day/rainearning', component: EarningView },
  { path: '/earning/:day/otherearning', component: EarningView },

  // Profile Routes
  { path: '/profile', component: ProfileView },
  { path: '/profile/store', component: ProfileStore },
  { path: '/profile/store/change-store', component: ProfileStore },
  { path: '/profile/ratecard', component: ProfileRatecard },
  { path: '/profile/ratecard/current-week', component: ProfileRatecard },
  { path: '/profile/ratecard/current-week/:day', component: ProfileRatecard },
  { path: '/profile/ratecard/next-week', component: ProfileRatecard },
  { path: '/profile/ratecard/next-week/:day', component: ProfileRatecard },
  { path: '/profile/star', component: ProfileStar },
  { path: '/profile/orderHistiry', component: ProfileOrderHistory },
  { path: '/profile/orderHistiry/:id', component: ProfileOrderHistory },
  { path: '/profile/orderHistiry/:id/ccb', component: ProfileOrderHistory },
  { path: '/profile/cashbalance', component: ProfileCashBalance },
  { path: '/profile/cashbalance/deposit', component: ProfileCashBalance },
  { path: '/profile/cashbalance/deposit/DTS', component: ProfileCashBalance },
  { path: '/profile/cashbalance/past', component: ProfileCashBalance },
  { path: '/profile/insurancecard', component: ProfileInsurance },
  { path: '/profile/training', component: ProfileTraining },
  { path: '/profile/Documents', component: ProfileDocuments },
  { path: '/profile/Documents/bank', component: ProfileDocuments },
  { path: '/profile/Documents/nomie', component: ProfileDocuments }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

// Navigation Guard: check login status for protected routes
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/signup', '/forget'];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem('alif_rider_token');

  if (authRequired && !token) {
    return next('/login');
  }
  next();
});

// Profile Training Component - Alif Delivery (/profile/training)
const ProfileTraining = {
  template: `
    <div class="container py-3" style="max-width: 540px;">
      
      <!-- Top Nav -->
      <div class="d-flex align-items-center mb-3">
        <router-link to="/profile" class="btn btn-light btn-sm rounded-circle p-2 me-2">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <h5 class="fw-bold mb-0 text-dark">Rider Academy & Training</h5>
      </div>

      <!-- Training Progress Banner -->
      <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="small fw-bold text-muted">COMPLETION STATUS</span>
          <span class="fw-bold text-success">3 of 4 Completed (75%)</span>
        </div>
        <div class="progress" style="height: 8px;">
          <div class="progress-bar bg-success" style="width: 75%;"></div>
        </div>
      </div>

      <!-- List of Training Videos -->
      <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
        <h6 class="fw-bold text-dark mb-3">Required & Safety Video Modules</h6>

        <div v-for="vid in videos" :key="vid.id" class="p-3 mb-3 rounded-4 border bg-light">
          <div class="d-flex align-items-start mb-2">
            <div class="position-relative me-3 flex-shrink-0">
              <img :src="vid.thumbnail" class="rounded-3" width="90" height="60" style="object-fit: cover;">
              <span class="position-absolute bottom-0 end-0 bg-dark text-white px-1 rounded small" style="font-size: 0.65rem;">{{ vid.duration }}</span>
            </div>
            <div class="flex-grow-1">
              <h6 class="fw-bold text-dark mb-1">{{ vid.title }}</h6>
              <div class="small text-muted mb-1">{{ vid.desc }}</div>
              <span class="badge" :class="vid.completed ? 'bg-success' : 'bg-warning text-dark'">
                {{ vid.completed ? 'COMPLETED' : 'PENDING' }}
              </span>
            </div>
          </div>

          <button class="btn btn-sm w-100 rounded-pill fw-semibold mt-1" :class="vid.completed ? 'btn-outline-secondary' : 'btn-success'" @click="openVideo(vid)">
            <i class="bi" :class="vid.completed ? 'bi-arrow-clockwise' : 'bi-play-circle-fill'"></i>
            {{ vid.completed ? 'Re-watch Video' : 'Watch Training Video' }}
          </button>
        </div>
      </div>

      <!-- Video Player Modal -->
      <div v-if="selectedVideo" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.8);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-4 border-0">
            <div class="modal-header border-0 pb-0">
              <h6 class="modal-title fw-bold">{{ selectedVideo.title }}</h6>
              <button type="button" class="btn-close" @click="selectedVideo = null"></button>
            </div>
            <div class="modal-body text-center">
              <div class="bg-dark rounded-3 p-5 text-white my-2">
                <i class="bi bi-play-circle fs-1 text-success d-block mb-2"></i>
                <div class="fw-bold">{{ selectedVideo.title }}</div>
                <div class="small text-white-50">Video streaming simulated via MinIO / Cloud CDN</div>
              </div>
              <button class="btn btn-success w-100 py-2 rounded-pill fw-bold mt-2" @click="markComplete">
                <i class="bi bi-check-circle me-1"></i> Mark as Completed
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  data() {
    return {
      selectedVideo: null,
      videos: [
        {
          id: 1,
          title: 'Dark Store Bin Pickup & Staging SOP',
          duration: '3:45',
          desc: 'How to scan assigned Bin IDs, check item safety & bag packages.',
          thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&auto=format&fit=crop&q=60',
          completed: true
        },
        {
          id: 2,
          title: 'Customer Doorstep & Cash Handover (COD)',
          duration: '4:15',
          desc: 'OTP verification, polite customer communication, handling change.',
          thumbnail: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=200&auto=format&fit=crop&q=60',
          completed: true
        },
        {
          id: 3,
          title: 'Road Safety & Monsoon Riding Guidelines',
          duration: '5:20',
          desc: 'Helmet rules, maintaining speed limits, safe wet weather braking.',
          thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200&auto=format&fit=crop&q=60',
          completed: true
        },
        {
          id: 4,
          title: 'Manager Cash Deposit (DTS) & Settlement',
          duration: '2:50',
          desc: 'End of shift procedure for cash deposit with Incharge QR code.',
          thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=60',
          completed: false
        }
      ]
    };
  },
  methods: {
    openVideo(v) {
      this.selectedVideo = v;
    },
    markComplete() {
      if (this.selectedVideo) {
        this.selectedVideo.completed = true;
        this.selectedVideo = null;
      }
    }
  }
};

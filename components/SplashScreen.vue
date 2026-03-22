<template>
  <transition name="splash-fade">
    <div v-if="visible" class="splash-screen" aria-hidden="true" role="presentation">
      <svg class="splash-logo" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 20,110 L 20,20 L 80,110 L 80,20"
          stroke="#205295"
          stroke-width="10"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="splash-path"
        />
      </svg>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return { visible: false }
  },
  mounted() {
    if (typeof sessionStorage === 'undefined') return
    if (sessionStorage.getItem('splashShown')) return

    sessionStorage.setItem('splashShown', '1')
    this.visible = true

    setTimeout(() => {
      this.visible = false
    }, 2200)
  }
}
</script>

<style scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #18191a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.splash-logo {
  width: 80px;
  height: 104px;
}

.splash-path {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: draw-n 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes draw-n {
  to {
    stroke-dashoffset: 0;
  }
}

.splash-fade-leave-active {
  transition: opacity 0.6s ease;
}

.splash-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .splash-path {
    animation: none;
    stroke-dashoffset: 0;
  }

  .splash-fade-leave-active {
    transition: none;
  }
}
</style>

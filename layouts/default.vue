<template>
  <div>
    <SplashScreen />
    <MagneticCursor />

    <!-- Scroll progress bar -->
    <div
      class="scroll-progress-bar"
      :style="{ width: scrollProgress + '%' }"
      aria-hidden="true"
    />

    <TheNavBar />
    <Nuxt />
    <TheFooter />
  </div>
</template>

<script>
export default {
  data() {
    return { scrollProgress: 0 }
  },

  mounted() {
    this._rafPending = false
    this._onScroll = () => {
      if (this._rafPending) return
      this._rafPending = true
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        this.scrollProgress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
        this._rafPending = false
      })
    }
    window.addEventListener('scroll', this._onScroll, { passive: true })
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this._onScroll)
  }
}
</script>

<style>
html {
  @apply bg-white font-sans;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

::-moz-selection {
  @apply bg-hot-pink text-white;
}

::selection {
  @apply bg-hot-pink text-white;
}

/* Scroll progress bar */
.scroll-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: #205295;
  z-index: 9998;
  pointer-events: none;
  transition: width 0.05s linear;
  will-change: width;
}

/* Page-transition styles must be global */
/* page is used by default */
.page-leave-active,
.page-enter-active {
  transition: opacity 0.3s;
}

.page-enter,
.page-leave-to {
  opacity: 0;
}

/* slide-right */
.slide-right-leave-active,
.slide-right-enter-active {
  transition: all 0.3s;
}

.slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
}

.slide-right-enter-to,
.slide-right-leave {
  opacity: 1;
  transform: translate(0, 0);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translate(30px, 0);
}

/* slide-left */
.slide-left-leave-active,
.slide-left-enter-active {
  transition: all 0.3s;
}

.slide-left-enter {
  opacity: 0;
  transform: translate(30px, 0);
}

.slide-left-enter-to,
.slide-left-leave {
  opacity: 1;
  transform: translate(0, 0);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translate(-30px, 0);
}

/* swipe-right */
.swipe-right-leave-active,
.swipe-right-enter-active {
  transition: all 0.3s;
}

.swipe-right-enter {
  opacity: 0;
  transform: translate(-100%, 0);
}

.swipe-right-enter-to,
.swipe-right-leave {
  opacity: 1;
  transform: translate(0, 0);
}

.swipe-right-leave-to {
  opacity: 0;
  transform: translate(100%, 0);
}

/* jump */
.jump-leave-active,
.jump-enter-active {
  transition: all 0.3s;
}

.jump-enter {
  opacity: 0;
  transform: rotate(-12deg);
}

.jump-enter-to,
.jump-leave {
  opacity: 1;
  transform: rotate(0deg);
}

.jump-leave-to {
  opacity: 0;
  transform: rotate(12deg);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-progress-bar {
    transition: none;
  }
}
</style>

<template>
  <div v-if="active" aria-hidden="true">
    <div ref="dot" class="cursor-dot" />
    <div ref="ring" class="cursor-ring" :class="{ 'cursor-ring--hover': isHovering, 'cursor-ring--hidden': !isVisible }" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: false,
      isHovering: false,
      isVisible: false,
      mX: 0,
      mY: 0,
      rX: 0,
      rY: 0
    }
  },

  mounted() {
    if (typeof window === 'undefined') return

    // Only activate on pointer-fine (mouse) devices
    if (!window.matchMedia('(pointer: fine)').matches) return
    // Skip on touch-capable devices that also have a mouse (rare edge case)
    if (window.matchMedia('(hover: none)').matches) return

    this.active = true
    document.documentElement.classList.add('custom-cursor-active')

    this._onMove = (e) => {
      this.mX = e.clientX
      this.mY = e.clientY

      if (this.$refs.dot) {
        this.$refs.dot.style.transform = `translate3d(${this.mX}px, ${this.mY}px, 0) translate(-50%, -50%)`
      }

      if (!this.isVisible) this.isVisible = true
    }

    this._onEnter = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
        this.isHovering = true
      }
    }

    this._onLeave = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
        this.isHovering = false
      }
    }

    this._onDocLeave = () => { this.isVisible = false }
    this._onDocEnter = () => { this.isVisible = true }

    document.addEventListener('mousemove', this._onMove, { passive: true })
    document.addEventListener('mouseover', this._onEnter, { passive: true })
    document.addEventListener('mouseout', this._onLeave, { passive: true })
    document.addEventListener('mouseleave', this._onDocLeave, { passive: true })
    document.addEventListener('mouseenter', this._onDocEnter, { passive: true })

    this._rafId = requestAnimationFrame(this._tick)
  },

  beforeDestroy() {
    if (!this.active) return

    document.documentElement.classList.remove('custom-cursor-active')
    document.removeEventListener('mousemove', this._onMove)
    document.removeEventListener('mouseover', this._onEnter)
    document.removeEventListener('mouseout', this._onLeave)
    document.removeEventListener('mouseleave', this._onDocLeave)
    document.removeEventListener('mouseenter', this._onDocEnter)

    if (this._rafId) cancelAnimationFrame(this._rafId)
  },

  methods: {
    _tick() {
      // Lerp ring toward mouse
      this.rX += (this.mX - this.rX) * 0.11
      this.rY += (this.mY - this.rY) * 0.11

      if (this.$refs.ring) {
        this.$refs.ring.style.transform = `translate3d(${this.rX}px, ${this.rY}px, 0) translate(-50%, -50%)`
      }

      this._rafId = requestAnimationFrame(this._tick)
    }
  }
}
</script>

<style scoped>
.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  background: #205295;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  will-change: transform;
}

.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  width: 38px;
  height: 38px;
  border: 2px solid #205295;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  will-change: transform;
  transition: width 0.2s ease, height 0.2s ease, opacity 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  opacity: 0.6;
}

.cursor-ring--hover {
  width: 52px;
  height: 52px;
  border-color: #fd2d78;
  background: rgba(253, 45, 120, 0.08);
  opacity: 1;
}

.cursor-ring--hidden {
  opacity: 0;
}
</style>

<!-- Global: hide default cursor when our cursor is active -->
<style>
.custom-cursor-active,
.custom-cursor-active * {
  cursor: none !important;
}
</style>

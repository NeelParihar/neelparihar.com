<template>
  <component :is="tag" v-bind="$attrs" v-on="$listeners" ref="el">{{ displayText }}</component>
</template>

<script>
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'

export default {
  inheritAttrs: false,

  props: {
    text: { type: String, required: true },
    tag: { type: String, default: 'span' },
    frames: { type: Number, default: 22 },
    interval: { type: Number, default: 38 }
  },

  data() {
    return { displayText: this.text }
  },

  watch: {
    text(val) {
      this.displayText = val
    }
  },

  mounted() {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this._startScramble()
            observer.unobserve(this.$refs.el)
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(this.$refs.el)
    this._observer = observer
  },

  beforeDestroy() {
    if (this._observer) this._observer.disconnect()
    if (this._interval) clearInterval(this._interval)
  },

  methods: {
    _startScramble() {
      const text = this.text
      let frame = 0
      const total = this.frames

      this._interval = setInterval(() => {
        this.displayText = text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < Math.floor((frame / total) * text.length)) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')

        frame++
        if (frame > total) {
          this.displayText = text
          clearInterval(this._interval)
        }
      }, this.interval)
    }
  }
}
</script>

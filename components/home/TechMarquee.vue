<template>
  <div class="tech-marquee-section border-b border-dashed border-gray-200">
    <div class="max-w-7xl mx-auto border-l border-r border-dashed border-gray-200 py-6 px-4">
      <p class="text-xs leading-6 text-primary font-semibold tracking-wide lowercase text-center mb-5">
        tools &amp; technologies
      </p>
    </div>

    <div class="marquee-outer" aria-label="Tech stack marquee" aria-hidden="true">
      <div class="marquee-track">
        <div class="marquee-inner" :class="{ 'marquee-inner--paused': isPaused }">
          <span
            v-for="(tech, i) in [...techs, ...techs]"
            :key="`tech-${i}`"
            class="tech-pill"
            :style="{ '--pill-color': tech.color }"
          >
            <span class="tech-dot" />
            {{ tech.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPaused: false,
      techs: [
        { name: 'Vue.js', color: '#42b883' },
        { name: 'Nuxt.js', color: '#00dc82' },
        { name: 'React', color: '#61dafb' },
        { name: 'TypeScript', color: '#3178c6' },
        { name: 'TailwindCSS', color: '#38bdf8' },
        { name: 'Firebase', color: '#ffca28' },
        { name: 'Node.js', color: '#68a063' },
        { name: 'Python', color: '#3776ab' },
        { name: 'GraphQL', color: '#e535ab' },
        { name: 'Docker', color: '#2496ed' },
        { name: 'PostgreSQL', color: '#4169e1' },
        { name: 'AWS', color: '#ff9900' },
        { name: 'Git', color: '#f05032' },
        { name: 'Figma', color: '#f24e1e' },
        { name: 'JavaScript', color: '#f7df1e' },
        { name: 'REST APIs', color: '#6366f1' },
      ]
    }
  },
  methods: {
    pause() { this.isPaused = true },
    resume() { this.isPaused = false }
  }
}
</script>

<style scoped>
.tech-marquee-section {
  overflow: hidden;
}

.marquee-outer {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
  mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
  padding: 8px 0 16px;
}

.marquee-track {
  display: flex;
}

.marquee-inner {
  display: flex;
  gap: 12px;
  width: max-content;
  animation: marquee 32s linear infinite;
  padding: 0 6px;
  will-change: transform;
}

.marquee-inner--paused {
  animation-play-state: paused;
}

.marquee-outer:hover .marquee-inner {
  animation-play-state: paused;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.tech-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  color: var(--pill-color);
  border: 1px solid var(--pill-color);
  background: color-mix(in srgb, var(--pill-color) 8%, transparent);
  letter-spacing: 0.02em;
  cursor: default;
  transition: background 0.2s ease, transform 0.2s ease;
}

.tech-pill:hover {
  background: color-mix(in srgb, var(--pill-color) 18%, transparent);
  transform: translateY(-2px);
}

.tech-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--pill-color);
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .marquee-inner {
    animation: none;
  }

  .marquee-outer {
    overflow-x: auto;
    -webkit-mask-image: none;
    mask-image: none;
  }

  .marquee-inner {
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 16px;
  }
}
</style>

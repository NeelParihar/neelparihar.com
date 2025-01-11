<template>
  <div class="relative bg-white overflow-hidden">
    <div class="relative">
      <main class="">
        <div class="mx-auto py-8 max-w-7xl border-l border-r border-dashed border-gray-200">
          <div data-aos="zoom-in" class="lg:grid lg:grid-cols-12">
            <div
              class="px-4 sm:px-6 lg:border-r lg:border-dashed lg:border-gray-200 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
              <div>
                <nuxt-link v-if="$config.blog.enabled" :to="localePath('/blog')"
                  class="group inline-flex hover:bg-black items-center text-white bg-gray-900 rounded-full p-0.5 pr-2 sm:text-base lg:text-sm xl:text-base hover:text-gray-200">
                  <span
                    class="px-3 py-0.5 text-white text-xs font-semibold leading-5 tracking-wide bg-primary rounded-full">{{
                      $t('hero.iBlogTech')
                    }}</span>
                  <span class="ml-4 text-xs">{{ $t('hero.haveALook') }}</span>
                  <svg
                    class="transition duration-500 transform block group-hover:rotate-180 hover-arrow ml-2 w-5 h-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                </nuxt-link>
                <h1
                  class="mt-4 text-3xl tracking-tight font-extrabold text-gray-800 sm:mt-5 sm:leading-none lg:mt-6 lg:text-3xl xl:text-3xl">
                 {{ $t('hero.friendlyNeighborhood') }}
                  
                </h1>
                <p class="mt-3 text-base text-gray-300 sm:mt-5">
                  {{ $t('hero.description') }}
                </p>
                <p v-if="$config.workedAt.enabled"
                  class="mt-8 text-sm text-gray lowercase tracking-wide font-semibold sm:mt-10">Worked for</p>
                <div v-if="$config.workedAt.enabled" class="mt-5 w-full sm:mx-auto lg:ml-0">
                  <div class="flex flex-wrap space-x-1 items-start items-center space-x-4 md:space-x-8">
                    <div v-for="(firm, index) in $config.workedAt.meta" :key="index">
                      <a :href="firm.url" target="_blank" rel="noreferrer" class="flex items-center justify-center">
                        <img :src="firm.src" class="h-8 rounded-sm sm:h-10" :alt="firm.name" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-8 px-5 sm:mt-16 lg:mt-0 lg:col-span-6">
              <div
                class="flex-shrink-0 w-full sm:mx-auto flex flex-1 items-center justify-center rounded-lg sm:overflow-hidden"
                style="position:relative" id="imageAvatar">
                <img class="rounded-md h-80" :src="$config.image" :alt="$config.name" />
                <div class="eye-patch" style="left: 254px; top: 118px;"> </div>
                <div class="eye-patch" style="left: 322px; top: 118px;"></div>
                <img class="eye" style="left: 262px; top: 116px;" src="/images/eye2.png" alt="eye1" />
                <img class="eye" style="left: 322px; top: 116px;" src="/images/eye2.png" alt="eye1" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.eye {
  position: absolute;
  width: 16px;
}

.eye-patch {
  position: absolute;
  width: 30px;
  height: 20px;
  background: #ffdbb4;
}

@media (max-width: 1278px) {
  .eye {
    display: none;
  }

  .eye-patch {
    display: none;
  }
}
</style>

<script>
export default {

  mounted() {
    const main = document.getElementById("imageAvatar");

    const rekt = main.getBoundingClientRect();

    const mainX = rekt.left + rekt.width / 2;
    const mainY = rekt.top + rekt.height / 2;

    document.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX
      const mouseY = e.clientY

      const deg = this.getRotateAngle(mouseX, mouseY, mainX, mainY);

      const eyes = document.querySelectorAll(".eye");

      eyes.forEach((eye) => {
        eye.style.transform = `rotate(${90 + deg}deg)`;
      })
    })
  },
  data() {
    return {

    }
  },
  methods: {
    getRotateAngle(cx, cy, ex, ey) {
      const dy = ey - cy;
      const dx = ex - cx;
      const rad = Math.atan2(dy, dx);
      const deg = rad * 180 / Math.PI;
      return deg;
    }
  }
}
</script>

<style scoped>
>>>.vue-typer .custom.char {
  @apply text-primary;
}

>>>.vue-typer .custom.char.selected {
  @apply bg-primary text-white;
}

>>>.vue-typer .custom.caret {
  width: 5px;
  @apply bg-primary;
}

.hover-arrow {
  position: relative;
  stroke-width: 1px;
}
</style>

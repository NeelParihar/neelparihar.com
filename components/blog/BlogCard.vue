<template>
  <nuxt-link :to="localePath(`/blog/${post.slug}`)" class="flex transition duration-700 ease-in-out transform hover:translate-y-0.5 hover:scale-105 flex-col rounded-xl shadow-md border border-gray-100 overflow-hidden">
    <!-- Cover image or gradient fallback -->
    <div class="hidden sm:block flex-shrink-0 h-36 relative overflow-hidden bg-gray-100">
      <img
        v-if="post.image"
        class="h-full w-full object-cover"
        :src="post.image"
        :alt="post.title"
        loading="lazy"
      />
      <div
        v-else
        class="h-full w-full flex items-end p-4"
        :style="{ background: gradientFor(post.category) }"
      >
        <span class="text-xs font-semibold uppercase tracking-widest text-white opacity-70">{{ post.category }}</span>
      </div>
    </div>

    <div class="flex-1 bg-white p-5 flex flex-col justify-between">
      <div class="flex-1">
        <p class="text-xs font-medium text-hot-pink">
          {{ post.category }}
        </p>
        <div>
          <h3 class="mt-0.5 text-md leading-7 font-semibold text-gray-800">
            {{ post.title }}
          </h3>
          <p class="mt-2 text-xs text-gray-500 line-clamp-2">
            {{ post.description }}
          </p>
        </div>
      </div>
      <div class="mt-3 flex items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UserAvatar class="h-8 w-8 rounded-full" :name="post.author.name" :photo-u-r-l="post.author.image" />
          </div>
          <div class="ml-2">
            <p class="text-xs font-medium text-gray-700">{{ post.author.name }}</p>
            <div class="flex text-xs text-gray-600">
              <time :datetime="post.createdAt">
                {{ new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}
              </time>
            </div>
          </div>
        </div>
        <span class="text-xs text-gray-500">{{ post.readingTime }}</span>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
const CATEGORY_GRADIENTS = {
  frontend:   'linear-gradient(135deg, #205295 0%, #1a3a6b 100%)',
  vue:        'linear-gradient(135deg, #42b883 0%, #2d8a5e 100%)',
  react:      'linear-gradient(135deg, #61dafb 0%, #1a8fa8 100%)',
  javascript: 'linear-gradient(135deg, #f7df1e 0%, #b8a000 100%)',
  css:        'linear-gradient(135deg, #264de4 0%, #1a34a8 100%)',
  dev:        'linear-gradient(135deg, #fd2d78 0%, #b01e55 100%)',
  interview:  'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
  default:    'linear-gradient(135deg, #2F3133 0%, #18191a 100%)',
}

export default {
  props: {
    post: { type: Object, required: true }
  },
  methods: {
    gradientFor(category) {
      return CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.default
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

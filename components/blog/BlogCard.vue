<template>
  <nuxt-link :to="localePath(`/blog/${post.slug}`)" class="flex transition duration-700 ease-in-out transform hover:translate-y-0.5 hover:scale-105 flex-col rounded-xl shadow-md border border-gray-100 overflow-hidden">
    <!-- Cover image (only shown when post has one) -->
    <div v-if="post.image" class="hidden sm:block flex-shrink-0 h-36 relative overflow-hidden bg-gray-100">
      <img
        class="h-full w-full object-cover"
        :src="post.image"
        :alt="post.title"
        loading="lazy"
      />
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
export default {
  props: {
    post: { type: Object, required: true }
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

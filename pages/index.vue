<template>
  <div>
    <HeroSection />
    <GithubCalendar v-if="$config.social.github" />
    <Recommendations v-if="$config.recommendations.enabled" />
    <LazyRecentBlog v-if="$config.blog.enabled && posts" :posts="posts" />
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `home - ${this.$config.name}`,
    }
  },
  async asyncData({ $content, $config }) {
    if (!$config.blog.enabled) return { posts: null }
    try {
      const posts = await $content('posts')
        .without(['body', 'toc', 'dir', 'extension', 'path', 'tags'])
        .limit(3)
        .skip(0)
        .sortBy('createdAt', 'desc')
        .fetch()
      return { posts }
    } catch (e) {
      return { posts: null }
    }
  },
}
</script>

<style></style>

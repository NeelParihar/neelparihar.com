<template>
  <div class="max-w-7xl mx-auto border-gray-700 border-dashed border-l border-r">
    <div class="dark antialiased text-gray-200">
      <div class="px-4 py-6 max-w-6xl mx-auto sm:px-6 lg:px-8">

        <!-- Top bar: breadcrumb + share actions -->
        <div class="py-2 border-t border-b border-dashed border-gray-700 flex flex-wrap items-center justify-between gap-3">
          <div class="text-primary font-bold text-sm">
            <nuxt-link class="hover:text-primary" :to="localePath('/blog')">{{ $t('blog.header') }}</nuxt-link>
            <span class="text-gray-700 mx-1">/</span>
            <span class="text-gray-400">{{ post.category }}</span>
          </div>

          <!-- Share buttons -->
          <div class="flex items-center gap-2">
            <a
              :href="twitterShareUrl"
              target="_blank"
              rel="noreferrer"
              class="share-btn"
              title="Share on Twitter"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span class="hidden sm:inline">Twitter</span>
            </a>

            <a
              :href="linkedInShareUrl"
              target="_blank"
              rel="noreferrer"
              class="share-btn"
              title="Share on LinkedIn"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span class="hidden sm:inline">LinkedIn</span>
            </a>

            <button
              class="share-btn"
              :class="{ 'share-btn--copied': copied }"
              title="Copy link"
              @click="copyLink"
            >
              <svg v-if="!copied" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span class="hidden sm:inline">{{ copied ? 'Copied!' : 'Copy link' }}</span>
            </button>
          </div>
        </div>

        <!-- Main grid: content + ToC sidebar -->
        <div class="lg:grid lg:grid-cols-4 lg:gap-10 mt-6">

          <!-- Article content -->
          <article class="lg:col-span-3" ref="article" data-aos="fade-up">
            <!-- Post header -->
            <div class="px-4 sm:px-6 pb-6 bg-gray-900 rounded-xl">
              <a
                target="_blank"
                rel="noreferrer"
                :href="`https://twitter.com/${post.author.twitter}`"
              >
                <div class="flex items-center justify-center">
                  <UserAvatar
                    :photoURL="post.author.image"
                    :name="post.author.name"
                    class="w-12 h-12 border-2 border-indigo-600 hover:border-hot-pink -mt-5 bg-gray-900 rounded-full"
                  />
                </div>
              </a>

              <header class="py-4 text-center">
                <h1 class="text-2xl font-extrabold text-gray-100 tracking-tight leading-snug">{{ post.title }}</h1>
                <dl class="mt-2">
                  <dd class="text-xs font-medium text-gray-500">
                    <a target="_blank" rel="noreferrer" :href="`https://twitter.com/${post.author.twitter}`">
                      <span class="text-primary hover:text-primary">{{ post.author.name }}</span>
                    </a>
                    <time :datetime="post.createdAt">
                      {{ ' on ' + new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}
                    </time>
                    <span class="mx-1">&middot;</span>
                    {{ post.readingTime }}
                  </dd>
                </dl>

                <div class="flex flex-wrap items-center justify-center gap-2 mt-3">
                  <span
                    v-for="(tag, i) in post.tags"
                    :key="`tag-${i}`"
                    class="px-3 py-0.5 text-xs bg-primary rounded-full text-white font-medium"
                  >
                    {{ tag }}
                  </span>
                </div>
              </header>

              <!-- Post body -->
              <div class="prose dark:prose-dark break-words my-4 prose-sm max-w-4xl mx-auto" ref="articleContent">
                <nuxt-content :document="post" />
              </div>
            </div>

            <!-- Firebase engagement (if enabled) -->
            <div v-if="$config.firebase.enabled">
              <div class="my-6">
                <Like :slug="post.slug" />
              </div>
              <div id="comments" class="border-t border-gray-700 border-dashed mt-6 py-5">
                <CommentInput :slug="post.slug" />
              </div>
              <div class="space-y-4 max-w-7xl">
                <Comment v-for="(comment, index) in comments" :comment="comment" :key="index" />
              </div>
            </div>

            <!-- Prev / Next navigation -->
            <div
              v-if="prevPost || nextPost"
              class="mt-10 pt-8 border-t border-gray-700 border-dashed grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <nuxt-link
                v-if="prevPost"
                :to="localePath(`/blog/${prevPost.slug}`)"
                class="group flex flex-col p-4 rounded-xl bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                <span class="text-xs text-gray-500 mb-1">← Previous</span>
                <span class="text-sm font-semibold text-gray-200 group-hover:text-primary line-clamp-2 transition-colors">
                  {{ prevPost.title }}
                </span>
              </nuxt-link>
              <div v-else />

              <nuxt-link
                v-if="nextPost"
                :to="localePath(`/blog/${nextPost.slug}`)"
                class="group flex flex-col p-4 rounded-xl bg-gray-900 hover:bg-gray-800 transition-colors text-right"
              >
                <span class="text-xs text-gray-500 mb-1">Next →</span>
                <span class="text-sm font-semibold text-gray-200 group-hover:text-primary line-clamp-2 transition-colors">
                  {{ nextPost.title }}
                </span>
              </nuxt-link>
            </div>

            <!-- Related posts -->
            <div v-if="related && related.length" class="mt-10">
              <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Related posts</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BlogCard v-for="p in related" :key="p.slug" :post="p" />
              </div>
            </div>
          </article>

          <!-- Sticky ToC sidebar -->
          <aside v-if="post.toc && post.toc.length" class="hidden lg:block lg:col-span-1">
            <div class="sticky top-8 pt-1">
              <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">On this page</p>
              <nav class="space-y-1">
                <a
                  v-for="item in post.toc"
                  :key="item.id"
                  :href="`#${item.id}`"
                  class="toc-link block text-xs leading-5 transition-colors duration-150"
                  :class="{
                    'toc-link--active': activeSection === item.id,
                    'pl-4': item.depth === 3,
                    'pl-0': item.depth <= 2,
                  }"
                  @click.prevent="scrollTo(item.id)"
                >
                  {{ item.text }}
                </a>
              </nav>
            </div>
          </aside>
        </div>

      </div>
    </div>

    <!-- Scroll to top -->
    <button
      @click="scrollToTop"
      class="cursor-pointer fixed z-50 bottom-4 right-4 w-8 h-8 rounded-full bg-gray-900 text-primary hover:text-hot-pink flex items-center justify-center"
      aria-label="Scroll to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params, route, $config }) {
    const post = await $content('posts', params.slug).fetch()

    post.twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)} by @${post.author.twitter}&url=https://${$config.domain}${route.fullPath}`

    // Fetch prev/next by createdAt
    const [prevArr, nextArr, related] = await Promise.all([
      $content('posts')
        .where({ createdAt: { $lt: post.createdAt } })
        .sortBy('createdAt', 'desc')
        .limit(1)
        .without(['body', 'toc', 'dir', 'extension', 'path'])
        .fetch(),
      $content('posts')
        .where({ createdAt: { $gt: post.createdAt } })
        .sortBy('createdAt', 'asc')
        .limit(1)
        .without(['body', 'toc', 'dir', 'extension', 'path'])
        .fetch(),
      $content('posts')
        .where({ category: post.category, slug: { $ne: post.slug } })
        .limit(2)
        .without(['body', 'toc', 'dir', 'extension', 'path'])
        .fetch(),
    ])

    return {
      post,
      prevPost: prevArr[0] || null,
      nextPost: nextArr[0] || null,
      related,
    }
  },

  data() {
    return {
      copied: false,
      activeSection: '',
      toastOptions: { duration: 2000, theme: 'bubble' },
    }
  },

  computed: {
    postUrl() {
      return `https://${this.$config.domain}/blog/${this.post.slug}`
    },
    twitterShareUrl() {
      return this.post.twitterShareUrl
    },
    linkedInShareUrl() {
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.postUrl)}`
    },
    comments() {
      const comments = [...(this.$store.state.comments[this.post.slug] || [])]
      return comments.sort(this.cmp)
    },
  },

  async fetch() {
    if (!this.$config.firebase.enabled) return
    try {
      await this.$store.dispatch('fetchComments', { slug: this.post.slug })
    } catch (e) {
      this.$toast.error(e.toString(), this.toastOptions)
      console.error(e)
    }
  },

  mounted() {
    this.$nextTick(() => {
      this._addCopyButtons()
      this._initTocObserver()
    })
  },

  beforeDestroy() {
    if (this._tocObserver) this._tocObserver.disconnect()
  },

  methods: {
    _addCopyButtons() {
      const blocks = this.$el.querySelectorAll('.nuxt-content pre')
      blocks.forEach((pre) => {
        if (pre.querySelector('.copy-btn')) return

        const btn = document.createElement('button')
        btn.textContent = 'Copy'
        btn.className = 'copy-btn'
        btn.setAttribute('aria-label', 'Copy code to clipboard')

        btn.addEventListener('click', async () => {
          const code = pre.querySelector('code')
          try {
            await navigator.clipboard.writeText(code ? code.textContent : pre.textContent)
            btn.textContent = '✓ Copied'
            btn.classList.add('copied')
            setTimeout(() => {
              btn.textContent = 'Copy'
              btn.classList.remove('copied')
            }, 2000)
          } catch {
            btn.textContent = 'Error'
          }
        })

        pre.appendChild(btn)
      })
    },

    _initTocObserver() {
      if (!this.post.toc?.length) return
      if (typeof IntersectionObserver === 'undefined') return

      this._tocObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.activeSection = entry.target.id
            }
          })
        },
        { rootMargin: '0px 0px -65% 0px', threshold: 0 }
      )

      this.post.toc.forEach((item) => {
        const el = document.getElementById(item.id)
        if (el) this._tocObserver.observe(el)
      })
    },

    scrollTo(id) {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },

    scrollToTop() {
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
    },

    async copyLink() {
      try {
        await navigator.clipboard.writeText(this.postUrl)
        this.copied = true
        setTimeout(() => { this.copied = false }, 2000)
      } catch {
        // fallback: do nothing silently
      }
    },

    cmp(a, b) {
      if (a.created < b.created) return 1
      if (a.created > b.created) return -1
      return 0
    },
  },

  head() {
    const url = this.postUrl
    return {
      title: `${this.post.title} — blog — ${this.$config.name}`,
      meta: [
        { hid: 'description', name: 'description', content: this.post.description },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:title', property: 'og:title', content: this.post.title },
        { hid: 'og:description', property: 'og:description', content: this.post.description },
        { hid: 'og:image', property: 'og:image', content: this.post.image || this.$config.image },
        { hid: 'og:url', property: 'og:url', content: url },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:title', name: 'twitter:title', content: this.post.title },
        { hid: 'twitter:description', name: 'twitter:description', content: this.post.description },
        { hid: 'twitter:image', name: 'twitter:image', content: this.post.image || this.$config.image },
        { property: 'article:published_time', content: this.post.createdAt },
        { property: 'article:author', content: this.post.author.name },
      ],
      script: [
        {
          type: 'application/ld+json',
          json: {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: this.post.title,
            description: this.post.description,
            image: this.post.image || this.$config.image,
            datePublished: this.post.createdAt,
            url,
            author: {
              '@type': 'Person',
              name: this.post.author.name,
              url: `https://twitter.com/${this.post.author.twitter}`,
            },
            publisher: {
              '@type': 'Person',
              name: this.$config.name,
              url: `https://${this.$config.domain}`,
            },
          },
        },
      ],
    }
  },
}
</script>

<style scoped>
/* Share buttons */
.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid #2F3133;
  background: transparent;
  color: #A7A8A8;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}

.share-btn:hover {
  color: #fff;
  border-color: #205295;
  background: rgba(32, 82, 149, 0.15);
}

.share-btn--copied {
  color: #42b883;
  border-color: #42b883;
  background: rgba(66, 184, 131, 0.1);
}

/* ToC links */
.toc-link {
  color: #797B7C;
  border-left: 2px solid transparent;
  padding-left: 8px;
}

.toc-link:hover {
  color: #D3D4D4;
}

.toc-link--active {
  color: #205295;
  border-left-color: #205295;
  font-weight: 600;
}

/* nuxt-content deep styles */
>>> .nuxt-content pre {
  position: relative;
}

>>> .nuxt-content pre .copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.08);
  color: #797B7C;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1.6;
}

>>> .nuxt-content pre .copy-btn:hover,
>>> .nuxt-content pre .copy-btn.copied {
  background: rgba(32, 82, 149, 0.35);
  color: #fff;
  border-color: #205295;
}

>>> .icon {
  @apply text-primary hover:text-hot-pink hidden;
}

>>> .breaker {
  @apply text-center py-2;
}

>>> .breaker::after {
  content: "• • •";
}

>>> .nuxt-content .caption {
  @apply text-center;
}

>>> .nuxt-content img {
  @apply mx-auto rounded-md;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

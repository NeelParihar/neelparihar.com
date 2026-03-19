<template>
  <div class="bg-white border-t border-b border-dashed border-gray-200">
    <div data-aos="fade-up"
      class="max-w-7xl mx-auto border-l border-r border-dashed border-gray-200 flex flex-col items-center">
      <div class="max-w-prose text-center mx-auto py-4">
        <p class="text-xs leading-6 text-primary font-semibold tracking-wide lowercase">{{ $t('githubCalendar.subtext')
          }}</p>
        <a :href="`https://github.com/${$config.social.github}`" target="_blank" rel="noreferrer"
          class="mt-2 text-3xl hover:text-hot-pink leading-8 font-extrabold tracking-tight text-gray-800">{{
            $t('githubCalendar.header') }}</a>
      </div>
      <img class=" w-full my-10 px-10 lowercase" src="https://ghchart.rshah.org/205295/neelparihar"
        alt="neel's Github chart" />


    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
</style>

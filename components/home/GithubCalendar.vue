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
import GitHubCalendar from 'github-calendar'

export default {
  mounted() {
    GitHubCalendar(".calendar", this.$config.social.github, { responsive: true, tooltips: true });
  }
}
</script>

<style scoped>
/* >>>rect.ContributionCalendar-day[data-level='0'] {
  @apply fill-current text-gray-100;
}

>>>rect.ContributionCalendar-day[data-level='1'] {
  fill: rgb(14, 68, 41);
}

>>>rect.ContributionCalendar-day[data-level='2'] {
  fill: rgb(0, 109, 50);
}

>>>rect.ContributionCalendar-day[data-level='3'] {
  fill: rgb(38, 166, 65);
}

>>>rect.ContributionCalendar-day[data-level='4'] {
  fill: rgb(57, 211, 83);
}

>>>.graph-before-activity-overview {
  border: none;
}

>>>.graph-before-activity-overview>.Box-header>.width-full {
  display: none;
}

.calendar {
  border: none;
}

.calendar>>>.width-full>.float-right {
  @apply text-sm text-gray-400 flex flex-row items-center justify-center px-4;
}

.calendar>>>.width-full>.float-right svg {
  @apply mx-0.5;
}


.calendar>>>.width-full>.float-left {
  @apply flex items-center justify-center;
}

.calendar>>>.width-full>.float-left a {
  @apply pl-8 text-sm text-gray-400 hover:text-primary;
}

>>>text.ContributionCalendar-label {
  font-size: 9px;
  @apply text-gray-500;
}

>>>.contrib-column {
  @apply border-none;
}

>>>.contrib-number {
  @apply text-gray-400 font-bold;
}

>>>.text-muted {
  @apply text-gray-300;
} */
</style>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useAuthStore } from './stores/auth';
  import VideoPlayer from './components/VideoPlayer.vue'
  const store = useAuthStore()
  const displayName = computed(() => store.authRef?.user.global_name ?? store.authRef?.user.username)
</script>

<template>
  <main>hewwo wowld owo</main>
  <p v-if="store.loggedIn">u r {{ displayName }}</p>
  <p v-else>not logged in!</p>
  <VideoPlayer/>
</template>

<style scoped>
</style>

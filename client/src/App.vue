<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import { useAuthStore } from './stores/auth';
import { usePlaybackStore } from './stores/playback';
import VideoPlayer from './components/VideoPlayer.vue'
import { searchTitles } from './api'
import { asyncComputed } from '@vueuse/core'
import type { TitlesDataT } from './api/anilibria-types';
const authStore = useAuthStore()
const playbackStore = usePlaybackStore()
const displayName = computed(() => authStore.authRef?.user.global_name ?? authStore.authRef?.user.username)
const searchQuery = ref('')
const searchInProgress = ref(false)
const searchResults = asyncComputed(() => searchTitles({ search: searchQuery.value }), null, searchInProgress)
</script>

<template>
  <div class="wrapper">
    <main>
      <section class="queue">
        <ul v-if="playbackStore.playlistResolved != null">
          <li :key="i" v-for="(p, i) of playbackStore.playlistResolved" @click="playbackStore.dequeue(i)">{{ p.title.names.ru }} - {{ p.episode }}</li>
        </ul>
      </section>
      <section class="search">
        <input type="text" v-model="searchQuery" placeholder="Search query">
        <ul v-if="!searchInProgress">
          <li :key="result.code" v-for="result of searchResults!.list"
            @click="playbackStore.enqueue({ code: result.code, episode: 1 })">
            {{ result.names.ru }}
          </li>
        </ul>
      </section>
    </main>
    <div class="player-out">
      <VideoPlayer v-if="playbackStore.currentlyPlaying != null" :title="playbackStore.currentlyPlaying!" :episode="1"/>
      <p style="margin: 0 1rem;" v-if="playbackStore.currentlyPlaying == null">No media</p>
      <p style="margin: 0 1rem;" v-else>{{ playbackStore.currentlyPlaying.names.ru }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  main {
    flex: 1;
  }
  height: 100vh;
}
main {
  display: grid;
  grid-template-columns: 1fr 3fr;
  color: white;
  border: 1px solid red;

  .queue {
    background-color: black;
  }

  .search {
    background-color: #333;
  }
}

@media (max-width: 320px) {
  .queue {
    display: none;
  }

  .search {
    grid-column: 1 / span 2;
  }
}

.player-out {
  background-color: black;
  color: white;
  /* position: absolute; */
  min-height: 4rem;
  max-height: 6rem;
  video {
    max-height: inherit;
    margin: 0;
    /* width: min-content; */
  }
  display: flex;
  align-items: center;
}
</style>

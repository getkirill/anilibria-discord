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

// const displayName = computed(() => authStore.authRef?.user.global_name ?? authStore.authRef?.user.username)
const searchQuery = ref('')
const searchInProgress = ref(false)
const searchResults = asyncComputed(() => searchTitles({ search: searchQuery.value }), null, searchInProgress)
const miniplayer = ref(true)
</script>

<template>
  <div class="wrapper" :data-miniplayer="miniplayer">
    <main>
      <section class="queue">
        <div>
          <ul v-if="playbackStore.playlistResolved != null">
            <li :key="i" v-for="(p, i) of playbackStore.playlistResolved" @click="playbackStore.dequeue(i)">
              {{ p.title.names.ru }} - {{ p.episode }}</li>
          </ul>
        </div>
        <div>
          <p>Settings</p>
          <label>
            <input type="checkbox" v-model="miniplayer">
            Miniplayer
          </label><br>
          <label>
            Playlist control:
            <select>
              <option value="host">Host</option>
              <!-- <option>Friends</option> -->
              <option value="eveyone">Everyone</option>
            </select>
          </label><br>
          <label>
            Playback control:
            <select>
              <option value="host">Host</option>
              <!-- <option>Friends</option> -->
              <option value="eveyone">Everyone</option>
            </select>
          </label>
        </div>
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
      <VideoPlayer v-if="playbackStore.currentlyPlaying != null" :title="playbackStore.currentlyPlaying!"
        :episode="1" :controls="!miniplayer" @progress="(progress) => authStore.sendMessageToWebsocket({type:'sync', progress, token: authStore.authRef!.access_token })" />
      <div v-else-if="!miniplayer">No media (fullscreen mode)</div>
      <div class="mini-controls">
        <p style="margin: 0 1rem;" v-if="playbackStore.currentlyPlaying == null">No media</p>
        <p style="margin: 0 1rem;" v-else>{{ playbackStore.currentlyPlaying.names.ru }}</p>
      </div>
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
    display: grid;
    grid-template-rows: 3fr 1fr;
  }

  .search {
    background-color: #333;
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

[data-miniplayer=false] {
  main {
    display: none;
  }

  .player-out {
    max-width: unset;
    max-height: unset;
    height: 100%;
    width: 100%;

    .mini-controls {
      display: none;
    }
  }
}

@media (max-width: 320px) {
  main {
    display: none;
  }

  .player-out {
    max-width: unset;
    max-height: unset;
    height: 100%;
    width: 100%;

    .mini-controls {
      display: none;
    }
  }
}
</style>

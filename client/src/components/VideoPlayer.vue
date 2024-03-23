<script setup lang="ts">
import { getTitle, getTitleHLS } from '@/api';
import type { TitleT } from '@/api/anilibria-types';
import Hls from 'hls.js'
import { onMounted, ref, watch } from 'vue';
const props = defineProps<{
  title: TitleT
  episode: number
}>()
const vidRef = ref<HTMLVideoElement | null>(null)
const hls = new Hls()
onMounted(() => {
    hls.attachMedia(vidRef.value!)
    hls.loadSource(getTitleHLS(props.title, props.title.player.list[props.episode - 1], "hd"))
})
watch([() => props.title, () => props.episode], () => {
  hls.loadSource(getTitleHLS(props.title, props.title.player.list[props.episode - 1], "hd"))
})
// watch([() => props.title, () => props.episode], ([title, episode]: [TitleT, number]) => {
//     hls.loadSource(getTitleHLS(title, title.player.list[episode - 1], "hd"))
// })
</script>

<template>
    <video ref="vidRef" crossorigin="anonymous" :controls="true">
    </video>
</template>
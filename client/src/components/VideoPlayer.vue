<script setup lang="ts">
import { onMounted, ref } from 'vue';
import videojs from 'video.js'
const vidRef = ref<HTMLVideoElement | null>(null)
onMounted(() => {
    videojs(vidRef.value!, {
        controls: false,
    }).addClass('vjs-wrapper');
})
</script>

<template>
    <video ref="vidRef" crossorigin="anonymous" :controls="false">
        <source :src="'https://cache.libria.fun/videos/media/ts/8874/1/1080/e31bb0014b2fe364fd5306b49a410106.m3u8'">
    </video>
</template>

<style scoped>
    video, .vjs-wrapper {
        width: 100vw;
        max-width:100%;
    }
</style>
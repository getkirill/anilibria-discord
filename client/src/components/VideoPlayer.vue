<script setup lang="ts">
import { ref, watch } from 'vue';
import videojs from 'video.js'
    const vidRef = ref<HTMLVideoElement | null>(null)
    watch(vidRef, () => {
        videojs(vidRef.value!, {
            controls: false
        })
    })
</script>д

<template>
    <video ref="vidRef" crossorigin="anonymous" :controls="false">
        <source :src="'/libria-cache/videos/media/ts/8874/1/1080/e31bb0014b2fe364fd5306b49a410106.m3u8'">
    </video>
</template>
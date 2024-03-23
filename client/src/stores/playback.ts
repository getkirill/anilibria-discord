import { getTitle } from "@/api"
import type { TitleT } from "@/api/anilibria-types"
import { asyncComputed } from "@vueuse/core"
import { defineStore } from "pinia"
import { ref } from "vue"

type PlaylistEntry = {
    code: string,
    episode: number
}

export const usePlaybackStore = defineStore('playback', () => {
    const playlist = ref<PlaylistEntry[]>([])
    const currentlyPlaying = ref<TitleT | null>(null)
    function enqueue(entry: PlaylistEntry) {
        playlist.value.push(entry)
        if (playlist.value.length == 1) { (async () => currentlyPlaying.value = await getTitle({ code: playlist.value[0].code }))() }
    }
    function dequeue(index: number) {
        playlist.value.splice(index, 1)
        if (index == 0) { (async () => currentlyPlaying.value = (playlist.value.length > 0 ? await getTitle({ code: playlist.value[0].code }) : null))() }
    }
    const playlistResolved = asyncComputed(() => Promise.all(
        playlist.value.map(
            async (it) =>
                ({ title: await getTitle({ code: it.code }), episode: it.episode })
        )
    ), null)

    return { playlist, playlistResolved, enqueue, currentlyPlaying, dequeue }
})
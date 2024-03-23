import { getTitle } from "@/api"
import { asyncComputed } from "@vueuse/core"
import { defineStore } from "pinia"
import { ref } from "vue"

type PlaylistEntry = {
    code: string,
    episode: number
}

export const usePlaybackStore = defineStore('playback', () => {
    const playlist = ref<PlaylistEntry[]>([])
    function enqueue(entry: PlaylistEntry) {
        playlist.value.push(entry)
    }
    function dequeue(index: number) {
        playlist.value.splice(index, 1)
    }
    const currentlyPlaying = asyncComputed(() => playlist.value.length > 0 ? getTitle({ code: playlist.value[0].code }) : null, null, {})
    const playlistResolved = asyncComputed(() => Promise.all(
        playlist.value.map(
            async (it) =>
                ({ title: await getTitle({ code: it.code }), episode: it.episode })
        )
    ), null)

    return { playlist, playlistResolved, enqueue, currentlyPlaying, dequeue }
})
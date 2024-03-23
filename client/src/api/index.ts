import type { TitleRandomRequestOptionsT, TitleRequestOptionsT, TitleSearchRequestOptionsT, TitleT, TitlesDataT } from "./anilibria-types";
import type { playerListT } from "./anilibria-types/TitleT";

const host = "https://api.anilibria.tv/v3"

export function generateAPI<T extends Record<string, any>, R extends Record<string, any>>(route: string, overrideReq?: Partial<T>, overrideOpts?: RequestInit): (request: T, opts?: RequestInit) => Promise<R> {
    return async (request, opts) => JSON.parse(await (await fetch(host + route + "?" + new URLSearchParams({ ...request, ...overrideReq }).toString(), { ...opts, ...overrideOpts })).text() as string);
}

export const getTitle = generateAPI<TitleRequestOptionsT, TitleT>("/title", { playlist_type: "array" })
export const getRandomTitle = generateAPI<TitleRandomRequestOptionsT, TitleT>("/title/random", { playlist_type: "array" }, {
    headers: {
        'Cache-Control': 'no-cache',
        // 'Pragma': 'no-cache', // fuck CORS
        // 'Expires': '0', // also fuck CORS
    },
});
export const searchTitles = generateAPI<TitleSearchRequestOptionsT, TitlesDataT>("/title/search", { playlist_type: "array" })
export function getTitleHLS(title: TitleT, episode: playerListT, quality: "fhd" | "hd" | "sd") {
    return `https://${title.player.host}${episode.hls[quality]}`
}
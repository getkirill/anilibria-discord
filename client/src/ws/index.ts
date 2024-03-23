/** if too late seeks */
type SyncMessage = { type: "sync", progress: number, token: string }
/** forcibly synchronises everyone */
type SeekMessage = { type: "seek", progress: number, token: string }
type PermissionUpdateMessage = { type: "permission_update", permission: "playback" | "playlist", value: "host" | "everyone" }
type HelloMessage = { type: "hello", instance: string, token: string }
export type Message = SyncMessage | SeekMessage | PermissionUpdateMessage | HelloMessage

export function createWebsocket(): WebSocket {
    return new WebSocket(new URL(`wss://${import.meta.env.VITE_DISCORD_CLIENT_ID}.discordsays.com/api/ws`))
}

export function waitForReady(ws: WebSocket): Promise<void> {
    return new Promise((resolve) => {
        ws.addEventListener('open', e => {
            resolve()
        })
    })
}
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { createWebsocket, waitForReady } from '../ws'
import type { Message } from '../ws'

export type Auth = {
  access_token: string;
  user: {
    username: string;
    discriminator: string;
    id: string;
    public_flags: number;
    avatar?: string | null | undefined;
    global_name?: string | null | undefined;
  };
  scopes: (-1 | "identify" | "email" | "connections" | "guilds" | "guilds.join" | "guilds.members.read" | "gdm.join" | "rpc" | "rpc.notifications.read" | "rpc.voice.read" | "rpc.voice.write" | "rpc.video.read" | "rpc.video.write" | "rpc.screenshare.read" | "rpc.screenshare.write" | "rpc.activities.write" | "bot" | "webhook.incoming" | "messages.read" | "applications.builds.upload" | "applications.builds.read" | "applications.commands" | "applications.commands.update" | "applications.commands.permissions.update" | "applications.store.update" | "applications.entitlements" | "activities.read" | "activities.write" | "relationships.read" | "voice" | "dm_channels.read" | "role_connections.write")[];
  expires: string;
  application: {
    id: string;
    description: string;
    name: string;
    icon?: string | null | undefined;
    rpc_origins?: string[] | undefined;
  };
}

export const useAuthStore = defineStore('auth', () => {
  const authRef = ref<Auth | null>(null)
  const websocket = ref<WebSocket | null>(null)
  function login(auth: Auth) {
    authRef.value = auth
  }
  async function setupWebsocket(instance: string) {
    websocket.value = createWebsocket()
    await waitForReady(websocket.value)
    sendMessageToWebsocket({ type: "hello", instance, token: authRef.value!.access_token })
  }
  function sendMessageToWebsocket(message: Message) {
    websocket.value?.send(JSON.stringify(message))
  }
  const loggedIn = computed(() => authRef.value != null)

  return { authRef, login, loggedIn, websocket, setupWebsocket, sendMessageToWebsocket }
})

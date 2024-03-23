import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { DiscordSDK, patchUrlMappings } from '@discord/embedded-app-sdk';
import { useAuthStore } from './stores/auth';
// patch shit
patchUrlMappings([{ prefix: "/libria-cache", target: "cache.libria.fun" }, { prefix: "/anilib-api", target: "api.anilibria.tv" }])

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

async function setupDiscordSdk() {
    await discordSdk.ready();
    console.log("Discord SDK is ready");

    // Authorize with Discord Client
    const { code } = await discordSdk.commands.authorize({
        client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
        response_type: "code",
        state: "",
        prompt: "none",
        scope: [
            "identify",
            "guilds",
            // "relationships.read" // seemingly no api
        ],
    });

    // Retrieve an access_token from your activity's server
    const response = await fetch("/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code,
        }),
    });
    const { access_token } = await response.json();

    // Authenticate with Discord client (using the access_token)
    const auth = await discordSdk.commands.authenticate({
        access_token,
    });

    if (auth == null) {
        throw new Error("Authenticate command failed");
    }
    const store = useAuthStore()
    store.login(auth)
    store.setupWebsocket(discordSdk.instanceId)
    console.log(auth)
}
const app = createApp(App)

app.use(createPinia())
setupDiscordSdk()

app.mount('#app')

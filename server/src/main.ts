// oauth owo
import express from "express";
import expressWs from "express-ws";
import dotenv from 'dotenv'
import WebSocket, { Data } from "ws";
dotenv.config({ path: "../.env.local" });
const app = expressWs(express()).app;
const port = 3001;

// Allow express to parse JSON bodies
app.use(express.json());

app.post("/api/token", async (req, res) => {

  // Exchange the code for an access_token
  const response = await fetch(`https://discord.com/api/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.VITE_DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: req.body.code,
    } as Record<string, string>),
  });

  // Retrieve the access_token from the response
  const { access_token } = await response.json();

  // Return the access_token to our client as { access_token: "..."}
  res.send({ access_token });
});

type ConnectedClient = {
  client: WebSocket,
  instance: string,
  token: string,
  id: string,
  oauth: Record<any, any>
}
const connectedClients: ConnectedClient[] = []

type Instance = {
  id: string,
  owner: string,
  permissions: {
    playlist: "host" | "everyone",
    playback: "host" | "everyone",
  }
}

const knownInstances: Record<string, Instance> = {}

function waitForMessage(ws: WebSocket): Promise<WebSocket.MessageEvent> {
  return new Promise((resolve, reject) => {
    const listener = (e: WebSocket.MessageEvent) => {
      resolve(e)
      ws.removeEventListener('message', listener)
    }
    const closed = (e: WebSocket.CloseEvent) => {
      reject(e)
    }
    ws.addEventListener('message', listener)
    ws.addEventListener('close', closed)
  })
}

function checkedMessage(m: Data): Record<string, any> {
  m = `${m}`
  let data: { type: string }
  try {
    data = JSON.parse(m as string)
  } catch (e) {
    console.error(e)
    throw "failed to parse data - not json?"
  }
  return data
}

async function getOauthMe(token: string): Promise<Record<any, any>> {
  return (await fetch("https://discord.com/api/oauth2/@me", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })).json()
}

async function handleInitialMessage(m: Data): Promise<Omit<ConnectedClient, "client">> {
  const data = checkedMessage(m)
  if (data["type"] != "hello") throw "not a hello"
  const instance = data["instance"]
  const token = data["token"]
  const oauth = await getOauthMe(token)
  console.log(oauth)
  return { instance, token, oauth, id: oauth.user.id }
}

function findConnectedClientByWebsocket(ws: WebSocket): ConnectedClient {
  return connectedClients.filter(it => it.client == ws)[0]
}
function findConnectedClientById(id: string): ConnectedClient {
  return connectedClients.filter(it => it.id == id)[0]
}

/** if too late seeks */
type SyncMessage = { type: "sync", progress: number, token: string }
/** forcibly synchronises everyone */
type SeekMessage = { type: "seek", progress: number, token: string }
type PlayingMessage = {type: "is_playing", playing: boolean, token: string}
type PermissionUpdateMessage = { type: "permission_update", permission: keyof Instance['permissions'], value: Instance['permissions']['playback'] }
type HelloMessage = { type: "hello", instance: string, token: string }
type Message = SyncMessage | SeekMessage | PermissionUpdateMessage | HelloMessage | PlayingMessage

app.ws('/api/ws', (ws) => {
  ws.send(JSON.stringify({ type: "hello", from: "server" }))
  waitForMessage(ws).then(async message => {
    // console.log(message)
    let context
    try {
      context = await handleInitialMessage(message.data)
      // console.log(context)
    } catch (e) {
      ws.close(undefined, JSON.stringify({ error: e }))
      // console.log(e)
      return
    }
    connectedClients.push({ ...context!, client: ws })
    if (!(context!.instance in knownInstances)) {
      knownInstances[context!.instance] = {
        id: context!.instance,
        owner: context!.oauth.user.id,
        permissions: {
          "playlist": "host",
          "playback": "host"
        }
      }
    }

    console.log(connectedClients)
    console.log(knownInstances)

    ws.addEventListener('message', ev => {
      const client = findConnectedClientByWebsocket(ws)
      const mesg: Message = checkedMessage(ev.data) as Message
      console.log(mesg)
      switch (mesg.type) {
        case "sync":
        case "seek":
        case "is_playing":
          {
            if (knownInstances[client.instance].permissions.playback == "host" && client.token != findConnectedClientById(knownInstances[client.instance].owner).token) {
              ws.send(JSON.stringify({ error: "Not authorized." }))
              break
            }
            connectedClients.filter(it => it.instance == client.instance && it.id != client.id).forEach(it => it.client.send(JSON.stringify({...mesg, token: undefined})))
            ws.send(JSON.stringify({ type: "ok" }))
            break
          }
        case "permission_update":
          {
            if (client.token != findConnectedClientById(knownInstances[client.instance].owner).token) {
              ws.send(JSON.stringify({ error: "Not authorized to change permissions." }))
              break
            }
            knownInstances[client.instance].permissions[mesg.permission] = mesg.value
            ws.send(JSON.stringify({ type: "ok" }))
            break
          }
      }
    })
    ws.addEventListener('close', ev => {
      const client = findConnectedClientByWebsocket(ws)
      connectedClients.splice(connectedClients.indexOf(client), 1)
      if (connectedClients.map(it => it.instance).filter(it => client.instance == it).length < 1) {
        delete knownInstances[client.instance]
      }
      console.log(connectedClients)
      console.log(knownInstances)
    })
  })
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
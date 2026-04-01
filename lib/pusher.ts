import Pusher from "pusher"

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

export const LIVE_ROOM_CHANNEL = (roomCode: string) => `live-room-${roomCode}`

export const PUSHER_EVENTS = {
  PITCH_CHANGED: "pitch-changed",
  ROOM_CLOSED: "room-closed",
} as const

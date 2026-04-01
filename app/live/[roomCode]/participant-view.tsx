"use client"

import { useEffect, useState } from "react"
import { getPusherClient } from "@/lib/pusher-client"
import { PUSHER_EVENTS } from "@/lib/pusher"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Roast {
  id: string
  content: string
}

interface Pitch {
  id: string
  title: string
  description: string
  user: { name: string | null; email: string | null }
  roasts: Roast[]
}

interface Props {
  roomCode: string
  initialPitch: Pitch | null
}

export function ParticipantView({ roomCode, initialPitch }: Props) {
  const [pitch, setPitch] = useState<Pitch | null>(initialPitch)
  const [roomClosed, setRoomClosed] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    const pusher = getPusherClient()
    const channel = pusher.subscribe(`live-room-${roomCode}`)

    channel.bind(PUSHER_EVENTS.PITCH_CHANGED, (data: { pitch: Pitch | null }) => {
      setPitch(data.pitch)
      setLastUpdated(new Date())
    })

    channel.bind(PUSHER_EVENTS.ROOM_CLOSED, () => {
      setRoomClosed(true)
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(`live-room-${roomCode}`)
    }
  }, [roomCode])

  if (roomClosed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-4xl">🎤</p>
        <h2 className="text-2xl font-bold">The session has ended</h2>
        <p className="text-muted-foreground">Thanks for watching!</p>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4 space-y-6">
      {/* Room badge */}
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="font-mono text-base px-3 py-1">
          {roomCode}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {lastUpdated
            ? `Updated ${lastUpdated.toLocaleTimeString()}`
            : "Waiting for host…"}
        </span>
        <span className="relative flex h-2 w-2 ml-auto">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
      </div>

      {/* Pitch display */}
      {pitch ? (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{pitch.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              by {pitch.user.name ?? pitch.user.email}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base leading-relaxed">{pitch.description}</p>

            {pitch.roasts.length > 0 && (
              <div className="rounded-lg bg-muted p-4 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  AI Roast
                </p>
                <p className="text-sm leading-relaxed">{pitch.roasts[0].content}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4 text-center">
          <p className="text-5xl animate-bounce">🎯</p>
          <h2 className="text-xl font-semibold">Standing by…</h2>
          <p className="text-muted-foreground text-sm">
            The host will display a pitch any moment now.
          </p>
        </div>
      )}
    </div>
  )
}

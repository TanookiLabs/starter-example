"use client"

import { useState, useTransition } from "react"
import { setActivePitch, closeLiveRoom } from "@/lib/actions/live-room"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Pitch {
  id: string
  title: string
  description: string
  roastSnippet: string | null
}

interface Props {
  roomCode: string
  activePitchId: string | null
  pitches: Pitch[]
}

export function HostControls({ roomCode, activePitchId: initial, pitches }: Props) {
  const [activePitchId, setActivePitchId] = useState<string | null>(initial)
  const [isPending, startTransition] = useTransition()

  const handleSetPitch = (pitchId: string | null) => {
    startTransition(async () => {
      await setActivePitch(roomCode, pitchId)
      setActivePitchId(pitchId)
    })
  }

  const activePitch = pitches.find((p) => p.id === activePitchId)

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Host Controls</h1>
          <p className="text-muted-foreground mt-1">
            Share code{" "}
            <span className="font-mono font-bold text-foreground text-xl tracking-widest">
              {roomCode}
            </span>
            {" — "}participants go to{" "}
            <strong>/live/{roomCode}</strong>
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={() => startTransition(() => closeLiveRoom(roomCode))}
          disabled={isPending}
        >
          Close Room
        </Button>
      </div>

      {/* Currently active */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Now Showing
            {activePitch ? (
              <Badge variant="default">Live</Badge>
            ) : (
              <Badge variant="secondary">Nothing selected</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activePitch ? (
            <div>
              <p className="font-semibold text-lg">{activePitch.title}</p>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                {activePitch.description}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Select a pitch below to broadcast it to all participants instantly.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Pitch list */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Pitches</h2>
        {pitches.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No pitches yet.{" "}
            <a href="/submit" className="underline">
              Submit one
            </a>
            .
          </p>
        ) : (
          <div className="grid gap-3">
            {pitches.map((pitch) => {
              const isActive = activePitchId === pitch.id
              return (
                <Card
                  key={pitch.id}
                  className={isActive ? "border-primary ring-2 ring-primary" : ""}
                >
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{pitch.title}</p>
                      <p className="text-muted-foreground text-sm truncate">
                        {pitch.description}
                      </p>
                      {pitch.roastSnippet && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          Roast: {pitch.roastSnippet.slice(0, 80)}…
                        </p>
                      )}
                    </div>
                    <div className="ml-4 shrink-0">
                      {isActive ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetPitch(null)}
                          disabled={isPending}
                        >
                          Hide
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleSetPitch(pitch.id)}
                          disabled={isPending}
                        >
                          Show
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

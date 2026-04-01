import { notFound } from "next/navigation"
import { getLiveRoom } from "@/lib/actions/live-room"
import { ParticipantView } from "./participant-view"

interface Props {
  params: Promise<{ roomCode: string }>
}

export default async function LiveRoomPage({ params }: Props) {
  const { roomCode } = await params
  const room = await getLiveRoom(roomCode.toUpperCase())

  if (!room) notFound()

  return (
    <ParticipantView
      roomCode={room.roomCode}
      initialPitch={room.activePitch ?? null}
    />
  )
}

import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { getLiveRoom, getHostPitches, setActivePitch, closeLiveRoom } from "@/lib/actions/live-room"
import { HostControls } from "./host-controls"

interface Props {
  params: Promise<{ roomCode: string }>
}

export default async function HostPage({ params }: Props) {
  const { roomCode } = await params
  const session = await auth()
  const room = await getLiveRoom(roomCode)

  if (!room) notFound()
  if (room.hostId !== session?.user?.id) notFound()

  const pitches = await getHostPitches()

  return (
    <HostControls
      roomCode={roomCode}
      activePitchId={room.activePitchId ?? null}
      pitches={pitches.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        roastSnippet: p.roasts[0]?.content ?? null,
      }))}
    />
  )
}

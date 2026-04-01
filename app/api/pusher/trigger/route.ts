import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { pusherServer, LIVE_ROOM_CHANNEL } from "@/lib/pusher"
import { prisma } from "@/lib/db/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { roomCode, event, data } = await req.json()

  // Verify the caller is the host
  const room = await prisma.liveRoom.findUnique({ where: { roomCode } })
  if (!room || room.hostId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await pusherServer.trigger(LIVE_ROOM_CHANNEL(roomCode), event, data)
  return NextResponse.json({ ok: true })
}

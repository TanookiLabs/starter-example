"use server"

import { prisma } from "@/lib/db/prisma"
import { auth } from "@/auth"
import { pusherServer, LIVE_ROOM_CHANNEL, PUSHER_EVENTS } from "@/lib/pusher"
import { redirect } from "next/navigation"

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function createLiveRoom() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  let roomCode = generateRoomCode()
  // Retry on collision (extremely rare but safe)
  let existing = await prisma.liveRoom.findUnique({ where: { roomCode } })
  while (existing) {
    roomCode = generateRoomCode()
    existing = await prisma.liveRoom.findUnique({ where: { roomCode } })
  }

  const room = await prisma.liveRoom.create({
    data: {
      roomCode,
      hostId: session.user.id,
    },
  })

  redirect(`/live/${room.roomCode}/host`)
}

export async function getLiveRoom(roomCode: string) {
  return prisma.liveRoom.findUnique({
    where: { roomCode },
    include: {
      host: { select: { id: true, name: true, email: true } },
      activePitch: {
        include: {
          user: { select: { name: true, email: true } },
          roasts: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      },
    },
  })
}

export async function setActivePitch(roomCode: string, pitchId: string | null) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const room = await prisma.liveRoom.findUnique({ where: { roomCode } })
  if (!room) throw new Error("Room not found")
  if (room.hostId !== session.user.id) throw new Error("Only the host can control the room")

  const updated = await prisma.liveRoom.update({
    where: { roomCode },
    data: { activePitchId: pitchId },
    include: {
      activePitch: {
        include: {
          user: { select: { name: true, email: true } },
          roasts: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      },
    },
  })

  await pusherServer.trigger(
    LIVE_ROOM_CHANNEL(roomCode),
    PUSHER_EVENTS.PITCH_CHANGED,
    {
      pitch: updated.activePitch,
    }
  )

  return updated
}

export async function closeLiveRoom(roomCode: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const room = await prisma.liveRoom.findUnique({ where: { roomCode } })
  if (!room) throw new Error("Room not found")
  if (room.hostId !== session.user.id) throw new Error("Only the host can close the room")

  await prisma.liveRoom.update({
    where: { roomCode },
    data: { isActive: false },
  })

  await pusherServer.trigger(
    LIVE_ROOM_CHANNEL(roomCode),
    PUSHER_EVENTS.ROOM_CLOSED,
    {}
  )

  redirect("/live/create")
}

export async function getHostPitches() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  return prisma.pitch.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      roasts: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  })
}

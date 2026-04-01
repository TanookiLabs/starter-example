import { createLiveRoom } from "@/lib/actions/live-room"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateLiveRoomPage() {
  return (
    <div className="container max-w-lg mx-auto py-16 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Live Roast Room</CardTitle>
          <CardDescription>
            Host a Kahoot-style session where your audience sees pitches in real time
            and reacts as the AI roasts them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>You get a 6-character room code to share with participants</li>
            <li>Participants join at <strong>/live/[code]</strong> — no login required</li>
            <li>You control which pitch is on screen; everyone sees it instantly</li>
          </ul>
          <form action={createLiveRoom}>
            <Button type="submit" className="w-full" size="lg">
              Create Room
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

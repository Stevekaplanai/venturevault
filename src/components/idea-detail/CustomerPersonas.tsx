import { User, Target, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import type { CustomerPersona } from "../../data/ideas"

interface CustomerPersonasProps {
  personas: CustomerPersona[]
}

const avatarColors = [
  "from-purple-500 to-indigo-500",
  "from-pink-500 to-rose-500",
  "from-cyan-500 to-blue-500",
  "from-orange-500 to-amber-500",
]

export function CustomerPersonas({ personas }: CustomerPersonasProps) {
  if (!personas || personas.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Customer personas coming soon...
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-purple-500" />
        <h3 className="text-lg font-semibold">Target Customer Personas</h3>
        <Badge variant="secondary">{personas.length} personas</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {personas.map((persona, index) => (
          <Card key={persona.name} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xl font-bold">
                    {persona.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-lg">{persona.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{persona.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">{persona.demographics}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Pain Points */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Pain Points</span>
                </div>
                <ul className="space-y-1.5">
                  {persona.painPoints.map((pain, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      {pain}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Goals */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Goals</span>
                </div>
                <ul className="space-y-1.5">
                  {persona.goals.map((goal, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Channels */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Where to Reach Them</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {persona.channels.map((channel) => (
                    <Badge key={channel} variant="outline" className="text-xs">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

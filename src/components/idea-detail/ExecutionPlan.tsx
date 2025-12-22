import { Calendar, CheckCircle2, Clock, Rocket } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import type { Playbook } from "../../data/ideas"

interface ExecutionPlanProps {
  playbook: Playbook
  timeToMVP: string
}

const phases = [
  {
    key: "week1to4" as const,
    title: "Foundation",
    weeks: "Week 1-4",
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800"
  },
  {
    key: "week5to8" as const,
    title: "Build",
    weeks: "Week 5-8",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  {
    key: "week9to12" as const,
    title: "Launch",
    weeks: "Week 9-12",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800"
  },
]

export function ExecutionPlan({ playbook, timeToMVP }: ExecutionPlanProps) {
  if (!playbook) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Execution plan coming soon...
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">90-Day Launch Playbook</h3>
        </div>
        <Badge className="gap-1 bg-gradient-to-r from-purple-500 to-indigo-500">
          <Clock className="h-3 w-3" />
          {timeToMVP} to MVP
        </Badge>
      </div>

      {/* Timeline Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full" />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">Day 1</span>
          <span className="text-xs text-muted-foreground">Day 30</span>
          <span className="text-xs text-muted-foreground">Day 60</span>
          <span className="text-xs text-muted-foreground">Day 90</span>
        </div>
      </div>

      {/* Phase Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {phases.map((phase, phaseIndex) => (
          <Card key={phase.key} className={`${phase.bgColor} ${phase.borderColor} border`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge className={`bg-gradient-to-r ${phase.color} text-white border-0`}>
                  {phase.weeks}
                </Badge>
                {phaseIndex === 2 && <Rocket className="h-4 w-4 text-green-500" />}
              </div>
              <CardTitle className="text-base">{phase.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {playbook[phase.key].map((task, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{task}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium">Ready to Execute?</p>
              <p className="text-sm text-muted-foreground">
                Follow this playbook to go from idea to MVP in {timeToMVP}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

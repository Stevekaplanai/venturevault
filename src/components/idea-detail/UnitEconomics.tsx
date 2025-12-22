import { DollarSign, TrendingUp, Clock, PieChart, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import type { UnitEconomics as UnitEconomicsType } from "../../data/ideas"

interface UnitEconomicsProps {
  unitEconomics: UnitEconomicsType
  potentialRevenue: string
  initialInvestment: string
}

export function UnitEconomics({ unitEconomics, potentialRevenue, initialInvestment }: UnitEconomicsProps) {
  if (!unitEconomics) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Unit economics coming soon...
        </CardContent>
      </Card>
    )
  }

  const metrics = [
    {
      label: "Customer Acquisition Cost",
      value: unitEconomics.cacEstimate,
      icon: DollarSign,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      description: "Cost to acquire one customer"
    },
    {
      label: "Lifetime Value",
      value: unitEconomics.ltvEstimate,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      description: "Revenue per customer over lifetime"
    },
    {
      label: "Payback Period",
      value: unitEconomics.paybackPeriod,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      description: "Time to recover CAC"
    },
    {
      label: "Gross Margin",
      value: unitEconomics.grossMargin,
      icon: PieChart,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      description: "Revenue minus direct costs"
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-semibold">Unit Economics</h3>
        <Badge variant="outline" className="ml-2">
          {potentialRevenue} potential
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {metrics.map((metric) => (
          <Card key={metric.label} className={metric.bgColor}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-lg ${metric.bgColor} flex items-center justify-center border`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-xl font-bold mt-1">{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* LTV:CAC Visual */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            LTV:CAC Ratio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  CAC
                </Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  LTV
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                A healthy SaaS business targets 3:1 or higher LTV:CAC ratio.
                Payback period of {unitEconomics.paybackPeriod} indicates good unit economics.
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-600">Healthy</p>
              <p className="text-xs text-muted-foreground">Unit Economics</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Summary */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Initial Investment Required</p>
              <p className="text-xl font-bold">{initialInvestment}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Revenue Potential</p>
              <p className="text-xl font-bold text-green-600">{potentialRevenue}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

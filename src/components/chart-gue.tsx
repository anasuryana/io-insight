"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,

} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
const chartData = [
  { month: "January", ng: 186, retry: 80 },
  { month: "February", ng: 305, retry: 200 },
  { month: "March", ng: 237, retry: 120 },
  { month: "April", ng: 73, retry: 190 },
  { month: "May", ng: 209, retry: 130 },
  { month: "June", ng: 214, retry: 140 },
]

const chartConfig = {
  ng: {
    label: "NG",
    color: "red",
  },
  retry: {
    label: "Retry",
    color: "yellow",
  },
} satisfies ChartConfig

export default function ChartGue() {
  return (
    // Card utama: fleksibel + tinggi minimum biar aman di layar kecil
    <Card className="flex flex-col flex-grow h-full min-h-[240px]">
      <CardContent className="flex-grow p-0 min-h-0 overflow-hidden">

        {/* Wrapper chart: pakai min-h agar tetap muncul di mobile */}
        <div className="w-full h-full min-h-[240px]">
          <ChartContainer
            config={chartConfig}
            className="w-full h-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                textAnchor="end"
                interval={1}
                className="text-[10px] sm:text-xs"
              />
              <YAxis axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="ng" fill="var(--color-ng)" radius={4} />
              <Bar dataKey="retry" fill="var(--color-retry)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

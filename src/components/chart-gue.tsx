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

// const chartData = [
//   { time: "January", ng: 186, retry: 80 },
//   { time: "February", ng: 305, retry: 200 },
//   { time: "March", ng: 237, retry: 120 },
//   { time: "April", ng: 73, retry: 190 },
//   { time: "May", ng: 209, retry: 130 },
//   { time: "June", ng: 214, retry: 140 },
// ]

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

export default function ChartGue({ theData, lineData }: any) {
  const maxY = Math.max(
    ...theData.map((item: { ng: number; retry: number }) =>
      Math.max(item.ng ?? 0, item.retry ?? 0)
    )
  )
  return (
    // Card utama: fleksibel + tinggi minimum biar aman di layar kecil
    <Card className="flex flex-col flex-grow h-full min-h-[240px]">
      <CardContent className="flex-grow p-0 min-h-0 overflow-hidden">

        {/* Wrapper chart: pakai min-h agar tetap muncul di mobile */}
        <div className="w-full h-full min-h-[240px] relative">

          <ChartContainer
            config={chartConfig}
            className="w-full h-full"
          >
            <BarChart
              accessibilityLayer
              data={theData}
              margin={{ top: 30, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={true}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.substring(0, 7)}
                textAnchor="end"
                interval={0}
                className="text-[10px] sm:text-xs"
              />
              <YAxis 
                axisLine={false}
                domain={[0, maxY]}/>
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="ng" fill="var(--color-ng)" radius={4} />
              <Bar dataKey="retry" fill="var(--color-retry)" radius={4} />
            </BarChart>
          </ChartContainer>
          {lineData.isDataExist != '1' && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
              <span className="text-6xl font-semibold text-gray-500">N/A</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

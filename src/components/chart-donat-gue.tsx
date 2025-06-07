"use client"


import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,

} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A donut chart"

const chartData = [
    { browser: "ng", visitors: 275, fill: "red" },
    { browser: "retry", visitors: 200, fill: "yellow" },
    { browser: "good", visitors: 187, fill: "green" },
]

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    ng: {
        label: "NG",
        color: "red",
    },
    retry: {
        label: "Retry",
        color: "yellow",
    },
    good: {
        label: "Good",
        color: "green",
    },

} satisfies ChartConfig

export default function ChartDonatGue() {
    return (
        <Card className="flex flex-col flex-grow h-full min-h-[240px]">
            <CardContent className="flex-grow p-0 min-h-0 overflow-hidden">
                <div className="w-full h-full min-h-[240px]">

                    <ChartContainer
                        config={chartConfig}
                        className="w-full h-full"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="visitors"
                                nameKey="browser"
                                innerRadius={60}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </PieChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}

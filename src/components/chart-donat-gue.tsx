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
    { browser: "ng", visitors: 0, fill: "red" },
    { browser: "retry", visitors: 0, fill: "yellow" },
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


} satisfies ChartConfig

export default function ChartDonatGue({ theData, lineData }: any) {

    chartData[0].visitors = theData.reduce((total: any, item: any) => Number(total) + Number(item.ng), 0)
    chartData[1].visitors = theData.reduce((total: any, item: any) => Number(total) + Number(item.retry), 0)

    return (
        <Card className="flex flex-col flex-grow h-full min-h-[240px]">
            <CardContent className="flex-grow p-0 min-h-0 overflow-hidden">
                <div className="w-full h-full min-h-[240px] relative">

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

import ChartDonatGue from "@/components/chart-donat-gue"
import ChartGue from "@/components/chart-gue"
import { Badge } from "@/components/ui/badge"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"
import {
    SidebarTrigger,
} from "@/components/ui/sidebar"
import axios from "axios"
import { CalendarDays, ChartColumn, Settings } from "lucide-react"
import { useEffect, useState } from "react"


export function Page() {
    const [chartData, setChartData] = useState([
        { time: "January", ng: 186, retry: 80 },
        { time: "February", ng: 305, retry: 200 },
        { time: "March", ng: 237, retry: 120 },
        { time: "April", ng: 73, retry: 190 },
        { time: "May", ng: 209, retry: 130 },
        { time: "June", ng: 214, retry: 140 },
    ])

    const totalNg = chartData.reduce((total, item) => Number(total) + Number(item.ng), 0)
    const totalRetry = chartData.reduce((total, item) => Number(total) + Number(item.retry), 0)

    useEffect(() => {
        const fetchData = () => {
            axios
                .get(import.meta.env.VITE_APP_ENDPOINT + '/report/chart1', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {
                    const data = response.data.data
                    setChartData(data)
                }).catch(error => {
                    console.log(error)
                })
        }
        fetchData()

        const interval = setInterval(fetchData, 60000); // ⏱️ refresh tiap 60 detik

        return () => clearInterval(interval); // 🧹 bersihkan saat komponen unmount
    }, [])

    return (
        <>
            {/* Layout utama: full height layar, tanpa scroll luar */}
            <div className="bg-gray-100 h-screen flex flex-col overflow-hidden">

                {/* Header tetap tinggi 64px */}
                <header className="flex h-13 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="md:block">
                                <BreadcrumbLink href="#">Welcome</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                {/* Kontainer isi utama (card + chart): fleksibel & scrollable */}
                <div className="container mx-auto p-2 flex-grow flex flex-col overflow-auto min-h-0">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-1 flex-shrink-0 text-neutral-400">
                        <div className="rounded-lg p-1 flex items-center space-x-4"><Settings /> Line : </div>
                        <div className="rounded-lg p-1 flex items-center space-x-4"><CalendarDays /> Time : </div>
                        <div className="rounded-lg p-1 flex items-center space-x-4"><ChartColumn /> Status : <Badge style={{ background: 'yellow', color: 'black' }}>Retry</Badge></div>
                    </div>

                    {/* Cards section: tinggi fleksibel sesuai isi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-3 flex-shrink-0">
                        {/* Not Good Card */}
                        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4">
                            <div className="text-red-500 text-3xl">❌</div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Not Good (NG)</h3>
                                <p className="text-3xl font-bold text-gray-900">{totalNg}</p>
                                <a href="#" className="text-blue-500 text-sm">Details</a>
                            </div>
                        </div>

                        {/* Retry Card */}
                        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4">
                            <div className="text-yellow-500 text-3xl">⚠️</div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Retry</h3>
                                <p className="text-3xl font-bold text-gray-900">{totalRetry}</p>
                                <a href="#" className="text-blue-500 text-sm">Details</a>
                            </div>
                        </div>


                    </div>

                    {/* Charts section: ambil sisa ruang + tidak overflow */}
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-5 min-h-0">

                        {/* Donut Chart (kosong dulu) */}
                        <div className=" md:col-span-1 flex flex-col min-h-[300px]">
                            <ChartDonatGue theData={chartData} />
                        </div>

                        {/* Bar Chart */}
                        <div className=" md:col-span-2 flex flex-col min-h-0">
                            <ChartGue theData={chartData} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


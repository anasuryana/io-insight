import { AppSidebar } from "@/components/app-sidebar"
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
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { CalendarDays, ChartColumn, Settings } from "lucide-react"

export default function Page() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        {/* Layout utama: full height layar, tanpa scroll luar */}
        <div className="bg-gray-100 h-screen flex flex-col overflow-hidden">

          {/* Header tetap tinggi 64px */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-3 flex-shrink-0">
              {/* Not Good Card */}
              <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4">
                <div className="text-red-500 text-3xl">❌</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Not Good (NG)</h3>
                  <p className="text-3xl font-bold text-gray-900">100</p>
                  <a href="#" className="text-blue-500 text-sm">Details</a>
                </div>
              </div>

              {/* Retry Card */}
              <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4">
                <div className="text-yellow-500 text-3xl">⚠️</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Retry</h3>
                  <p className="text-3xl font-bold text-gray-900">30</p>
                  <a href="#" className="text-blue-500 text-sm">Details</a>
                </div>
              </div>

              {/* Good Card */}
              <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4">
                <div className="text-green-500 text-3xl">✅</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Good</h3>
                  <p className="text-3xl font-bold text-gray-900">150</p>
                  <a href="#" className="text-blue-500 text-sm">Details</a>
                </div>
              </div>
            </div>

            {/* Charts section: ambil sisa ruang + tidak overflow */}
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-5 min-h-0">

              {/* Donut Chart (kosong dulu) */}
              <div className=" md:col-span-1 flex flex-col min-h-[300px]">
                <ChartDonatGue />
                {/* cinta <br />
                cinta <br />
                cinta <br />
                cinta <br />
                cinta <br />
                cinta <br /> */}


              </div>

              {/* Bar Chart */}
              <div className=" md:col-span-2 flex flex-col min-h-0">
                <ChartGue />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

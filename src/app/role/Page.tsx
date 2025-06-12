import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"

import { Separator } from "@/components/ui/separator"
import {
    SidebarTrigger,
} from "@/components/ui/sidebar"


export function Page() {
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
                                <BreadcrumbLink href="#">Role Management</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                {/* Kontainer isi utama (card + chart): fleksibel & scrollable */}
                <div className="container mx-auto p-2 flex-grow flex flex-col overflow-auto min-h-0">

                    {/* Cards section: tinggi fleksibel sesuai isi */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-5 mb-3 flex-shrink-0">
                        {/* Not Good Card */}
                        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4">
                            <Button size='sm'>New Role</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


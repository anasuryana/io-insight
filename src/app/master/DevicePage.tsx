import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DeviceAddDialog from "./DeviceAddDialog";
import DeviceEditDialog from "./DeviceEditDialog";
import { Pencil, Trash2, CirclePlusIcon} from "lucide-react"

export default function DevicePage() {
    const [rowData, setRowData] = useState<{ data: any[] }>({ data: [] })
    const [rowDataSelected, setRowDataSelected] = useState<any>({})
    const [pageAt, setPageAt] = useState<number>(1)
    const [lastPage, setLastPage] = useState<number>(0)
    const [isMaxPage, setIsMaxPage] = useState(false)
    const [showFindModal, setShowFindModal] = useState(false)
    const [showFindModal2, setShowFindModal2] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        goToPage(1)
    }, [])

    function getVisiblePages(current: number, total: number): (number | string)[] {
        if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

        const delta = 2;
        const range: (number | string)[] = [];

        for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
            range.push(i);
        }

        if (current - delta > 2) {
            range.unshift("...");
        }

        if (current + delta < total - 1) {
            range.push("...");
        }

        range.unshift(1);
        if (total > 1) range.push(total);

        return range;
    }

    const pages = getVisiblePages(pageAt, lastPage)

    function goToPage(thePage: number) {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        axios.get(import.meta.env.VITE_APP_ENDPOINT + '/device-master?page=' + thePage, config)
            .then((response) => {
                const datanya = response.data.data.data
                setRowData({ data: datanya })
                setLastPage(response.data.data.last_page)
                setPageAt(thePage)
                setIsMaxPage(!response.data.data.next_page_url)
            }).catch(error => {
                setPageAt(0)
                console.log(error)
            })
    }

    const handleDelete = (rowId: string) => {
        if (!rowId) return alert('nothing to be deleted')
        if (!confirm('Are you sure want to DELETE ?')) return

        setIsDeleting(true)
        axios
            .delete(import.meta.env.VITE_APP_ENDPOINT + '/device-master', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('isLoggedIn')
                },
                data: {
                    id: rowId
                }
            })
            .then((response) => {
                setIsDeleting(false)
                goToPage(1)
                toast.success('Server Response', { description: response.data.message })
            }).catch(error => {
                setIsDeleting(false)
                const respon = Object.keys(error.response.data)
                let msg = ''
                for (const item of respon) {
                    msg += `${error.response.data[item]} `
                }
                toast.error('Server Response', { description: msg })
            })
    }

    return (
        <div className="bg-gray-50 h-screen flex flex-col overflow-hidden">
            <header className="flex h-13 shrink-0 items-center gap-2 border-b px-4 bg-white">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="md:block">
                            <BreadcrumbLink href="#">Device Management</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="grid grid-cols-1 m-2">
                <Card className="w-full">
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <h2 className="text-xl font-semibold">Device List</h2>
                            </div>
                            <div className="flex sm:justify-end">
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => setShowFindModal(true)}
                                    className="flex items-center gap-1 hover:bg-green-400"
                                >
                                    <CirclePlusIcon className="w-4 h-4" />
                                    New
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-auto max-h-[60vh] border border-gray-300 rounded mb-3">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10 shadow">
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Tx IP Address</th>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Rx IP Address</th>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Model</th>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Line</th>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="[&>tr:nth-child(even)]:bg-gray-50 [&>tr:hover]:bg-gray-100">
                                    {
                                        rowData.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-4 text-center text-gray-500 italic">
                                                No records found.
                                            </td>
                                        </tr>
                                        ) : (
                                        rowData.data.map((item: any, index) => {
                                            return <tr key={index}>
                                                <td className="px-4 py-2 border border-gray-300">{item.IP_device_tx}</td>
                                                <td className="px-4 py-2 border border-gray-300">{item.IP_device_rx}</td>
                                                <td className="px-4 py-2 border border-gray-300">{item.model}</td>
                                                <td className="px-4 py-2 border border-gray-300">{item.line_name}</td>
                                                <td className="px-4 py-2 border border-gray-300">
                                                    <div className="flex gap-x-2">
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="flex items-center gap-1 hover:bg-blue-400"
                                                            onClick={() => {
                                                                setRowDataSelected(item);
                                                                setShowFindModal2(true);
                                                            }}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="flex items-center gap-1 hover:bg-red-400"
                                                            onClick={() => handleDelete(item.id)}
                                                            disabled={isDeleting}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end mt-2">
                            <div>
                                <div className="inline-flex rounded-md shadow-sm" role="group">
                                    <Button
                                        className="rounded-r-none border-r-0"
                                        disabled={pageAt === 1}
                                        onClick={() => goToPage(pageAt - 1)}
                                    >
                                        Previous
                                    </Button>

                                    {pages.map((page, idx) =>
                                        typeof page === "number" ? (
                                            <Button
                                                key={idx}
                                                className={`rounded-none ${page === pageAt ? "bg-gray-500 text-white" : ""}`}
                                                onClick={() => goToPage(page)}
                                            >
                                                {page}
                                            </Button>
                                        ) : (
                                            <Button key={idx} className="rounded-none cursor-default" disabled>
                                                ...
                                            </Button>
                                        )
                                    )}

                                    <Button
                                        className="rounded-l-none"
                                        disabled={isMaxPage}
                                        onClick={() => goToPage(pageAt + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                            <div className="flex sm:justify-end"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DeviceAddDialog open={showFindModal} onClose={() => { setShowFindModal(false); goToPage(1) }} />
            <DeviceEditDialog open={showFindModal2} onClose={() => { setShowFindModal2(false); goToPage(1) }} selectedRowData={rowDataSelected} />
        </div>
    )
}

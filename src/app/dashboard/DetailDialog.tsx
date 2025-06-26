import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { useEffect, useState } from "react";


interface FindModalProps {
    open: boolean
    onClose: () => void
    selectedRowData: any
}

export default function DetailDialog({ open, onClose, selectedRowData }: FindModalProps) {
    const [rowData, setRowData] = useState<{ data: any[] }>({ data: [] })
    const [pageAt, setPageAt] = useState<Number>(0)

    const [lastPage, setLastPage] = useState<number>(0)
    const [isMaxPage, setIsMaxPage] = useState(false)
    const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

    function goToPage(thePage: Number) {
        const params = new URLSearchParams(selectedRowData).toString()
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        axios.get(import.meta.env.VITE_APP_ENDPOINT + '/report/detail?' + params + '&page=' + thePage, config)
            .then((response) => {

                const datanya = response.data.data.data
                setRowData({
                    data: datanya
                })

                setLastPage(response.data.data.last_page)

                setPageAt(thePage)
                if (!response.data.data.next_page_url) {
                    setIsMaxPage(true)
                } else {
                    setIsMaxPage(false)
                }
            }).catch(error => {
                setPageAt(0)
                console.log(error)
            })
    }

    useEffect(() => {
        if (open) {
            goToPage(1)
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detail</DialogTitle>
                </DialogHeader>

                <div className="overflow-auto max-h-[40vh] border border-gray-300 rounded mb-1">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10 shadow">
                            <tr>
                                <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Date</th>
                                <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Time</th>
                                <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Line Number</th>
                                <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Color</th>
                                <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Qty</th>
                            </tr>
                        </thead>
                        <tbody className="[&>tr:nth-child(even)]:bg-gray-50 [&>tr:hover]:bg-gray-100">
                            {/* Contoh banyak data */}
                            {
                                rowData.data.map((item: any, index) => {
                                    let statusColor = "bg-black"; // default
                                    switch (item.status) {
                                        case 'Green':
                                            statusColor = "bg-green-500"
                                            break;
                                        case 'Yellow':
                                            statusColor = "bg-yellow-500"
                                            break;
                                        case 'Red':
                                            statusColor = "bg-red-500"
                                            break;

                                    }

                                    return <tr key={index}>
                                        <td className="px-4 py-2 border border-gray-300 text-center">{item.date}</td>
                                        <td className="px-4 py-2 border border-gray-300 text-center">{item.time}</td>
                                        <td className="px-4 py-2 border border-gray-300 text-center">{item.line_name}</td>
                                        <td className="px-4 py-2 border border-gray-300 text-center">
                                            <div className={`w-5 h-5 rounded-full ${statusColor} mx-auto`} />
                                        </td>
                                        <td className="px-4 py-2 border border-gray-300 text-center">{item.qty}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-1">
                    <div>

                    </div>
                    <div className="flex sm:justify-end">
                        <div className="inline-flex rounded-md shadow-sm" role="group">
                            <Button className="rounded-r-none border-r-0" disabled={pageAt == 1 ? true : false} onClick={() => goToPage(Number(pageAt) - 1)}>Previous</Button>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    className={page === pageAt ? 'bg-gray-500 rounded-none' : 'rounded-none'}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                            <Button className="rounded-l-none" disabled={isMaxPage ? true : false} onClick={() => goToPage(Number(pageAt) + 1)}>Next</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )
}
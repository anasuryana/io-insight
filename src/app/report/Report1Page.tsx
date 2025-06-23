import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";


export default function Report1Page() {
    const [formData, setFormData] = useState({
        dateFrom: "",
        dateTo: "",
    })
    const [rowData, setRowData] = useState<{ data: any[] }>({ data: [] })
    const [pageAt, setPageAt] = useState<Number>(0)
    const [isMaxPage, setIsMaxPage] = useState(false)
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        goToPage(1)
    }, [])

    function handleChange(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    function goToPage(thePage: Number) {
        const params = new URLSearchParams(formData).toString()
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        setIsSearching(true)
        axios.get(import.meta.env.VITE_APP_ENDPOINT + '/report/report1?' + params + '&page=' + thePage, config)
            .then((response) => {
                setIsSearching(false)
                const datanya = response.data.data.data
                setRowData({
                    data: datanya
                })

                setPageAt(thePage)
                if (!response.data.data.next_page_url) {
                    setIsMaxPage(true)
                } else {
                    setIsMaxPage(false)
                }
            }).catch(error => {
                setIsSearching(false)
                setPageAt(0)
                console.log(error)
            })
    }

    return (
        <div>
            <header className="flex h-13 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="md:block">
                            <BreadcrumbLink href="#">Report</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 m-2 gap-3">
                <Card className="w-full p-1 !gap-1">
                    <CardContent className="p-1">
                        <div className="p-1 flex items-center space-x-4">
                            <div className="text-red-500 text-3xl">❌</div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Not Good (NG)</h3>
                                <p className="text-3xl font-bold text-gray-900">{0}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-gray-200 !py-1">
                        <p><a href="#" className="text-blue-500 text-sm">Details</a></p>
                    </CardFooter>
                </Card>
                <Card className="w-full p-1 !gap-1">
                    <CardContent className="p-1">
                        <div className="p-1 flex items-center space-x-4">
                            <div className="text-red-500 text-3xl">⚠️</div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Retry</h3>
                                <p className="text-3xl font-bold text-gray-900">{0}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-gray-200 !py-1">
                        <p><a href="#" className="text-blue-500 text-sm">Details</a></p>
                    </CardFooter>
                </Card>
            </div>

            <div className="grid grid-cols-1 m-2">
                <Card className="w-full">
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-1">
                            <div>
                                <Input type="date" onChange={handleChange} name="dateFrom" />
                            </div>
                            <div>
                                <Input type="date" onChange={handleChange} name="dateTo" />
                            </div>
                            <div>
                                <Button variant="default" size={'sm'} onClick={() => goToPage(1)} disabled={isSearching}><Search /> Find</Button>
                            </div>
                        </div>

                        <div className="overflow-auto max-h-[40vh] border border-gray-300 rounded mb-1">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10 shadow">
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">#</th>
                                        <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Date</th>
                                        <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Time</th>
                                        <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Line Number</th>
                                        <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Color</th>
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
                                                <td className="px-4 py-2 border border-gray-300 text-center">{(index + 1)}</td>
                                                <td className="px-4 py-2 border border-gray-300 text-center">{item.date}</td>
                                                <td className="px-4 py-2 border border-gray-300 text-center">{item.time}</td>
                                                <td className="px-4 py-2 border border-gray-300 text-center">{item.line_name}</td>
                                                <td className="px-4 py-2 border border-gray-300 text-center">
                                                    <div className={`w-5 h-5 rounded-full ${statusColor} mx-auto`} />
                                                </td>
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
                                    <Button className="rounded-l-none" disabled={isMaxPage ? true : false} onClick={() => goToPage(Number(pageAt) + 1)}>Next</Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                </Card>
            </div>
        </div>

    )
}
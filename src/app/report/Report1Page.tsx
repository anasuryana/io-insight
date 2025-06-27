import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import { FileSpreadsheet, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


export default function Report1Page() {
    const [formData, setFormData] = useState({
        dateFrom: "",
        dateTo: "",
    })
    const [rowData, setRowData] = useState<{ data: any[] }>({ data: [] })
    const [pageAt, setPageAt] = useState<number>(1)
    const [lastPage, setLastPage] = useState<number>(0)
    const [resumeNG, setResumeNG] = useState<Number>(0)
    const [resumeRetry, setResumeRetry] = useState<Number>(0)
    const [isMaxPage, setIsMaxPage] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const pages: (number | string)[] = getVisiblePages(pageAt, lastPage);

    function handleChange(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    function getVisiblePages(current: number, total: number): (number | string)[] {
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
    
    function goToPage(thePage: number) {
        const params = new URLSearchParams(formData).toString();
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        setIsSearching(true);
        axios
        .get(`${import.meta.env.VITE_APP_ENDPOINT}/report/report1?${params}&page=${thePage}`, config)
        .then((response) => {
            setIsSearching(false);
            const datanya = response.data.data.data;
            setRowData({ data: datanya });
            setResumeNG(response.data.dataStatus.ng);
            setResumeRetry(response.data.dataStatus.retry);
            setLastPage(response.data.data.last_page);
            setPageAt(thePage);
            setIsMaxPage(!response.data.data.next_page_url);
            window.scrollTo({ top: 0, behavior: "smooth" }); // optional scroll to top
        })
        .catch((error) => {
            setIsSearching(false);
            setPageAt(0);
            console.log(error);
        });
    }

    const saveBlob = (function () {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute('style', "display: none");
        return function (blob: any, fileName: any) {
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());

    function handleClickExport() {
        if (!formData.dateFrom || !formData.dateTo) {
            toast.warning('Validation', { description: `Please select date range` })
            return
        }
        if (confirm('Are you sure want to export the data ?')) {
            const params = new URLSearchParams(formData).toString()
            setIsExporting(true)
            axios({
                url: import.meta.env.VITE_APP_ENDPOINT + '/report/report1-to-spreadsheet?' + params,
                method: 'GET',
                responseType: 'blob',
            }).then(response => {
                setIsExporting(false)
                saveBlob(response.data, `Logs from ${formData.dateFrom} to ${formData.dateTo} .csv`)
            }).catch(error => {
                console.log(error)
                setIsExporting(false)
            })
        }
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
                                <p className="text-3xl font-bold text-gray-900">{resumeNG.toString()}</p>
                            </div>
                        </div>
                    </CardContent>

                </Card>
                <Card className="w-full p-1 !gap-1">
                    <CardContent className="p-1">
                        <div className="p-1 flex items-center space-x-4">
                            <div className="text-red-500 text-3xl">⚠️</div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Retry</h3>
                                <p className="text-3xl font-bold text-gray-900">{resumeRetry.toString()}</p>
                            </div>
                        </div>
                    </CardContent>

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
                                <div className="flex gap-x-2">
                                    <Button variant="default" size={'sm'} onClick={() => {
                                        if (!formData.dateFrom || !formData.dateTo) {
                                            toast.warning('Validation', { description: `Please select date` })
                                            return
                                        }
                                        goToPage(1)
                                    }} disabled={isSearching}><Search /> Find</Button>
                                    <Button variant="success" size={'sm'} disabled={isExporting} onClick={handleClickExport}><FileSpreadsheet /> Export</Button>
                                </div>
                            </div>
                        </div>

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
                        </div>
                    </CardContent>

                </Card>
            </div>
        </div>

    )
}
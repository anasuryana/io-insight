import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import { FileSpreadsheet, Search, TriangleAlert, XOctagon } from "lucide-react";
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
                saveBlob(response.data, `Logs from ${formData.dateFrom} to ${formData.dateTo} .xlsx`)
            }).catch(error => {
                console.log(error)
                setIsExporting(false)
            })
        }
    }

    return (
        <div className="bg-gray-50 h-screen flex flex-col overflow-hidden">
            <header className="flex h-13 shrink-0 items-center gap-2 border-b px-4 bg-white">
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

            <div className="grid grid-cols-1 md:grid-cols-2 m-2 gap-3 mt-3 mb-1">
                <div className="bg-white border-red-500 border-l-6 rounded-lg shadow p-4 flex items-center space-x-4">
                    <XOctagon className="text-red-500 w-16 h-16" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Not Good (NG)</h3>
                        <p className="text-3xl font-bold text-gray-900">{resumeNG.toString()}</p>
                    </div>
                </div>
                <div className="bg-white border-yellow-300 border-l-6 rounded-lg shadow p-4 flex items-center space-x-4">
                    <TriangleAlert className="text-yellow-300 w-16 h-16" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Retry</h3>
                        <p className="text-3xl font-bold text-gray-900">{resumeRetry.toString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 m-2">
                <Card className="w-full">
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <h2 className="text-xl font-semibold">Historical Data</h2>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-end gap-4 mb-3">
                            <div className="flex flex-col">
                                <label htmlFor="dateFrom" className="mb-1 text-sm font-medium text-gray-700">Date From</label>
                                <Input type="date" onChange={handleChange} name="dateFrom" />
                            </div>
                            <div>
                                <label htmlFor="dateTo" className="mb-1 text-sm font-medium text-gray-700">Date To</label>
                                <Input type="date" onChange={handleChange} name="dateTo" />
                            </div>
                            <div>
                                <div className="flex gap-x-2">
                                    <Button variant="default" size={'sm'} className="flex items-center gap-1" onClick={() => {
                                        if (!formData.dateFrom || !formData.dateTo) {
                                            toast.warning('Validation', { description: `Please select date` })
                                            return
                                        }
                                        goToPage(1)
                                    }} disabled={isSearching}><Search /> Find</Button>
                                    <Button variant="success" size={'sm'} disabled={isExporting} className="flex items-center gap-1" onClick={handleClickExport}><FileSpreadsheet /> Export</Button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-auto max-h-[50vh] border border-gray-300 rounded mb-3">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10 shadow">
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Date</th>
                                        <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Time</th>
                                        <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Line Name</th>
                                        <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Qty Red</th>
                                        <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Qty Yellow</th>
                                        <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Qty Green</th>
                                        <th className="px-4 py-2 border border-gray-300 text-center bg-gray-100">Qty Off</th>
                                    </tr>
                                </thead>
                                <tbody className="[&>tr:nth-child(even)]:bg-gray-50 [&>tr:hover]:bg-gray-100">
                                    {/* Contoh banyak data */}
                                    {
                                        rowData.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-4 text-center text-gray-500 italic">
                                                    No records found. Please select a date range.
                                                </td>
                                            </tr>
                                        ) : (
                                        rowData.data.map((item: any, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="px-4 py-2 border border-gray-300 text-center">{item.date}</td>
                                                    <td className="px-4 py-2 border border-gray-300 text-center">{item.time}</td>
                                                    <td className="px-4 py-2 border border-gray-300 text-center">{item.line_name}</td>
                                                    <td className="px-4 py-2 border border-gray-300 text-center">
                                                        <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto">
                                                            {item.qty_red}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 border border-gray-300 text-center">
                                                        <span className="w-6 h-6 rounded-full bg-yellow-400 text-black flex items-center justify-center mx-auto">
                                                            {item.qty_yellow}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 border border-gray-300 text-center">
                                                        <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">
                                                            {item.qty_green}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 border border-gray-300 text-center">
                                                        <span className="w-6 h-6 rounded-full bg-gray-500 text-white flex items-center justify-center mx-auto">
                                                            {item.qty_off}
                                                        </span>
                                                    </td>
                                                </tr>
                                                )
                                            })
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end mt-2">
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
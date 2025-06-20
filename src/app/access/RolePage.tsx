import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RoleAddDialog from "./RoleAddDialog";
import RoleEditDialog from "./RoleEditDialog";

export default function RolePage() {
    const [rowData, setRowData] = useState<{ data: any[] }>({ data: [] })
    const [rowDataSelected, setRowDataSelected] = useState<{ data: any[] }>({ data: [] })
    const [pageAt, setPageAt] = useState<Number>(0)
    const [isMaxPage, setIsMaxPage] = useState(false)

    useEffect(() => {
        goToPage(1)
    }, [])

    function goToPage(thePage: Number) {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        axios.get(import.meta.env.VITE_APP_ENDPOINT + '/role-access?page=' + thePage, config)
            .then((response) => {
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
                setPageAt(0)
                console.log(error)
            })
    }

    const [showFindModal, setShowFindModal] = useState(false)
    const [showFindModal2, setShowFindModal2] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = (rowId: string) => {
        if (!rowId) {
            alert('nothing to be deleted')
            return
        }
        if (!confirm('Are you sure want to DELETE ?')) {
            return
        }

        setIsDeleting(true)
        axios
            .delete(import.meta.env.VITE_APP_ENDPOINT + '/role-access', {
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
                    msg += `${error.response.data[item]}`
                }
                toast.error('Server Response', { description: msg })
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
                            <BreadcrumbLink href="#">Role Management</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="grid grid-cols-1 m-2">
                <Card className="w-full">
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <h2 className="text-xl font-semibold">Role List</h2>
                            </div>
                            <div className="flex sm:justify-end">
                                <Button variant="default" size={'sm'} onClick={() => setShowFindModal(true)}>New</Button>
                            </div>
                        </div>

                        <div className="overflow-auto max-h-[57vh] border border-gray-300 rounded mb-3">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10 shadow">
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Name</th>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Created At</th>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Updated At</th>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="[&>tr:nth-child(even)]:bg-gray-50 [&>tr:hover]:bg-gray-100">
                                    {/* Contoh banyak data */}
                                    {
                                        rowData.data.map((item: any, index) => {
                                            return <tr key={index}>
                                                <td className="px-4 py-2 border border-gray-300">{item.name}</td>
                                                <td className="px-4 py-2 border border-gray-300">{item.created_at}</td>
                                                <td className="px-4 py-2 border border-gray-300">{item.updated_at}</td>
                                                <td className="px-4 py-2 border border-gray-300">
                                                    <div className="flex gap-x-2">
                                                        <Button variant={'success'} size={'sm'} onClick={() => {
                                                            setRowDataSelected(item)
                                                            setShowFindModal2(true)
                                                        }}>Edit</Button>
                                                        <Button variant={'destructive'} size={'sm'} onClick={() => handleDelete(item.id)} disabled={isDeleting}>Delete</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <div className="inline-flex rounded-md shadow-sm" role="group">
                                    <Button className="rounded-r-none border-r-0" disabled={pageAt == 1 ? true : false} onClick={() => goToPage(Number(pageAt) - 1)}>Previous</Button>
                                    <Button className="rounded-l-none" disabled={isMaxPage ? true : false} onClick={() => goToPage(Number(pageAt) + 1)}>Next</Button>
                                </div>
                            </div>
                            <div className="flex sm:justify-end">

                            </div>
                        </div>
                    </CardContent>

                </Card>
            </div>

            <RoleAddDialog open={showFindModal} onClose={() => { setShowFindModal(false); goToPage(1) }} />
            <RoleEditDialog open={showFindModal2} onClose={() => { setShowFindModal2(false); goToPage(1) }} selectedRowData={rowDataSelected} />
        </div>

    )
}
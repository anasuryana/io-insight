import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UserAddDialog from "./UserAddDialog";
import UserEditDialog from "./UserEditPage";

export default function UserPage() {
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

        axios.get(import.meta.env.VITE_APP_ENDPOINT + '/user-access?page=' + thePage, config)
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

    function handleClickSwitch(currentVal: { currentStatus: string, rowData: { id: Number }, theIndex: Number }) {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        axios.put(import.meta.env.VITE_APP_ENDPOINT + '/user-access/activation',
            { id: currentVal.rowData.id, active: currentVal.currentStatus == '1' ? '0' : '1' }, config)
            .then((response) => {
                const firstCondition = currentVal.currentStatus == '1' ? 'Active' : 'Inactive'
                const secondCondition = currentVal.currentStatus == '1' ? 'Inactive' : 'Active'
                toast(response.data.message, {
                    description: `from ${firstCondition} to ${secondCondition}`
                })
                const theChecekedDate = new Date().toISOString().replace('T', ' ').replace('Z', '')
                const nextRow = rowData.data.map((item: any, index) => {
                    if (index == currentVal.theIndex) {
                        return {
                            ...item, updated_at: theChecekedDate, active: currentVal.currentStatus == '1' ? '0' : '1'
                        }
                    } else {
                        return item
                    }
                })
                setRowData({
                    data: nextRow
                })
            }).catch(error => {
                alert(error)
                alert(error.response.data.message)
            })

    }

    const [showFindModal, setShowFindModal] = useState(false)
    const [showFindModal2, setShowFindModal2] = useState(false)

    return (
        <div>
            <header className="flex h-13 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="md:block">
                            <BreadcrumbLink href="#">User Management</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="grid grid-cols-1 m-2">
                <Card className="w-full">
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <h2 className="text-xl font-semibold">User List</h2>
                            </div>
                            <div className="flex sm:justify-end">
                                <Button variant="default" size={'sm'} onClick={() => setShowFindModal(true)}>New</Button>
                            </div>
                        </div>

                        <div className="overflow-auto max-h-[57vh] border border-gray-300 rounded mb-3">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10 shadow">
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Activation</th>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Username</th>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Role</th>
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
                                                <td className="px-4 py-2 border border-gray-300">
                                                    <Switch checked={item.active == '1' ? true : false} onClick={() => {
                                                        handleClickSwitch({
                                                            currentStatus: item.active,
                                                            rowData: { id: item.id }, theIndex: index
                                                        })
                                                    }} /></td>
                                                <td className="px-4 py-2 border border-gray-300">{item.nick_name}</td>
                                                <td className="px-4 py-2 border border-gray-300">{item.role_name}</td>
                                                <td className="px-4 py-2 border border-gray-300">{item.created_at}</td>
                                                <td className="px-4 py-2 border border-gray-300">{item.updated_at}</td>
                                                <td className="px-4 py-2 border border-gray-300">
                                                    <div className="flex gap-x-2">
                                                        <Button variant={'success'} size={'sm'} onClick={() => {
                                                            setRowDataSelected(item)
                                                            setShowFindModal2(true)
                                                        }}>Edit</Button>
                                                        <Button variant={'destructive'} size={'sm'}>Delete</Button>
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

            <UserAddDialog open={showFindModal} onClose={() => setShowFindModal(false)} />
            <UserEditDialog open={showFindModal2} onClose={() => setShowFindModal2(false)} selectedRowData={rowDataSelected} />
        </div>

    )
}
"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,

} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"

interface FindModalProps {
    open: boolean
    onClose: () => void
    setParentId: any
    setParentName: any
    setParentPhone: any
    setParentStatus: any
    rowData: { data: any[] }
    setRowData: (val: { data: any[] }) => void
}

export default function DialogSMSPage({ open, onClose, setParentId, setParentName, setParentPhone,
    setParentStatus, rowData, setRowData }: FindModalProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [searchBy, setSearchBy] = useState<"name" | "telp_no" | "status">("name")
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = () => {
        setIsSearching(true)

        const params = {
            searchBy: searchBy,
            searchValue: searchTerm
        }
        const paramsUrl = new URLSearchParams(params)
        axios
            .get(import.meta.env.VITE_APP_ENDPOINT + '/sms-master?' + paramsUrl, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                setIsSearching(false)
                const data = response.data.data

                setRowData({ data: data })
            }).catch(error => {
                setIsSearching(false)
                console.log(error)
            })

    }

    const handleSearchByChange = (val: string) => {
        // Mapping ke properti asli dari data
        const map: Record<string, "name" | "telp_no" | "status"> = {
            name: "name",
            telp_no: "telp_no",
            status: "status",
        }

        setSearchBy(map[val])
    }

    const handleOnRowClick = (valPassed: any) => {
        setParentName(valPassed.name)
        setParentId(valPassed.id)
        setParentPhone(valPassed.telp_no)
        setParentStatus(valPassed.status)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Find</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex flex-col items-center gap-2 md:flex-row">
                        <Select value={searchBy.toLowerCase()} onValueChange={handleSearchByChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Search by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="phone">Phone Number</SelectItem>
                                <SelectItem value="status">Status</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder="Search value"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <table className="w-full text-sm border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2 text-left">Name</th>
                                <th className="border p-2 text-left">Phone Number</th>
                                <th className="border p-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                isSearching ? <tr>
                                    <td colSpan={4} className="text-center">Please wait</td>
                                </tr> : rowData.data.map((item: any, index) => {
                                    return <tr key={index} onClick={() => handleOnRowClick({
                                        id: item.id_user,
                                        name: item.name,
                                        telp_no: item.telp_no,
                                        status: item.status,
                                    })} className="border hover:bg-gray-100 cursor-pointer transition-colors">
                                        <td className="border">{item.name}</td>
                                        <td className="border">{item.telp_no}</td>
                                        <td className="border">{item.status}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <DialogFooter className="mt-4">
                    <Button onClick={handleSearch} disabled={isSearching}>Search</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

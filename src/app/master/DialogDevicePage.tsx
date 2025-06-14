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
    setParentTXIP: any
    setParentRXIP: any
    setParentModel: any
    setParentLine: any
    rowData: { data: any[] }
    setRowData: (val: { data: any[] }) => void
}

export default function DialogDevicePage({ open, onClose, setParentId, setParentTXIP, setParentRXIP,
    setParentModel, setParentLine, rowData, setRowData }: FindModalProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [searchBy, setSearchBy] = useState<"txIP" | "rxIP" | "model" | "line">("txIP")
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = () => {
        setIsSearching(true)

        const params = {
            searchBy: searchBy,
            searchValue: searchTerm
        }
        const paramsUrl = new URLSearchParams(params)
        axios
            .get(import.meta.env.VITE_APP_ENDPOINT + '/device-master?' + paramsUrl, {
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
        const map: Record<string, "txIP" | "rxIP" | "model" | "line"> = {
            txip: "txIP",
            rxip: "rxIP",
            model: "model",
            line: "line",
        }

        setSearchBy(map[val])
    }

    const handleOnRowClick = (valPassed: any) => {
        setParentTXIP(valPassed.IP_device_tx)
        setParentId(valPassed.id)
        setParentRXIP(valPassed.IP_device_rx)
        setParentModel(valPassed.model)
        setParentLine(valPassed.line_name)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Find Device</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex flex-col items-center gap-2 md:flex-row">
                        <Select value={searchBy.toLowerCase()} onValueChange={handleSearchByChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Search by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="txip">Tx IP</SelectItem>
                                <SelectItem value="rxip">Rx IP</SelectItem>
                                <SelectItem value="model">Model</SelectItem>
                                <SelectItem value="line">Line</SelectItem>
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
                                <th className="border p-2 text-left">Tx IP</th>
                                <th className="border p-2 text-left">Rx IP</th>
                                <th className="border p-2 text-left">Model</th>
                                <th className="border p-2 text-left">Line</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                isSearching ? <tr>
                                    <td colSpan={4} className="text-center">Please wait</td>
                                </tr> : rowData.data.map((item: any, index) => {
                                    return <tr key={index} onClick={() => handleOnRowClick({
                                        id: item.id,
                                        IP_device_tx: item.IP_device_tx,
                                        IP_device_rx: item.IP_device_rx,
                                        model: item.model,
                                        line_name: item.line_name,
                                    })} className="border hover:bg-gray-100 cursor-pointer transition-colors">
                                        <td className="border">{item.IP_device_tx}</td>
                                        <td className="border">{item.IP_device_rx}</td>
                                        <td className="border">{item.model}</td>
                                        <td className="border">{item.line_name}</td>
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

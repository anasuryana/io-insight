import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Separator } from "@/components/ui/separator"
import {
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { useRef, useState } from "react"
import DialogDevicePage from "./DialogDevicePage"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import axios from "axios"


export default function DevicePage() {
    const [rowId, setRowId] = useState("")
    const [txIP, setTxIP] = useState("")
    const [rxIP, setRxIP] = useState("")
    const [model, setModel] = useState("")
    const [line, setLine] = useState("")
    const txIPRef = useRef<HTMLInputElement>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [messageFromServer, setMessageFromServer] = useState('')

    const handleNew = () => {
        setMessageFromServer('')
        setRowId("");
        setTxIP("");
        setRxIP("");
        setModel("");
        setLine("");
        setTimeout(() => {
            txIPRef.current?.focus();
        }, 0);
    };

    const handleSave = () => {
        const datanya = {
            IP_device_tx: txIP,
            IP_device_rx: rxIP,
            model: model,
            line_name: line,
            id: rowId
        }
        if (!rowId) {
            if (!confirm('Are you sure want to save ?')) {
                return
            }
            setIsSaving(true)
            axios
                .post(import.meta.env.VITE_APP_ENDPOINT + '/device-master', datanya, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then((response) => {
                    setIsSaving(false)
                    setMessageFromServer('')
                    setRowId("");
                    setTxIP("");
                    setRxIP("");
                    setModel("");
                    setLine("");
                    alert(response.data.message)
                }).catch(error => {
                    setIsSaving(false)

                    const respon = Object.keys(error.response.data)
                    let msg = ''
                    for (const item of respon) {
                        msg += `<p>${error.response.data[item]}</p>`
                    }
                    setMessageFromServer(msg)
                })
        } else {
            if (!confirm('Are you sure want to update ?')) {
                return
            }

            setIsSaving(true)
            axios
                .put(import.meta.env.VITE_APP_ENDPOINT + '/device-master', datanya, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then((response) => {
                    setIsSaving(false)
                    setMessageFromServer('')
                    setRowId("");
                    setTxIP("");
                    setRxIP("");
                    setModel("");
                    setLine("");
                    alert(response.data.message)
                }).catch(error => {
                    setIsSaving(false)

                    const respon = Object.keys(error.response.data)
                    let msg = ''
                    for (const item of respon) {
                        msg += `<p>${error.response.data[item]}</p>`
                    }
                    setMessageFromServer(msg)
                })
        }


    }

    const [showFindModal, setShowFindModal] = useState(false)

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
                                <BreadcrumbLink href="#">Device Master</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                {/* Kontainer isi utama (card + chart): fleksibel & scrollable */}
                <div className="bg-white container mx-auto p-2 flex-grow flex flex-col overflow-auto min-h-0">
                    {/* Cards section: tinggi fleksibel sesuai isi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-1 flex-shrink-0">
                        {/* Not Good Card */}
                        <div className="rounded-lg p-4 flex items-center space-x-4">
                            <Button size='sm' onClick={handleNew}>New</Button>
                            <Button size='sm' onClick={handleSave} disabled={isSaving}>Save</Button>
                            <Button size='sm' onClick={() => setShowFindModal(true)}>Find</Button>
                            <Button size='sm' variant={'destructive'}>Delete</Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-3 flex-shrink-0">
                        <div className="rounded-lg p-2 flex items-center">
                            <div className="grid w-full max-w-sm items-center gap-1">
                                <Label htmlFor="txIP">Tx IP</Label>
                                <Input type="text" id="txIP" placeholder="Tx IP" ref={txIPRef} value={txIP} onChange={(e) => setTxIP(e.target.value)} />
                            </div>
                        </div>
                        <div className="rounded-lg p-2 flex items-center">
                            <div className="grid w-full max-w-sm items-center gap-1">
                                <Label htmlFor="rxIP">Rx IP</Label>
                                <Input type="text" id="rxIP" placeholder="Rx IP" value={rxIP} onChange={(e) => setRxIP(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-3 flex-shrink-0 items-center">
                        <div className="rounded-lg p-2 flex">
                            <div className="grid w-full max-w-sm gap-1">
                                <Label htmlFor="txtModel">Model</Label>
                                <Input type="text" id="txtModel" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} />
                            </div>
                        </div>
                        <div className="rounded-lg p-2 flex">
                            <div className="grid w-full max-w-sm gap-1">
                                <Label htmlFor="txtLine">Line</Label>
                                <Input type="text" id="txtLine" placeholder="Line" value={line} onChange={(e) => setLine(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    {messageFromServer && (<div className="grid grid-cols-1 md:grid-cols-1 gap-1 items-center">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Unable to process your request</AlertTitle>
                            <AlertDescription dangerouslySetInnerHTML={{ __html: messageFromServer }}>

                            </AlertDescription>
                        </Alert>
                    </div>)}
                </div>
            </div>
            <DialogDevicePage open={showFindModal} onClose={() => setShowFindModal(false)}
                setParentId={setRowId} setParentTXIP={setTxIP}
                setParentRXIP={setRxIP} setParentModel={setModel}
                setParentLine={setLine} />
        </>
    )
}


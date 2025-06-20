import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FindModalProps {
    open: boolean
    onClose: () => void
    selectedRowData: any
}

export default function UserEditDialog({ open, onClose, selectedRowData }: FindModalProps) {
    const [status, setStatus] = useState("")
    const [rowData, setRowData] = useState<{ data: any[] }>({ data: [] })
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        role_id: "",
        password: "",
        passwordc: "",
        nick_name: ""
    })

    const handleSearch = () => {

        axios
            .get(import.meta.env.VITE_APP_ENDPOINT + '/role-access/list', {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                const data = response.data.data
                setRowData({ data: data })
                setStatus(selectedRowData.role_id)
            }).catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {

        handleSearch()
        setFormData({
            name: selectedRowData.name || "", // atau pakai `name` tergantung API lo
            role_id: selectedRowData.role_id || "",
            password: "",
            passwordc: "",
            nick_name: selectedRowData.nick_name || ""
        })
    }, [open, selectedRowData])

    const handleSave = () => {
        const datanya = {
            name: formData.name,
            role_id: status,
            password: formData.password,
            nick_name: formData.nick_name
        }

        if (formData.password != formData.passwordc) {
            toast('Validation', {
                description: `please confirm the password`
            })
            return
        }

        if (formData.password.length > 0 || formData.passwordc.length > 0) {
            if (formData.password.length < 8) {
                toast('Validation', {
                    description: `Minimum 8 characters`
                })
                return
            }
        }

        if (!confirm('Are you sure want to save changes ?')) {
            return
        }

        setIsSaving(true)
        axios
            .put(import.meta.env.VITE_APP_ENDPOINT + '/user-access', datanya, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('isLoggedIn')
                },
            })
            .then((response) => {
                setIsSaving(false)
                setFormData({
                    name: "",
                    role_id: "",
                    password: "",
                    passwordc: "",
                    nick_name: ""
                })
                toast.success('Server Response', { description: response.data.message })
            }).catch(error => {
                setIsSaving(false)

                const respon = Object.keys(error.response.data)
                let msg = ''
                for (const item of respon) {
                    msg += `<p>${error.response.data[item]}</p>`
                }
                toast.error('Server Response', { description: msg })
            })
    }

    function handleChangeForm(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 m-2 gap-2">
                    <div>
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" onChange={handleChangeForm} value={formData.name} />
                        </div>
                    </div>
                    <div>
                        <div className="grid gap-3">
                            <Label htmlFor="role-1">Role</Label>
                            <Select name="role-1" value={status} onValueChange={(val) => setStatus(val)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        rowData.data.map((item: any, _) => {
                                            return <SelectItem value={item.id}>{item.name}</SelectItem>
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 m-2 gap-2">
                    <div>
                        <div className="grid gap-3">
                            <Label htmlFor="pw-1">Password</Label>
                            <Input id="pw-1" name="password" type="password" onChange={handleChangeForm} value={formData.password} title="Leave it blank to avoid edit password" />
                        </div>
                    </div>
                    <div>
                        <div className="grid gap-3">
                            <Label htmlFor="pw-2">Confirm Password</Label>
                            <Input id="pw-2" name="passwordc" type="password" onChange={handleChangeForm} value={formData.passwordc} title="Leave it blank to avoid edit password" />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave} disabled={isSaving}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}


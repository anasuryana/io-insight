import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useMask } from '@react-input/mask';
import { useState } from "react";
import { toast } from "sonner";

interface FindModalProps {
    open: boolean
    onClose: () => void
}

export default function SMSAddDialog({ open, onClose }: FindModalProps) {
    const inputRef = useMask({
        mask: '+62 ###-####-####',
        replacement: { '#': /\d/ },
    });
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        telp_no: "",
        status: "",
    })
    const [status, setStatus] = useState("")

    const handleSave = () => {
        const datanya = {
            name: formData.name,
            telp_no: formData.telp_no,
            status: status,
        }

        if (!confirm('Are you sure want to save ?')) {
            return
        }

        setIsSaving(true)
        axios
            .post(import.meta.env.VITE_APP_ENDPOINT + '/sms-master', datanya, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('isLoggedIn')
                },
            })
            .then((response) => {
                setIsSaving(false)
                setFormData({
                    name: "",
                    telp_no: "",
                    status: "",
                })
                toast.success('Server Response', { description: response.data.message })
            }).catch(error => {
                setIsSaving(false)

                const respon = Object.keys(error.response.data)
                let msg = ''
                for (const item of respon) {
                    msg += `${error.response.data[item]}`
                }
                toast.error('Server Response', { description: msg })
            })
    }

    function handleChangeForm(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    function handleChangeSelect(e: any) {
        setStatus(e)
        console.log({ wayahna: e })
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Register New SMS Account</DialogTitle>
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
                            <Label htmlFor="name-2">Phone</Label>
                            <Input id="name-2" name="telp_no" onChange={handleChangeForm} value={formData.telp_no} ref={inputRef} placeholder="852-1848-1513" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 m-2 gap-2">
                    <div>
                        <div className="grid gap-3">
                            <Label htmlFor="role-1">Status</Label>
                            <Select name="status" value={status} onValueChange={(val) => handleChangeSelect(val)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave} disabled={isSaving}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
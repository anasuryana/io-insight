import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FindModalProps {
    open: boolean
    onClose: () => void
    selectedRowData: any
}

export default function RoleEditDialog({ open, onClose, selectedRowData }: FindModalProps) {
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        id: ""
    })



    useEffect(() => {
        setFormData({
            name: selectedRowData.name || "", // atau pakai `name` tergantung API lo                        
            id: selectedRowData.id || "", // atau pakai `name` tergantung API lo                        
        })
    }, [open, selectedRowData])

    const handleSave = () => {
        const datanya = {
            name: formData.name,
            id: formData.id
        }

        if (!confirm('Are you sure want to save changes ?')) {
            return
        }

        setIsSaving(true)
        axios
            .put(import.meta.env.VITE_APP_ENDPOINT + '/role-access', datanya, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('isLoggedIn')
                },
            })
            .then((response) => {
                setIsSaving(false)
                setFormData({
                    name: "",
                    id: ""
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

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Role</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-1 m-2 gap-2">
                    <div>
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" onChange={handleChangeForm} value={formData.name} />
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
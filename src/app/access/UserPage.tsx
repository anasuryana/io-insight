import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@radix-ui/react-separator";

export default function UserPage() {
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
                                <Button variant="default" size={'sm'}>New</Button>
                            </div>
                        </div>

                        <div className="overflow-auto max-h-[57vh] border border-gray-300 rounded mb-3">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10 shadow">
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Nama</th>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Activation</th>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Email</th>
                                        <th className="px-4 py-2 border border-gray-300 text-left bg-gray-100">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="[&>tr:nth-child(even)]:bg-gray-50 [&>tr:hover]:bg-gray-100">
                                    {/* Contoh banyak data */}
                                    {Array.from({ length: 50 }, (_, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-2 border border-gray-300">User {i + 1}</td>
                                            <td className="px-4 py-2 border border-gray-300"><Switch /></td>
                                            <td className="px-4 py-2 border border-gray-300">user{i + 1}@mail.com</td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                <div className="flex gap-x-2">
                                                    <Button variant={'success'} size={'sm'}>Edit</Button>
                                                    <Button variant={'destructive'} size={'sm'}>Delete</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <div className="inline-flex rounded-md shadow-sm" role="group">
                                    <Button className="rounded-r-none border-r-0">Previous</Button>
                                    <Button className="rounded-l-none">Next</Button>
                                </div>
                            </div>
                            <div className="flex sm:justify-end">

                            </div>
                        </div>
                    </CardContent>

                </Card>
            </div>

        </div>

    )
}
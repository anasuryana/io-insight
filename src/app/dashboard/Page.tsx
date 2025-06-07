import { AppSidebar } from "@/components/app-sidebar"

import {
  SidebarInset,
  SidebarProvider,

} from "@/components/ui/sidebar"

import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export default function Page({ onLoggedIn }: { onLoggedIn: any }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn')) {
    } else {
      navigate('/')
    }
  }, [])
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}

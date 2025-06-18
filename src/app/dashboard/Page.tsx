import { AppSidebar } from "@/components/app-sidebar"

import {
  SidebarInset,
  SidebarProvider,

} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner";

import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export default function Page({ userInfo, onLoggedIn }: { onLoggedIn: any, userInfo: any }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn')) {
      onLoggedIn(true)
    } else {
      navigate('/')
      onLoggedIn(false)
    }
  }, [])
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar userInfo={userInfo} />
      <SidebarInset>
        <Outlet />
        <Toaster position="top-center" />
      </SidebarInset>
    </SidebarProvider>
  )
}

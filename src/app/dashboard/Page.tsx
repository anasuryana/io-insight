import { AppSidebar } from "@/components/app-sidebar"

import {
  SidebarInset,
  SidebarProvider,

} from "@/components/ui/sidebar"

import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export default function Page({ userInfo }: { onLoggedIn: any, userInfo: any }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn')) {
    } else {
      navigate('/')
    }
  }, [])
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar userInfo={userInfo} />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}

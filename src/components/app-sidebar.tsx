import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Command,
  File,
  GalleryVerticalEnd,

  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Access Rules",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Role",
          url: "access-role",
        },
        {
          title: "User",
          url: "#",
        },
      ],
    },
    {
      title: "Master",
      url: "#",
      icon: File,
      items: [
        {
          title: "Device",
          url: "master-device",
        },
        {
          title: "SMS",
          url: "master-sms",
        },
      ],
    },
    {
      title: "Logs",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Run",
          url: "#",
        },
      ],
    },
  ]
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  userInfo: any;
};

export function AppSidebar({ userInfo, ...props }: AppSidebarProps) {
  data.user.name = userInfo.name
  data.user.email = userInfo.email
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
              <Link to={"/dashboard"}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">IO Insight</span>
                  <span className="truncate text-xs">Lite</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

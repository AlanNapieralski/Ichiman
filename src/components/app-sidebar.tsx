import * as React from "react"
import {
    BookOpen,
    Code,
    Database,
    FileCode,
    FileText,
    LayoutDashboard,
    LogOut,
    Home,
    Server,
    Terminal,
    Zap,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar"

// This is sample data with added icons
const data = {
    navMain: [
        {
            title: "Main",
            url: "#",
            items: [
                {
                    title: "Dashboard",
                    url: "#",
                    icon: Home,
                },
            ],
        },
        {
            title: "Skills",
            url: "#",
            items: [
                {
                    title: "Programming",
                    url: "#",
                    icon: LayoutDashboard,
                },
                {
                    title: "Volleyball",
                    url: "#",
                    isActive: true,
                    icon: Database,
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader className="flex items-center justify-center p-4">
                {/* Logo instead of version switcher */}
                <div className="flex items-center space-x-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">Ichiman</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                {/* We create a SidebarGroup for each parent with separators between them */}
                {data.navMain.map((item, index) => (
                    <React.Fragment key={item.title}>
                        {index > 0 && <SidebarSeparator />}
                        <SidebarGroup>
                            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {item.items.map((subItem) => (
                                        <SidebarMenuItem key={subItem.title}>
                                            <SidebarMenuButton asChild isActive={subItem.isActive}>
                                                <a href={subItem.url}>
                                                    {/* Icon on the left of every button */}
                                                    {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                                    <span>{subItem.title}</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </React.Fragment>
                ))}
            </SidebarContent>
            {/* Sign out button at the bottom */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <button className="w-full text-left">
                                <LogOut className="h-4 w-4" />
                                <span>Sign Out</span>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

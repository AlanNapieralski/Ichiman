import * as React from "react"
import {
    BookOpen,
    LogOut,
    Home,
    LucideProps,
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
import { fetchSkills } from "@/lib/skills/utils"

type IconType = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>

type NavItem = {
    title: string
    url: string
    icon?: IconType
    isActive?: boolean
}

type NavSection = {
    title: string
    url: string
    items: NavItem[]
}

type NavData = {
    navMain: NavSection[]
}


const AppSidebar = async ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const skills = await fetchSkills()
    const parentSkills = skills.filter(skill => !skill.parentId)

    const formattedSkills: NavItem[] = parentSkills.map(skill => ({
        title: skill.name,
        url: `/skills/${skill.name.replaceAll(' ', '-')}`,
        isActive: false
    }))


    const data: NavData = {
        navMain: [
            {
                title: "Main",
                url: "#",
                items: [
                    {
                        title: "Dashboard",
                        url: "/skills",
                        icon: Home,
                    },
                ],
            },
            {
                title: "Skills",
                url: "#",
                items: formattedSkills
            },
        ],
    }
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


export default AppSidebar

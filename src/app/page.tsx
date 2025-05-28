import { AppSidebar } from "../components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import ProgressPanel from "@/components/ui/progress-panel"
import { panelData } from "@/models/panelData"

export default function Page() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="min-h-[100vh] flex-1 flex flex-col items-start rounded-xl bg-muted/50 md:min-h-min p-8 bg-red-50">
                        <ProgressPanel {...panelData.programming} className="" />
                        <ProgressPanel {...panelData.ukulele} className="" />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

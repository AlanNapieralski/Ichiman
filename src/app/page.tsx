import { AppSidebar } from "../components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import ProgressPanel from "@/components/ui/progress-panel"
import { progressFillClassMap } from "@/components/ui/progress-panel"

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
                        <ProgressPanel text="Programming" progress={60} progressFill={'platinum'} timeSpent="60" className="" />
                        <ProgressPanel text="Programming" progress={40} progressFill={'bronze'} timeSpent="60" className="" />
                        <ProgressPanel text="Programming" progress={20} progressFill={'silver'} timeSpent="60" className="" />
                        <ProgressPanel text="Programming" progress={100} progressFill={'master'} timeSpent="60" className="" />
                        <ProgressPanel text="Programming" progress={80} progressFill={'gold'} timeSpent="60" className="" />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

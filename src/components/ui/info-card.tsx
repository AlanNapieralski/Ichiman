import { Card, CardContent } from "@/components/ui/card"
import { ForwardRefExoticComponent, RefAttributes } from "react"
import { LucideProps } from "lucide-react"

type propType = {
    title: string
    Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
    data: number
}

export default function InfoCard({ title, Icon, data }: propType) {
    return (
        <>
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600">{title}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{data}</p>
                </CardContent>
            </Card>
        </>
    )
}



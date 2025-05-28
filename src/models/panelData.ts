import { ProgressPanelProps } from "@/components/ui/progress-panel";

export const panelData: Record<string, ProgressPanelProps> = {
    programming: {
        text: "Programming",
        progress: 30,
        progressFill: "platinum",
        timeSpent: 1000,
    },
    ukulele: {
        text: "Ukulele",
        progress: 100,
        progressFill: "master",
        timeSpent: 10000,
    },
};

"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TimeTrackingInput } from "./time-tracking-input";

interface TimePickerProps {
    totalSeconds: number;
    setTotalSeconds: (seconds: number) => void;
}

export function TimePicker({ totalSeconds, setTotalSeconds }: TimePickerProps) {
    const minuteRef = React.useRef<HTMLInputElement>(null);
    const hourRef = React.useRef<HTMLInputElement>(null);
    const secondRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className="flex items-end gap-2">
            <div className="grid gap-1 text-center">
                <Label htmlFor="hours" className="text-xs">
                    Hours
                </Label>
                <TimeTrackingInput
                    picker="hours"
                    totalSeconds={totalSeconds}
                    setTotalSeconds={setTotalSeconds}
                    ref={hourRef}
                    onRightFocus={() => minuteRef.current?.focus()}
                />
            </div>
            <div className="grid gap-1 text-center">
                <Label htmlFor="minutes" className="text-xs">
                    Minutes
                </Label>
                <TimeTrackingInput
                    picker="minutes"
                    totalSeconds={totalSeconds}
                    setTotalSeconds={setTotalSeconds}
                    ref={minuteRef}
                    onLeftFocus={() => hourRef.current?.focus()}
                    onRightFocus={() => secondRef.current?.focus()}
                />
            </div>
            <div className="grid gap-1 text-center">
                <Label htmlFor="seconds" className="text-xs">
                    Seconds
                </Label>
                <TimeTrackingInput
                    picker="seconds"
                    totalSeconds={totalSeconds}
                    setTotalSeconds={setTotalSeconds}
                    ref={secondRef}
                    onLeftFocus={() => minuteRef.current?.focus()}
                />
            </div>
            <div className="flex h-10 items-center">
                <Clock className="ml-2 h-4 w-4" />
            </div>
        </div>
    );
}

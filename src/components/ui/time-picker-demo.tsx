"use client";

import { useState } from "react";
import { TimeTrackingPicker } from "./TimeTrackingPicker";
import { formatTimeFromSeconds } from "@/utils/time/time-tracking-utils";

export function TimePickerDemo() {
    const [totalSeconds, setTotalSeconds] = useState(0);

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Time Tracking Picker Demo</h2>
            
            <div className="space-y-2">
                <label className="text-sm font-medium">Set Time:</label>
                <TimeTrackingPicker 
                    totalSeconds={totalSeconds}
                    setTotalSeconds={setTotalSeconds}
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-medium">Total Seconds:</label>
                <div className="text-lg font-mono bg-gray-100 p-2 rounded">
                    {totalSeconds.toLocaleString()}
                </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-medium">Formatted Time:</label>
                <div className="text-lg font-mono bg-blue-100 p-2 rounded">
                    {formatTimeFromSeconds(totalSeconds)}
                </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-medium">Breakdown:</label>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-green-100 p-3 rounded">
                        <div className="text-2xl font-bold">{Math.floor(totalSeconds / 3600)}</div>
                        <div className="text-sm text-gray-600">Hours</div>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded">
                        <div className="text-2xl font-bold">{Math.floor((totalSeconds % 3600) / 60)}</div>
                        <div className="text-sm text-gray-600">Minutes</div>
                    </div>
                    <div className="bg-red-100 p-3 rounded">
                        <div className="text-2xl font-bold">{totalSeconds % 60}</div>
                        <div className="text-sm text-gray-600">Seconds</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

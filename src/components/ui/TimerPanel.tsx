import { useEffect, useState } from "react";
import { useTimerStore } from "@/hooks/timerStore";

const TimerPanel = ({ timerId }: { timerId: number }) => {

    return (
        <div>
            <h1>Timer: {displayTime} seconds</h1>
            <p>Status: {timer?.isRunning ? "Running" : "Stopped"}</p>
        </div>
    );
};

export default TimerPanel;


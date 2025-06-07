import { useEffect, useRef, useState } from "react";

interface TimerOptions {
    autoStart?: boolean; // Whether the timer should start automatically
    onTick?: (time: number) => void; // Callback function for each tick
}

export const useTimer = (initialTime: number = 0, options?: TimerOptions) => {
    const [time, setTime] = useState(initialTime); // Time elapsed in seconds
    const [isRunning, setIsRunning] = useState(options?.autoStart || false); // Timer state
    const intervalRef = useRef<number | null>(null); // Reference to the interval

    // Start the timer
    const start = () => {
        if (!isRunning) {
            setIsRunning(true);
            intervalRef.current = window.setInterval(() => {
                setTime((prevTime) => {
                    const newTime = prevTime + 1;
                    if (options?.onTick) options.onTick(newTime); // Trigger onTick callback
                    return newTime;
                });
            }, 1000); // Increment every 1 second
        }
    };

    // Stop the timer
    const stop = () => {
        if (isRunning) {
            setIsRunning(false);
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    };

    // Reset the timer
    const reset = (newTime: number = 0) => {
        stop();
        setTime(newTime);
    };

    // Cleanup when the component using the hook unmounts
    useEffect(() => {
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return { time, isRunning, start, stop, reset };
};


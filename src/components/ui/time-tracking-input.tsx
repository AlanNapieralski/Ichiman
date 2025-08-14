import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";
import {
    TimeTrackingType,
    getArrowByType,
    getTimeByType,
    setTimeByType,
} from "@/utils/time/time-tracking-utils";

export interface TimeTrackingInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    picker: TimeTrackingType;
    totalSeconds: number;
    setTotalSeconds: (seconds: number) => void;
    onRightFocus?: () => void;
    onLeftFocus?: () => void;
}

const TimeTrackingInput = React.forwardRef<
    HTMLInputElement,
    TimeTrackingInputProps
>(
    (
        {
            className,
            type = "tel",
            value,
            id,
            name,
            totalSeconds = 0,
            setTotalSeconds,
            onChange,
            onKeyDown,
            picker,
            onLeftFocus,
            onRightFocus,
            ...props
        },
        ref
    ) => {
        const [flag, setFlag] = React.useState<boolean>(false);
        const [inputValue, setInputValue] = React.useState<string>("");

        // Initialize input value when totalSeconds changes
        React.useEffect(() => {
            setInputValue(getTimeByType(totalSeconds, picker));
        }, [totalSeconds, picker]);

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Tab") return;
            e.preventDefault();
            
            if (e.key === "ArrowRight") {
                onRightFocus?.();
                return;
            }
            if (e.key === "ArrowLeft") {
                onLeftFocus?.();
                return;
            }
            
            if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                const step = e.key === "ArrowUp" ? 1 : -1;
                const currentValue = getTimeByType(totalSeconds, picker);
                const newValue = getArrowByType(currentValue, step, picker);
                const newTotalSeconds = setTimeByType(totalSeconds, newValue, picker);
                setTotalSeconds(newTotalSeconds);
                setInputValue(newValue);
                return;
            }
            
            if (e.key >= "0" && e.key <= "9") {
                let newValue: string;
                
                if (picker === "hours") {
                    // For hours, allow multiple digits
                    newValue = flag ? inputValue + e.key : e.key;
                    // Limit to 5 digits max
                    if (newValue.length > 5) {
                        newValue = newValue.slice(-5);
                    }
                } else {
                    // For minutes and seconds, use 2-digit logic
                    newValue = flag ? inputValue.slice(1) + e.key : "0" + e.key;
                    if (newValue.length > 2) {
                        newValue = newValue.slice(-2);
                    }
                }
                
                setInputValue(newValue);
                setFlag(true);
                
                // Auto-advance for minutes and seconds after 2 digits
                if (picker !== "hours" && newValue.length === 2) {
                    setTimeout(() => {
                        onRightFocus?.();
                        setFlag(false);
                    }, 100);
                }
                
                // Update total seconds
                const newTotalSeconds = setTimeByType(totalSeconds, newValue, picker);
                setTotalSeconds(newTotalSeconds);
                return;
            }
            
            // Handle backspace
            if (e.key === "Backspace") {
                if (picker === "hours") {
                    const newValue = inputValue.slice(0, -1) || "0";
                    setInputValue(newValue);
                    const newTotalSeconds = setTimeByType(totalSeconds, newValue, picker);
                    setTotalSeconds(newTotalSeconds);
                } else {
                    // For minutes/seconds, reset to 00
                    setInputValue("00");
                    const newTotalSeconds = setTimeByType(totalSeconds, "00", picker);
                    setTotalSeconds(newTotalSeconds);
                }
                setFlag(false);
            }
        };

        const handleBlur = () => {
            // Validate and format the input value on blur
            const currentValue = getTimeByType(totalSeconds, picker);
            setInputValue(currentValue);
            setFlag(false);
        };

        return (
            <Input
                ref={ref}
                id={id || picker}
                name={name || picker}
                className={cn(
                    "text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none",
                    picker === "hours" ? "w-[72px]" : "w-[48px]",
                    className
                )}
                value={inputValue}
                onChange={(e) => {
                    e.preventDefault();
                    onChange?.(e);
                }}
                type={type}
                inputMode="decimal"
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                {...props}
            />
        );
    }
);

TimeTrackingInput.displayName = "TimeTrackingInput";

export { TimeTrackingInput };

/**
 * Regular expression to check for valid hour format (0-99999)
 */
export function isValidHour(value: string) {
    return /^[0-9]{1,5}$/.test(value) && parseInt(value, 10) <= 99999;
}

/**
 * Regular expression to check for valid minute format (00-59)
 */
export function isValidMinute(value: string) {
    return /^[0-5][0-9]$/.test(value);
}

/**
 * Regular expression to check for valid second format (00-59)
 */
export function isValidSecond(value: string) {
    return /^[0-5][0-9]$/.test(value);
}

type GetValidNumberConfig = { max: number; min?: number; loop?: boolean };

export function getValidNumber(
    value: string,
    { max, min = 0, loop = false }: GetValidNumberConfig
) {
    let numericValue = parseInt(value, 10);

    if (!isNaN(numericValue)) {
        if (!loop) {
            if (numericValue > max) numericValue = max;
            if (numericValue < min) numericValue = min;
        } else {
            if (numericValue > max) numericValue = min;
            if (numericValue < min) numericValue = max;
        }
        return numericValue.toString();
    }

    return "0";
}

export function getValidHour(value: string) {
    if (isValidHour(value)) return value;
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
        if (numValue > 99999) return "99999";
        if (numValue < 0) return "0";
        return numValue.toString();
    }
    return "0";
}

export function getValidMinute(value: string) {
    if (isValidMinute(value)) return value;
    return getValidNumber(value, { max: 59 });
}

export function getValidSecond(value: string) {
    if (isValidSecond(value)) return value;
    return getValidNumber(value, { max: 59 });
}

type GetValidArrowNumberConfig = {
    min: number;
    max: number;
    step: number;
};

export function getValidArrowNumber(
    value: string,
    { min, max, step }: GetValidArrowNumberConfig
) {
    let numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
        numericValue += step;
        return getValidNumber(String(numericValue), { min, max, loop: true });
    }
    return "0";
}

export function getValidArrowHour(value: string, step: number) {
    return getValidArrowNumber(value, { min: 0, max: 99999, step });
}

export function getValidArrowMinute(value: string, step: number) {
    return getValidArrowNumber(value, { min: 0, max: 59, step });
}

export function getValidArrowSecond(value: string, step: number) {
    return getValidArrowNumber(value, { min: 0, max: 59, step });
}

export type TimeTrackingType = "hours" | "minutes" | "seconds";

export function getTimeByType(totalSeconds: number, type: TimeTrackingType): string {
    switch (type) {
        case "hours":
            return Math.floor(totalSeconds / 3600).toString();
        case "minutes":
            return Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
        case "seconds":
            return (totalSeconds % 60).toString().padStart(2, "0");
        default:
            return "0";
    }
}

export function setTimeByType(
    totalSeconds: number,
    value: string,
    type: TimeTrackingType
): number {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    switch (type) {
        case "hours":
            const newHours = parseInt(getValidHour(value), 10);
            return newHours * 3600 + minutes * 60 + seconds;
        case "minutes":
            const newMinutes = parseInt(getValidMinute(value), 10);
            return hours * 3600 + newMinutes * 60 + seconds;
        case "seconds":
            const newSeconds = parseInt(getValidSecond(value), 10);
            return hours * 3600 + minutes * 60 + newSeconds;
        default:
            return totalSeconds;
    }
}

export function getArrowByType(
    value: string,
    step: number,
    type: TimeTrackingType
): string {
    switch (type) {
        case "hours":
            return getValidArrowHour(value, step);
        case "minutes":
            return getValidArrowMinute(value, step);
        case "seconds":
            return getValidArrowSecond(value, step);
        default:
            return "0";
    }
}

/**
 * Convert total seconds to a formatted string
 */
export function formatTimeFromSeconds(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
    } else {
        return `${seconds}s`;
    }
}

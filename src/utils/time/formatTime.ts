export function formatTime(seconds: number): string {
    if (seconds < 3600) {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")} min`
    } else if (seconds < 360000) {
        const hours = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        return `${String(hours).padStart(2, "0")} h ${String(mins).padStart(2, "0")} m`
    } else {
        const hours = Math.floor(seconds / 3600)
        return `${hours.toLocaleString()} h`
    }
}

import { rankDataArr, Rank } from "@/models/RankToProgressMap";

/**
 * Calculates the clamped progress percentage for a given rank and time.
 * @param rank - The current rank.
 * @param time - The current time count.
 * @returns The clamped progress percentage (0-100).
 */
export function calculateClampedProgress(rank: Rank, time: number): number {
    const nextRank = rankDataArr.find(([name]) => rank === name)?.[1]?.nextRank;
    const upperBound = rankDataArr.find(([name]) => name === nextRank)?.[1]?.goal;

    if (nextRank === null) return 100;
    if (upperBound === undefined) return 0;

    return (time / upperBound) * 100;
}


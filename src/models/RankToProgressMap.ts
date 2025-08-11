export const rankData = {
    loading: {
        goal: 0,
        nextRank: null
    },
    bronze: {
       goal: 0,
        nextRank: 'silver',
    },
    silver: {
        goal: 360000, // 100 hours
        nextRank: 'gold',
    },
    gold: {
        goal: 1800000, // 500 hours
        nextRank: 'platinum',
    },
    platinum: {
        goal: 3600000, // 1,000 hours
        nextRank: 'diamond',
    },
    diamond: {
        goal: 18000000, // 5,000 hours
        nextRank: 'master',
    },
    master: {
        goal: 36000000, // 10,000 hours
        nextRank: null, // or undefined, meaning it's the highest
    },
} as const;


// highest first
export const rankDataArr = Object.entries(rankData).filter(([name]) => name !== 'loading').sort(
    ([, a], [, b]) => b.goal - a.goal
) as [Rank, { goal: number; nextRank: Rank }][]

export type Rank = keyof typeof rankData;

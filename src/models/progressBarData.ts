export type ProgressTier = keyof typeof progressFillClassMap;

export const progressFillClassMap = {
    bronze: 'bg-amber-700 group-hover:bg-amber-800 group-active:bg-amber-800',
    silver: 'bg-gray-400 group-hover:bg-gray-600 group-active:bg-gray-600',
    gold: 'bg-yellow-300 group-hover:bg-yellow-500 group-active:bg-yellow-500',
    platinum: 'bg-blue-300 group-hover:bg-blue-500 group-active:bg-blue-500',
    diamond: 'bg-purple-300 group-hover:bg-purple-400 group-active:bg-purple-400',
    master: 'bg-purple-700 group-hover:bg-purple-900 group-active:bg-purple-900',
} as const;

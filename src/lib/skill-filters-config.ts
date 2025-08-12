export type Option = { value: string; label: string };

export const RANK_FILTER_OPTIONS: Option[] = [
  { value: "all", label: "All Ranks" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

export const SORT_OPTIONS: Option[] = [
  { value: "hours", label: "Most Hours" },
  { value: "name", label: "Name A-Z" },
  { value: "progress", label: "Progress" },
  { value: "recent", label: "Most Recent" },
];



import type { Skill } from "@/models/skill";

export async function fetchSkills(): Promise<Skill[]> {
  const res = await fetch("http://localhost:3000/api/main-skills", {
    cache: "no-store", // or whatever caching you want
  });

  if (!res.ok) {
    const error = await res.json();
    console.log("No results:", error);
    return [];
  }

  const skills: Skill[] = await res.json();
  return skills;
}

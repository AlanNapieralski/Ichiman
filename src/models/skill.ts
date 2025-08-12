export type Skill = {
  id: number;
  name: string;
  timeCount: number;
  userId: number;
  parentId: number | null;
  description?: string;
  subSkills?: Skill[];
};

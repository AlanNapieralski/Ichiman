export type Skill = {
  id: number;
  name: string;
  timeCount: number;
  userId: number;
  parentId?: number;
  description?: string;
  subSkill?: Skill[];
};

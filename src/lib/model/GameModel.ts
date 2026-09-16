import type { AchievementModel } from '#lib/model/AchievementModel.ts';

export interface GameModel {
  title: string;
  description: string;
  url: string;
  gameId: string;
  slug: string;
  achievements: AchievementModel[];
}

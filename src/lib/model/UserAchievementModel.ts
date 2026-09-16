import type { AchievementModel } from '#lib/model/AchievementModel.ts';

export interface UserAchievementModel {
  achievement: AchievementModel;
  earnedOn: Date;
}

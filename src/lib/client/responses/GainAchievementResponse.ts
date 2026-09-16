import type { UserGameModel } from '#lib/model/UserGameModel.ts';

export interface GainAchievementResponse {
  success: true;
  user_game: UserGameModel;
}

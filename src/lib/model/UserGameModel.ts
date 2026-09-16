import type { GameModel } from '#lib/model/GameModel.ts';
import type { UserModel } from '#lib/model/UserModel.ts';
import type { UserAchievementModel } from '#lib/model/UserAchievementModel.ts';

export interface UserGameModel {
  achievements: UserAchievementModel[];
  game: GameModel;
  owner: UserModel;
}

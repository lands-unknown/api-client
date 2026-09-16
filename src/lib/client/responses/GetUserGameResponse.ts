import type { UserGameModel } from '#lib/model/UserGameModel.ts';

export type GetUserGameResponse = GetUserGameSuccess | GetUserGameError;

export interface GetUserGameSuccess {
  success: true;
  user_game: UserGameModel;
}

export interface GetUserGameError {
  success: false;
}

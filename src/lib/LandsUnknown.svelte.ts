import { LuClient } from '#lib/client/LuClient.svelte.ts';
import type { PingResponse } from '#lib/client/responses/PingResponse.ts';
import type { LoginResponse } from '#lib/client/responses/LoginResponse.ts';
import type { UserGameModel } from '#lib/model/UserGameModel.ts';
import type { UserAchievementModel } from '#lib/model/UserAchievementModel.ts';

interface LocalData {
  token: string;
  expires_at: Date;
}

/**
 * The entrypoint for interacting with the lands-unknown ludiverse
 */
export class LandsUnknown {
  private readonly _client: LuClient;

  private _data?: LocalData = $state();
  private _userGame?: UserGameModel = $state(undefined);

  private _playerCount: number = $state(-1);

  private _interval?: ReturnType<typeof setInterval>;

  constructor(url: string, gameId: string) {
    this._client = new LuClient(url, gameId, () => {
      this.clear();
    });
  }

  public async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this._client.login(username, password);
    if (response.success) {
      this._data = response;
      await this.fetchUserGame();
      await this.ping();
    }
    return response;
  }

  public async createGuest(): Promise<LoginResponse> {
    const response = await this._client.createGuest();
    if (response.success) {
      this._data = response;
      await this.fetchUserGame();
      await this.ping();
    }
    return response;
  }

  public isLoggedIn() {
    return this._client.hasToken();
  }

  public async fetchUserGame(): Promise<UserGameModel | undefined> {
    const response = await this._client.getUserGame();
    if (!response?.success) {
      return;
    }
    this._userGame = response.user_game;
    return this._userGame;
  }

  get userGame(): UserGameModel | undefined {
    return this._userGame;
  }

  // Pinging

  /**
   * Let the server know we're still here and get the player count
   */
  public async ping(): Promise<PingResponse> {
    const response = await this._client.ping();
    if (response.success) {
      this._playerCount = response.count ?? -1;
    }
    return response;
  }

  /**
   * Start pinging every 30 seconds
   */
  public async start(): Promise<void> {
    this.load();
    await this.fetchUserGame();
    await this.ping();

    this._interval = setInterval(async () => {
      this.save();
      await this.ping();
    }, 30 * 1000);
  }

  /**
   * Stop pinging
   */
  public stop(): void {
    this.save();

    clearInterval(this._interval);
    this._interval = undefined;
  }

  get playerCount(): number {
    return this._playerCount;
  }

  // Achievements

  public async gainAchievement(achievementId: string): Promise<void> {
    if (this.hasAchievement(achievementId)) {
      return;
    }
    const response = await this._client.gainAchievement(achievementId);
    if (response) {
      this._userGame = response.user_game;
    }
  }

  public get achievements(): UserAchievementModel[] {
    return this._userGame?.achievements ?? [];
  }

  public hasAchievement(achievementId: string): boolean {
    return (
      this._userGame?.achievements.find((userAchievement) => {
        return userAchievement.achievement.slug === achievementId;
      }) != undefined
    );
  }

  // Saving

  /**
   * The saveKey to store the user data under
   */
  private readonly SAVE_KEY: string = '@lands-unknown-com';

  /**
   * Save the user data to localStorage
   */
  public save(): void {
    if (this._data) {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(this._data));
    }
  }

  /**
   * Load the user data from localStorage
   */
  public load(): void {
    try {
      const data = localStorage.getItem(this.SAVE_KEY);
      if (!data) {
        return;
      }
      const json = JSON.parse(data);
      if (!json) {
        return;
      }
      this._data = json;
      this._client.setToken(json.token);
    } catch (e) {
      console.warn(`Could not load user: ${e}`);
    }
  }

  /**
   * Delete the user data from the localStorage
   */
  public clear(): void {
    this._client.deleteToken();
    this._userGame = undefined;
    localStorage.removeItem(this.SAVE_KEY);
  }
}

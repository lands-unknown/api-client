import type { LoginResponse, LoginSuccess } from '#lib/client/responses/LoginResponse.ts';
import type { PingResponse, PingSuccess } from '#lib/client/responses/PingResponse.ts';
import type { GainAchievementResponse } from '#lib/client/responses/GainAchievementResponse.ts';
import type { GetUserGameResponse } from '#lib/client/responses/GetUserGameResponse.ts';

interface RequestData {
  path: string;
  body?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  sendToken?: boolean;
}

export class LuClient {
  private readonly _url: string;
  private readonly _gameId: string;
  private readonly _onAuthFailure: () => void;

  private _token: string | null = $state(null);

  constructor(url: string, gameId: string, onAuthFailure: () => void) {
    this._url = url;
    this._gameId = gameId;
    this._onAuthFailure = onAuthFailure;
  }

  public async login(username: string, password: string): Promise<LoginResponse> {
    if (this.hasToken()) {
      console.warn('Already logged in, skipping');
      return {
        success: false,
      };
    }

    const response = await this._request<LoginSuccess>('POST', {
      path: `/api/login`,
      body: {
        username,
        password,
      },
    });

    if (!response) {
      return {
        success: false,
      };
    }

    this._token = response.token;

    return response;
  }

  public async createGuest(): Promise<LoginResponse> {
    if (this.hasToken()) {
      console.warn('Already logged in, skipping');
      return {
        success: false,
      };
    }

    const response = await this._request<LoginSuccess>('POST', {
      path: `/api/registration/guest`,
    });

    if (!response) {
      return {
        success: false,
      };
    }

    this._token = response.token;

    return response;
  }

  public deleteToken(): void {
    this._token = null;
  }

  public async ping(): Promise<PingResponse> {
    if (!this.hasToken()) {
      return {
        success: false,
      };
    }

    const response = await this._request<PingSuccess>('POST', {
      path: `/api/presence/${this._gameId}`,
    });

    if (!response) {
      return {
        success: false,
      };
    }

    return response;
  }

  public async getUserGame(): Promise<GetUserGameResponse | undefined> {
    if (!this.hasToken()) {
      return;
    }

    return await this._request<GetUserGameResponse>('GET', {
      path: `/api/game/${this._gameId}`,
    });
  }

  public async gainAchievement(achievement: string): Promise<GainAchievementResponse | undefined> {
    if (!this.hasToken()) {
      return;
    }

    return await this._request<GainAchievementResponse>('POST', {
      path: `/api/achievement/${achievement}`,
    });
  }

  public async count() {
    if (!this.hasToken()) {
      return;
    }

    return this._request('GET', {
      path: `/api/presence/count/${this._gameId}`,
    });
  }

  private async _request<T extends object>(method: 'GET' | 'POST', request: RequestData): Promise<T | undefined> {
    const url = `${this._url}${request.path.startsWith('/') ? '' : '/'}${request.path}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...request.headers,
    };
    if (this._token) {
      headers['Authorization'] = 'Bearer ' + this._token;
    }
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: request.body ? JSON.stringify(request.body) : undefined,
    });

    if (response.status === 401) {
      this._token = null;
      this._onAuthFailure();
    }

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    try {
      return await response.json();
    } catch (e) {
      console.log(e);
      console.log(response);
      return undefined;
    }
  }

  public hasToken(): boolean {
    return this._token != null;
  }

  public setToken(token: string) {
    this._token = token;
  }
}

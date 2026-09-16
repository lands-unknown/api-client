import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  LANDS_UNKNOWN_URL: {
    public: true,
    static: true,
  },
  GAME_ID: {
    public: true,
    static: true,
  },
});

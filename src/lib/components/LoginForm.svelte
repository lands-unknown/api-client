<script lang="ts">
  import type { LandsUnknown } from '#lib/LandsUnknown.svelte.ts';
  import { LuButton, LuPanel, LuText } from '@lands-unknown/origin';

  interface Props {
    lu: LandsUnknown;
  }

  let { lu }: Props = $props();

  let username = $state('');
  let password = $state('');

  const login = async () => {
    await lu.login(username, password);
  };

  const createGuest = async () => {
    await lu.createGuest();
  };
</script>

<div class="flex max-w-96 flex-col space-y-8">
  <LuPanel>
    <form
      onsubmit={(e) => {
        e.preventDefault();
        login();
      }}
    >
      <div class="flex max-w-96 flex-col space-y-4">
        <div>
          <LuPanel snug --pixel-upscale="1">
            <input
              id="username"
              class="border-0 bg-transparent text-xl placeholder-black"
              type="text"
              bind:value={username}
              placeholder="Username"
            />
          </LuPanel>
        </div>

        <div>
          <LuPanel snug --pixel-upscale="1">
            <input
              id="password"
              class="border-0 bg-transparent text-xl placeholder-black"
              type="password"
              bind:value={password}
              placeholder="Password"
            />
          </LuPanel>
        </div>
        <LuButton>
          <LuText>Log in</LuText>
        </LuButton>
      </div>
    </form>
  </LuPanel>
  <form
    onsubmit={(e) => {
      e.preventDefault();
      createGuest();
    }}
  >
    <LuButton>
      <LuText>Log in as guest</LuText>
    </LuButton>
  </form>
</div>

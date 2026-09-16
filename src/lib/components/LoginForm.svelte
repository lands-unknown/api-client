<script lang="ts">
  import type { LandsUnknown } from '#lib/LandsUnknown.svelte.ts';

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
  <form>
    <div class="flex max-w-96 flex-col space-y-4">
      <input type="text" bind:value={username} placeholder="Username" />
      <input type="password" bind:value={password} placeholder="Password" />

      <input value="Log in" type="submit" class="cursor-pointer border p-2" onclick={() => login()} />
    </div>
  </form>

  <form>
    <input value="Log in as guest" type="submit" class="cursor-pointer border p-2" onclick={() => createGuest()} />
  </form>
</div>

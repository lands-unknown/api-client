<script lang="ts">
  import type { LandsUnknown } from '#lib/LandsUnknown.svelte.ts';
  import landsUnknown from '#lib/assets/lands-unknown.png';
  import { LuText } from '@lands-unknown/origin';

  interface Props {
    lu: LandsUnknown;
  }

  let { lu }: Props = $props();

  let isLoggedIn = $derived(lu.isLoggedIn());
  let playerCount = $derived(lu.playerCount);
</script>

<div class="flex flex-row items-center space-x-2">
  <div class="h-4 w-4">
    <img
      class="pixelated h-full w-full {!isLoggedIn ? 'animate-spin grayscale-50' : ''}"
      src={landsUnknown}
      alt="Lands Unknown"
    />
  </div>
  {#if playerCount !== -1}
    <LuText>{playerCount} players online</LuText>
  {/if}
</div>

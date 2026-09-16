<script lang="ts">
  import { onMount } from 'svelte';
  import { LANDS_UNKNOWN_URL, GAME_ID } from '$app/env/public';

  import { LandsUnknown } from '#lib/LandsUnknown.svelte.ts';
  import PlayerStatus from '#lib/components/PlayerStatus.svelte';
  import ConnectionStatus from '#lib/components/ConnectionStatus.svelte';
  import LoginForm from '#lib/components/LoginForm.svelte';

  const lu = new LandsUnknown(LANDS_UNKNOWN_URL, GAME_ID);

  onMount(() => {
    lu.start();
    const interval = setInterval(() => {
      getThing();
    }, 1000);

    return () => {
      lu.stop();
      clearInterval(interval);
    };
  });

  let isLoggedIn = $derived(lu.isLoggedIn());

  let things = $state(0);
  let thingSpeed = $state(1);

  let thingSpeedCost = $derived(Math.floor(Math.pow(thingSpeed * 10, 1.2)));

  const getThing = () => {
    things += thingSpeed;
  };

  const buyThingSpeed = () => {
    if (things >= thingSpeedCost) {
      things -= thingSpeedCost;
      thingSpeed += 1;
    }
  };

  $effect(() => {
    if (things > 10) {
      lu.gainAchievement('10-things');
    }

    if (things > 100) {
      lu.gainAchievement('100-things');
    }

    if (things > 1000) {
      lu.gainAchievement('1000-things');
    }

    if (things > 10000) {
      lu.gainAchievement('10000-things');
    }
  });
</script>

<div class="flex flex-col space-y-4 p-4">
  <ConnectionStatus {lu} />

  <PlayerStatus {lu} />

  {#if !isLoggedIn}
    <LoginForm {lu} />
  {/if}

  <div class="flex flex-col items-center">
    <p>You have {things} things. You get {thingSpeed} things per second</p>

    <button class="cursor-pointer border-2 p-2" onclick={() => buyThingSpeed()}
      >Go faster for {thingSpeedCost} things</button
    >
  </div>
</div>

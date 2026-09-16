<script lang="ts">
  import type { LandsUnknown } from '#lib/LandsUnknown.svelte.ts';
  import { LuButton, LuText } from '@lands-unknown/origin';

  interface Props {
    lu: LandsUnknown;
  }

  let { lu }: Props = $props();

  let userGame = $derived(lu.userGame);
  let user = $derived(userGame?.owner);

  const logOut = () => {
    lu.clear();
  };

  let achievements = $derived(lu.achievements);
  let earnedAchievements = $derived(achievements.map((userAchievement) => userAchievement.achievement.slug));
</script>

{#if user}
  <div class="flex flex-col space-y-4">
    <LuText>Achievements: {JSON.stringify(earnedAchievements)}</LuText>
    <LuText>{user.username}: {user.achievementScore}xp</LuText>

    <div class="max-w-96">
      <LuButton onClick={() => logOut()}>Log out</LuButton>
    </div>
  </div>
{/if}

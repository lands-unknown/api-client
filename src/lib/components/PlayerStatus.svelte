<script lang="ts">
  import type { LandsUnknown } from '#lib/LandsUnknown.svelte.ts';

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
    <p>Achievements: {JSON.stringify(earnedAchievements)}</p>
    <span>{user.username}: {user.achievementScore}xp</span>
    <button class="max-w-24 border-2 p-2" onclick={() => logOut()}>Log out</button>
  </div>
{/if}

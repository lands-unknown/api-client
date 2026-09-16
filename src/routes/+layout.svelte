<script lang="ts">
  import './layout.css';

  const { children } = $props();
</script>

<div data-theme="dwarven">
  {@render children()}
</div>

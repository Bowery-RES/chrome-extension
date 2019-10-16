<script>
  import { onMount } from "svelte";
  import { getBoweryAppToken } from "./utils";
  import RentComp from "./RentComp.svelte";

  let token = null;
  let correctLocation = false;

  $: initialized = token;

</script>

<style>
.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

main {
	width: 400px;
	height: 600px;
}
</style>
<main>

  {#if initialized}
    <RentComp />
  {:else}
    <div class="loader"/>
  {/if}
</main>

<script>
  import "chrome-extension-async";
  import { onMount } from "svelte";
  import RentComp from "./RentComp.svelte";

  const rentCompPromise = chrome.storage.sync
    .get("unitComp")
    .then(({ unitComp }) => unitComp);

</script>

<style>
  main {
    width: 400px;
    height: 600px;
  }
</style>

<main>

  {#await rentCompPromise}
    <p>...waiting</p>
  {:then comp}
    <pre>{JSON.stringify(comp, null, 2)}</pre>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</main>

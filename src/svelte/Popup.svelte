<script>
  import "chrome-extension-async";
  import { onMount } from "svelte";
  import RentComp from "./RentComp.svelte";

  let rentCompPromise = chrome.storage.local
    .get("unitComp")
    .then(({ unitComp }) => unitComp);
</script>

<main>
  {#await rentCompPromise}
    <p>...waiting</p>
  {:then comp}
    <RentComp initialValues={comp} />
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</main>

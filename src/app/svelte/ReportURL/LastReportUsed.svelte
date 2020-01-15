<script>
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import get from "lodash/get";
  import { targetReport } from "./../stores.js";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import { getLastVisitedReports } from "../../lib/utils";
  import Select from "../components/Select.svelte";
  export let checked = false;

  let lastReports = [];
  $: if (checked) {
    targetReport.set(get(lastReports, "0"));
  }

  onMount(async () => {
    lastReports = await getLastVisitedReports();
  });
</script>

<style>
  .root {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    margin-top: 16px;
    height: 78px;
  }
</style>

<div class="root">
  <FormField>
    <Checkbox bind:checked />
    <span slot="label">Last Report Used</span>
  </FormField>

  {#if checked}
    <div transition:fly={{ x: 330, duration: 500 }}>
      <Select
        items={lastReports}
        placeholder="Select Report"
        bind:selectedValue={$targetReport} />
    </div>
  {/if}
</div>

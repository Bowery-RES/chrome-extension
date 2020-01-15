<script>
  import { onMount } from "svelte";
  import Select, { Option } from "@smui/select";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import { getLastVisitedReports } from "../../lib/utils";
  export let value;
  export let checked = false;
  let lastReports = [];

  onMount(async () => {
    lastReports = await getLastVisitedReports();
  });
</script>

<style>
  .root {
    height: 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    margin-top: 24px;
  }
</style>

<div class="root">
  <FormField>
    <Checkbox bind:checked />
    <span slot="label">Last Report Used</span>
  </FormField>

  {#if checked}
    <Select
      variant="outlined"
      style="height: 36px"
      class="dense"
      bind:value
      label="Last Reports">
      <Option value="" />
      {#each lastReports as report}
        <Option value={report.value} selected={value === report}>
          {report.address}
        </Option>
      {/each}
    </Select>
  {/if}
</div>

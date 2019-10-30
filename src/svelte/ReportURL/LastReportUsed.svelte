<script>
  import { onMount } from "svelte";
  import Select, { Option } from "@smui/select";
  import Switch from "@smui/switch";
  import FormField from "@smui/form-field";
  import { getLastVisitedReports } from "../../utils";
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
    justify-content: space-between;
    flex: 1;
    margin: 8px 10px;
  }
  :global(.switch) {
    flex-direction: column;
    justify-content: space-between;
    height: 48px;
  }
</style>

<div class="root">
  <FormField class="switch">
    <span slot="label">Last Report Used</span>
    <Switch bind:checked />
  </FormField>

  {#if checked}
    <Select
      variant="outlined"
      style="height: 48px"
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

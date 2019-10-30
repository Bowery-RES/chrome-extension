<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import get from "lodash/get";
  import uniqBy from "lodash/uniqBy";
  import { BOWERY_APP_DOMAIN } from "secrets";
  import Select, { Option } from "@smui/select";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text/index";
  import Switch from "@smui/switch";
  import FormField from "@smui/form-field";
  export let value;
  export let checked = false;
  let lastReports = [];

  onMount(async () => {
    const history = await chrome.history.search({
      text: `${BOWERY_APP_DOMAIN}/report/`,
      startTime: Date.now() - 10080000
    });
    const reportsVisited = history.filter(
      page =>
        page.url.match(/(\/report\/(\d|\w){24})/) && page.title !== "Bowery" && !BOWERY_APP_DOMAIN.includes(page.title)
    );
    const reports = reportsVisited.map(page => {
      const [reportUrl] = get(page, "url", "").match(/(\/report\/(\d|\w){24})/);
      return {
        value: `${BOWERY_APP_DOMAIN}${reportUrl}`,
        address: page.title
      };
    });

    lastReports = uniqBy(reports, "value").slice(0, 5);
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
    <FormField class="switch" >
      <span slot="label">Last Report Used</span>
      <Switch bind:checked />
    </FormField>

  {#if checked}
    <Select variant="outlined" style="height: 48px" class="dense" bind:value label="Last Reports">
      <Option value="" />
      {#each lastReports as report}
        <Option value={report.value} selected={value === report}>
          {report.address}
        </Option>
      {/each}
    </Select>
  {/if}
</div>

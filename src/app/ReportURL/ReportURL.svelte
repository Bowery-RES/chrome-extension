<script>
  import { onMount } from "svelte";
  import get from "lodash/get";
  import noop from "lodash/noop";
  import { targetReport } from "./../stores.js";
  import { fly } from "svelte/transition";
  import LinearProgress from "@smui/linear-progress";
  import Textfield from "../components/TextField.svelte";
  import HelperText from "@smui/textfield/helper-text/index";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import Select from "../components/Select.svelte";

  export let getLastVisitedReports = noop;
  export let fetchReport = noop;

  let checked = false;
  let lastReports = [];

  $: if (checked) {
    targetReport.set(get(lastReports, "0", {}));
  }

  onMount(async () => {
    lastReports = (await getLastVisitedReports()) || [];
  });

  $: report = fetchReport($targetReport.value);
</script>

<style>
  section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 30px;
  }
  .last-report-used {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    height: 78px;
  }
</style>

<section transition:fly={{ y: -800, duration: 500 }}>
  <div>
    <Textfield disabled={checked} bind:value={$targetReport.value} label="Report URL" required></Textfield>
    <FormField style="margin-left: -8px">
      <Checkbox bind:checked />
      <span slot="label">Use last report</span>
    </FormField>
  </div>
  <div class="last-report-used">
    {#if checked}
      <div transition:fly={{ x: 330, duration: 500 }}>
        <Select
          items={lastReports}
          placeholder="Select Report"
          label="Last Report(s) Used"
          bind:selectedValue={$targetReport}
        >
          <div slot="helperText">
            {#await report}
              <div style="width: 300px; margin-top: 8px;">
                <LinearProgress indeterminate />
              </div>
            {:then reportData}
              <HelperText persistent>
                <a href={`${$targetReport.value}/residential-rent-comps`} target="_blank">
                  View {get(reportData, 'new.address', '')} in WebApp.
                </a>
              </HelperText>
            {:catch error}
              Error: {error.message}
            {/await}
          </div>
        </Select>
      </div>
    {/if}
  </div>
</section>

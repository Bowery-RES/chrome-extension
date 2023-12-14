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
  export let normalizeReportUrl = noop;

  let checked = false;
  let lastReports = [];
  let error = null;

  $: if (checked) {
    targetReport.set(get(lastReports, "0", {}));
  }

  onMount(async () => {
    lastReports = (await getLastVisitedReports()) || [];
  });

  $: report = (() => {
    error = false
    return fetchReport($targetReport.value)
      .then((result) => {
        error = false
        return result
      })
      .catch((err) => {
        console.error('Error fetching report', err)
        error = err
      });
  })();
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

  .error {
    color: #d34141;
    padding: 0 16px;
    font-family: Nunito Sans;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.4px;
  }
</style>

<section transition:fly={{ y: -800, duration: 500 }}>
  <div>
    <Textfield disabled={checked} bind:value={$targetReport.value} label="Report URL" required invalid={error}>
      <div slot="helperText">
        {#await report}
          <div style="width: 300px; margin-top: 8px;">
            <LinearProgress indeterminate />
          </div>
        {/await}
        {#if error}
          <div class="error">Report data cannot be found.</div>
        {/if}
      </div>
    </Textfield>
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
                <a href={`${normalizeReportUrl($targetReport.value)}/residential-rent-comps`} target="_blank">
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

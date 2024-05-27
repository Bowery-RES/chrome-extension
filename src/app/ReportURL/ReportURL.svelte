<script>
  import { onMount } from 'svelte'
  import get from 'lodash/get'
  import noop from 'lodash/noop'
  import { fly } from 'svelte/transition'

  import LinearProgress from '@smui/linear-progress'
  import HelperText from '@smui/textfield/helper-text/index'
  import Checkbox from '@smui/checkbox'
  import FormField from '@smui/form-field'

  import { targetReport, fetchingStatus } from './../stores.js'
  import Input from '../components/Input.svelte'
  import Select from '../components/Select.svelte'

  export let getLastVisitedReports = noop
  export let fetchReport = noop
  export let normalizeReportUrl = noop

  let checked = false
  let lastReports = []
  let success = false

  $: if (checked) {
    targetReport.set(get(lastReports, '0', {}))
  }

  onMount(async () => {
    lastReports = (await getLastVisitedReports()) || []
  })

  $: report = (() => {
    fetchingStatus.set({ isLoading: true, error: null })
    success = false

    return fetchReport($targetReport.value)
      .then((result) => {
        if (result) {
          success = true
        }

        fetchingStatus.set({ isLoading: false, error: null })

        return result
      })
      .catch((err) => {
        console.error('Error fetching report', err)
        fetchingStatus.set({ isLoading: false, error: err.message || err })
      })
  })()
</script>

<section class="report-url" transition:fly={{ y: -800, duration: 500 }}>
  <div>
    <Input
      type="text"
      disabled={checked}
      bind:value={$targetReport.value}
      label="Report URL"
      forceInvalid={!!$fetchingStatus.error}
    >
      <div slot="helperText">
        {#await report}
          <div class="progress-bar">
            <LinearProgress indeterminate />
          </div>
        {/await}
        {#if $fetchingStatus.error}
          <div class="helper-text helper-text--error">
            {$fetchingStatus.error} The Comp will only be saved to the CompPlex database.
          </div>
        {/if}
        {#if !$fetchingStatus.error && !success}
          <div class="helper-text">Please provide a valid Report URL to add Comp to the report.</div>
        {/if}
      </div>
    </Input>
    <FormField class="use-last-report-checkbox">
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
              <div class="progress-bar">
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

  .helper-text {
    padding: 0 16px;
    font-family: Nunito Sans;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.4px;
  }

  .helper-text--error {
    color: #d34141;
  }

  .progress-bar {
    width: 300px;
    margin-top: 8px;
  }

  .report-url :global(.use-last-report-checkbox) {
    margin-left: -8px;
  }

  .report-url :global(.use-last-report-checkbox) :global(label) {
    padding-left: 0;
  }
</style>

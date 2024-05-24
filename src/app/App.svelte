<script>
  import Ripple from '@smui/ripple'
  import Close from 'svelte-icons/md/MdClose.svelte'

  import UnitRentComp from './UnitRentComp/UnitRentComp.svelte'
  import Loading from './components/Loading.svelte'
  import ReportUrl from './ReportURL/ReportURL.svelte'
  import { fetchingStatus, targetReport } from './stores.js'
  import BoweryService from '../services/BoweryService'
  import ChromeService from '../services/ChromeService.js'
  import CompPlexService from '../services/CompPlexService'
  import { WIDGET_ID, EVENTS } from '../constants'
  import ErrorCallout from './components/ErrorCallout.svelte'
  import ErrorService from '../services/ErrorService'

  let loading = false
  let appError = null
  $: errorMessage = appError && ErrorService.formatMessageFromError(appError)

  const initialValues = (async () => {
    try {
      loading = true
      return await ChromeService.emit({ type: EVENTS.INITIALIZE, data: document.location })
    } catch (error) {
      console.warn('Error on initialization', error)
      appError = error
    } finally {
      loading = false
    }
  })()

  function fetchReport(url) {
    return BoweryService.fetchReport(url)
  }

  function normalizeReportUrl(url) {
    return BoweryService.normalizeReportUrl(url)
  }

  function close() {
    document.getElementById(WIDGET_ID).remove()
  }

  async function submitComp(data) {
    try {
      loading = true
      const compPlexComp = await CompPlexService.addUnitComp(data)

      if (!$fetchingStatus.error && $targetReport.value) {
        await BoweryService.addUnitComp($targetReport.value, compPlexComp, data)
      }

      close()
    } catch (error) {
      console.error('Error on submission', error)
      appError = error
    } finally {
      loading = false
    }
  }

  function getLastVisitedReports() {
    return ChromeService.emit({
      type: EVENTS.LAST_REPORT_INITIALIZE,
    })
  }
</script>

<main class:loading>
  <div use:Ripple={[true, { color: 'surface' }]} class="icon" on:click={close}>
    <Close />
  </div>
  {#if loading}
    <Loading />
  {/if}
  {#await initialValues then value}
    <div class="child-margin">
      <h6>Bowery Comp Tool</h6>
      {#if errorMessage}
        <ErrorCallout>
          <span slot="message">{errorMessage}</span>
        </ErrorCallout>
      {/if}
      <ReportUrl {getLastVisitedReports} {fetchReport} {normalizeReportUrl} />
      <UnitRentComp {submitComp} initialValues={value} />
    </div>
  {/await}
  <div class="version-caption">Bowery Comp Tool v{process.env.VERSION}</div>
</main>

<style>
  main {
    width: 682px;
    min-height: 650px;
    font-family: 'Nunito Sans';
    position: fixed;
    top: 0px;
    right: 0px;
    padding: 16px 24px;
    z-index: 999999;
    background: #ffffff;
    box-shadow: 0px 8px 32px rgba(0, 15, 68, 0.12);
  }

  .child-margin > :global(*) {
    margin-bottom: 16px;
  }

  .icon {
    position: absolute;
    width: 24px;
    height: 24px;
    top: 24px;
    right: 24px;
    z-index: 99999;
  }
  .version-caption {
    font-size: 12px;
    color: #d0d0d0;
    text-align: center;
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .loading {
    margin: 0;
    min-height: 808px;
    text-align: left;
  }
  .loading::after {
    content: '';
    top: 0px;
    right: 0px;
    width: 682px;
    min-height: 100%;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.1);
  }

  :global(.mdc-text-field--invalid span) {
    color: rgba(255, 62, 0, 0.87);
  }

  :global(.mdc-text-field--invalid input) {
    color: rgba(255, 62, 0, 0.87) !important;
  }

  :global(.mdc-text-field) {
    width: 100%;
  }

  :global(.mdc-text-field__input) {
    padding: 12px 16px !important;
  }
</style>

<script>
  import Main from "./App.svelte";
  import Ripple from "@smui/ripple";
  import Close from "svelte-icons/md/MdClose.svelte";
  import UnitRentComp from "./UnitRentComp/UnitRentComp.svelte";
  import Loading from "./components/Loading.svelte";
  import ReportUrl from "./ReportURL/ReportURL.svelte";
  import BoweryService from "../services/BoweryService";
  import { targetReport } from "./stores.js";

  import ChromeService from "../services/ChromeService.js";
  import { WIDGET_ID, EVENTS } from "../constants";
  let loading = false;

  const initialValues = (async () => {
    loading = true;
    const values = await ChromeService.emit({ type: EVENTS.INITIALIZE });
    loading = false;
    return values;
  })();

  function fetchReport(url) {
    return BoweryService.fetchReport(url);
  }
  function close() {
    document.getElementById(WIDGET_ID).remove();
  }
  async function submitCompToReport(data) {
    try {
      loading = true;
      await BoweryService.addUnitComp($targetReport.value, data).then(close);
    } finally {
      loading = false;
    }
  }

  function getLastVisitedReports() {
    return ChromeService.emit({
      type: EVENTS.LAST_REPORT_INITIALIZE
    });
  }
</script>

<style>
  main {
    width: 682px;
    min-height: 808px;
    font-family: "Nunito Sans";
    position: fixed;
    top: 0px;
    right: 0px;
    padding: 16px 24px;
    z-index: 2000;
    background: #ffffff;
    box-shadow: 0px 8px 32px rgba(0, 15, 68, 0.12);
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
    width: 100%;
  }

  .loading {
    margin: 0;
    text-align: left;
  }
  .loading::after {
    content: "";
    top: 0px;
    right: 0px;
    width: 682px;
    min-height: 808px;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>

<main class:loading>
  <div use:Ripple={[true, { color: 'surface' }]} class="icon" on:click={close}>
    <Close />
  </div>
  {#if loading}
    <Loading />
  {/if}
  {#await initialValues then value}
    <div>
      <h1>Report</h1>
      <ReportUrl {getLastVisitedReports} {fetchReport} />
      <UnitRentComp {submitCompToReport} initialValues={value} />
    </div>
  {/await}
  <div class="version-caption">Bowery Comp Tool v{process.env.VERSION}</div>
</main>

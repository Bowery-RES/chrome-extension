<script>
  import { fade } from "svelte/transition";
  import Ripple from "@smui/ripple";
  import Close from "svelte-icons/md/MdClose.svelte";
  import UnitRentComp from "./UnitRentComp/UnitRentComp.svelte";
  import Loading from "./components/Loading.svelte";
  import ReportUrl from "./ReportURL/ReportURL.svelte";
  import BoweryService from "../services/BoweryService";
  import ChromeService from '../services/ChromeService.js'
  import { WIDGET_ID, EVENTS } from "../constants";

  const initialValues = ChromeService.emit({ type: EVENTS.INITIALIZE });

  function fetchReport(url) {
    return BoweryService.fetchReport(url);
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
    min-height: 780px;
    font-family: "Nunito Sans";
    position: fixed;
    top: 0px;
    right: 0px;
    padding: 16px 24px;
    z-index: 999999;
    background: #ffffff;
    box-shadow: 0px 8px 32px rgba(0, 15, 68, 0.12);
  }
  .icon {
    position: absolute;
    width: 24px;
    height: 24px;
    top: 24px;
    right: 24px;
  }
  .version-caption {
    font-size: 12px;
    color: #d0d0d0;
    text-align: center;
    position: absolute;
    bottom: 4px;
    width: 100%;
  }
</style>

<main>
  <div
    use:Ripple={[true, { color: 'surface' }]}
    class="icon"
    on:click={() => document.getElementById(WIDGET_ID).remove()}>
    <Close />
  </div>
  {#await initialValues}
    <Loading />
  {:then value}
    <div>
      <h1>Report</h1>
      <ReportUrl {getLastVisitedReports} {fetchReport} />
      <UnitRentComp initialValues={value} />
    </div>
  {:catch error}
    <span>{error.message}</span>
  {/await}
  <div class="version-caption">Bowery Comp Tool v{process.env.VERSION}</div>
</main>

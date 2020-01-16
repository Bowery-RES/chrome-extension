<script>
  import { fade, fly } from "svelte/transition";
  import Ripple from "@smui/ripple";
  import Close from "svelte-icons/md/MdClose.svelte";
  import UnitRentComp from "./UnitRentComp/UnitRentComp.svelte";
  import Loading from "./components/Loading.svelte";
  import ReportUrl from "./ReportURL/ReportURL.svelte";
  import { getInitialRentCompValues } from "../lib/utils";
  import { WIDGET_ID } from "../lib/constants.js";
  const initialValues = getInitialRentCompValues();
</script>

<style>
  main {
    width: 682px;
    min-height: 720px;
    font-family: "Roboto";
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
  }
  .version-caption {
    font-size: 12px;
    color: #d0d0d0;
    margin-right: 0;
    text-align: center;
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
    <h1>Report</h1>
    <ReportUrl />
    <UnitRentComp initialValues={value} />
    <div class="version-caption">Bowery Comp Tool v{process.env.VERSION}</div>
  {:catch error}
    <span>{error.message}</span>
  {/await}
</main>

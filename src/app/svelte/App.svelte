<script>
  import UnitRentComp from "./UnitRentComp/UnitRentComp.svelte";
  import Loading from "./components/Loading.svelte";
  import ReportUrl from "./ReportURL/ReportURL.svelte";
  import { getInitialRentCompValues } from "../lib/utils";
  const initialValues = getInitialRentCompValues();
</script>

<style>
  main {
    width: 682px;
    height: 842px;
    position: fixed;
    top: 0px;
    right: 0px;
    padding: 24px;
    z-index: 2000;
    background: #ffffff;
    box-shadow: 0px 8px 32px rgba(0, 15, 68, 0.12);
  }
</style>

<main>
  {#await initialValues}
    <Loading />
  {:then value}
    <ReportUrl />
    <UnitRentComp initialValues={value} />
  {:catch error}
    <p>{error.message}</p>
  {/await}
</main>

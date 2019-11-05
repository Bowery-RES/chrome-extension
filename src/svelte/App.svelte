<script>
  import UnitRentComp from "./UnitRentComp/UnitRentComp.svelte";
  import Loading from "./components/Loading.svelte";
  import ReportUrl from "./ReportURL/ReportURL.svelte";
  import { getInitialRentCompValues } from "@lib/utils";
  const initialValues = getInitialRentCompValues();
</script>

<style>
  main {
    padding: 16px;
    width: 750px;
    height: 527px;
  }
</style>

<main>
  {#await initialValues}
    <Loading />
  {:then value}
    <ReportUrl />
    <UnitRentComp initialValues={value} />
  {:catch error}
    <p></p>
  {/await}
</main>

<script>
  import "chrome-extension-async";
  import axios from "axios";
  import get from "lodash/get";
  import { BOWERY_APP_DOMAIN } from "secrets";
  import RentCompForm from "./RentCompForm.svelte";
  import ReportUrl from "./ReportUrl.svelte";

  let targetReport = "";

  export let initialValues;

  let promise = Promise.resolve();

  async function submitRentComp(values) {
    try {
      const { token } = await chrome.storage.local.get("token");
      await axios.post(`${targetReport}/addUnitComp`, values, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleSubmit(event) {
    promise = submitRentComp(event.detail);
  }
</script>

<ReportUrl bind:value={targetReport} />
{#await promise}
  <p>loading...</p>
{:then value}
  <RentCompForm
    {initialValues}
    disabled={!targetReport}
    on:submit={handleSubmit} />
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}

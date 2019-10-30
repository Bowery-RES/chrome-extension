<script>
  import "chrome-extension-async";
  import axios from "axios";
  import get from "lodash/get";
  import { targetReport } from "./../stores.js";
  import { BOWERY_APP_DOMAIN } from "secrets";
  import RentCompForm from "./RentCompForm.svelte";
  import Loading from "./../components/Loading.svelte";
  import { submitRentComp } from "@utils";

  export let initialValues;

  let promise = Promise.resolve();

  function handleSubmit(event) {
    promise = submitRentComp($targetReport, event.detail);
  }
</script>

{#await promise}
  <Loading />
{:then value}
  <RentCompForm {initialValues} on:submit={handleSubmit} />
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}

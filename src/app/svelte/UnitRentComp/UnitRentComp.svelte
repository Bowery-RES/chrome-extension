<script>
  import "chrome-extension-async";
  import axios from "axios";
  import get from "lodash/get";
  import map from "lodash/map"
  import { targetReport } from "./../stores.js";
  import { BOWERY_APP_DOMAIN } from "secrets";
  import RentCompForm from "./RentCompForm.svelte";
  import Loading from "./../components/Loading.svelte";
  import { addUnitComp } from "../../lib/api";

  export let initialValues = {};

  let promise = Promise.resolve();

  function handleSubmit(event) {
    const unitComp = {
        ...event.detail,
        amenities: map(event.detail.amenities, 'value'),
    }
    promise = addUnitComp($targetReport, unitComp).then(window.close);
  }

</script>
{#await promise}
  <Loading />
{:then value}
  <RentCompForm {initialValues} disabled={!$targetReport} on:submit={handleSubmit} />
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}

<script>
  import "chrome-extension-async";
  import axios from "axios";
  import get from "lodash/get";
  import map from "lodash/map";
  import { targetReport } from "./../stores.js";
  import { BOWERY_APP_DOMAIN } from "secrets";
  import RentCompForm from "./RentCompForm.svelte";
  import Loading from "./../components/Loading.svelte";

  export let initialValues = {};

  let promise = Promise.resolve();

  function handleSubmit(event) {
    const unitComp = {
      ...event.detail,
      amenities: map(event.detail.amenities, "value"),
      unitLayout: get(event, "detail.unitLayout.value")
    };
    console.log(unitComp);
    // promise = addUnitComp($targetReport.value, unitComp).then(window.close);
  }
</script>

<RentCompForm values={initialValues} on:submit={handleSubmit} />

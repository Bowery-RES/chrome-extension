<script>
  import get from "lodash/get";
  import map from "lodash/map";
  import RentCompForm from "./RentCompForm.svelte";

  export let initialValues = {};
  export let submitCompToReport;


  function handleSubmit(event) {
    const unitComp = {
      ...event.detail,
      amenities: map(event.detail.amenities, "value"),
      unitLayout: get(event, "detail.unitLayout.value")
    };
    submitCompToReport(unitComp);
  }
</script>

<RentCompForm values={initialValues} on:submit={handleSubmit} />

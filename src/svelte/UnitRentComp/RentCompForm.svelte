<script>
  import { createEventDispatcher } from "svelte";
  import Button from "@smui/button";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text/index";
  import DatePicker from "./../components/DatePicker.svelte";

  import Select from "./../components/MultiSelect.svelte";
  import { UNIT_AMENITIES_LIST } from "@constants";
  export let initialValues;
  export let disabled;
  const dispatch = createEventDispatcher();

  let values = {
    ...initialValues
  };
  let validation = {};

  $: values.pricePerSqft = values.sqft ? (values.rent * 12) / values.sqft : NaN;
</script>

<style>
  div[role="group"] {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-bottom: 8px;
  }

  div[role="group"] :global(.formField) {
    margin: 8px 10px;
    width: calc(50% - 20px);
  }

  h1 {
    width: 100%;
    margin: 0px 10px 10px;
  }
  footer {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    padding: 8px;
  }
</style>

<h1 class="mdc-typography--headline1 ">Rent Comp</h1>
<form on:submit|preventDefault={e => dispatch('submit', values)}>
  <div role="group">
    <Textfield
      class="formField"
      variant="outlined"
      dense
      input$required
      bind:value={values.address}
      label="Address" />
    <Select
      class="formField"
      items={UNIT_AMENITIES_LIST}
      placeholder="Select Unit Amenities"
      bind:selectedValue={values.unitAmenities} />

    <Textfield
      input$required
      class="formField"
      variant="outlined"
      dense
      bind:value={values.city}
      label="City" />
    <Textfield
      class="formField"
      variant="outlined"
      dense
      bind:value={values.state}
      label="State" />
    <Textfield
      class="formField"
      variant="outlined"
      dense
      bind:value={values.zip}
      label="Zip Code" />

    <Textfield
      class="formField"
      variant="outlined"
      dense
      input$required
      bind:value={values.unitNumber}
      label="Unit Number" />

    <DatePicker bind:value={values.dateOfValue} label="Date Of Value" />

    <Textfield
      class="formField"
      variant="outlined"
      dense
      input$required
      type="number"
      bind:value={values.bedrooms}
      label="Number of Bedrooms" />

    <Textfield
      class="formField"
      variant="outlined"
      dense
      input$required
      type="number"
      bind:value={values.bathrooms}
      label="Number of Bathrooms" />

    <Textfield
      class="formField"
      variant="outlined"
      dense
      input$required
      type="number"
      bind:value={values.rent}
      label="Monthly Rent" />
    <Textfield
      class="formField"
      variant="outlined"
      dense
      type="number"
      bind:value={values.sqft}
      label="Unit Square Footage" />

    <HelperText persistent>
      Rent per sqft: {values.pricePerSqft.toFixed(2)}
    </HelperText>
  </div>
  <footer>
    <Button style="color: white;" variant="raised" {disabled} type="submit">
      Submit
    </Button>
  </footer>
</form>

<script>
  import { createEventDispatcher } from "svelte";
  import Button from "@smui/button";
  import Textfield from "../components/TextField.svelte";
  import HelperText from "@smui/textfield/helper-text/index";
  import DatePicker from "./../components/DatePicker.svelte";

  import Select from "./../components/Select.svelte";
  import {
    UNIT_AMENITIES_LIST,
    UNIT_TYPES_LIST,
  } from "../../lib/constants";
  export let initialValues;
  export let disabled;
  const dispatch = createEventDispatcher();

  let values = {
    ...initialValues,
    unitType: UNIT_TYPES_LIST.find(
      unitType => unitType.value === initialValues.unitType
    )
  };

  $: values.pricePerSqft = values.sqft ? (values.rent * 12) / values.sqft : 0;
</script>

<style>
  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 24px;
    grid-column-gap: 30px;
    padding-bottom: 8px;
  }

  footer {
    display: flex;
    justify-content: space-between;
    grid-column: 1 / 3;
  }
</style>

<h1 class="mdc-typography--headline1 ">Rent Comp</h1>
<form on:submit|preventDefault={e => dispatch('submit', values)}>
  <Textfield required bind:value={values.address} label="Address" />
  <Select
    isMulti
    label="Amenities"
    items={UNIT_AMENITIES_LIST}
    placeholder="Select Unit Amenities"
    bind:selectedValue={values.amenities} />
  <Textfield required bind:value={values.city} label="City" />
  <Textfield bind:value={values.state} label="State" />
  <Textfield bind:value={values.zip} label="Zip Code" />
  <Textfield required bind:value={values.unitNumber} label="Unit Number" />
  <DatePicker bind:value={values.dateOfValue} label="Date Of Value" />

  <Select
    label="Unit Type"
    items={UNIT_TYPES_LIST}
    bind:selectedValue={values.unitType}
    placeholder="Select Unit Type" />
  <Textfield
    required
    type="number"
    bind:value={values.bathrooms}
    label="Number of Bathrooms" />
  <Textfield
    required
    type="number"
    bind:value={values.bedrooms}
    label="Number of Bedrooms" />
  <Textfield
    type="number"
    bind:value={values.sqft}
    label="Unit Square Footage" />

  <Textfield
    required
    type="number"
    bind:value={values.rent}
    label="Monthly Rent">
    <span slot="helperText">
      <HelperText persistent>
        Rent per SF: ${values.pricePerSqft.toFixed(2)}
      </HelperText>
    </span>
  </Textfield>

  <footer>
    <Button style="color: white;" variant="raised" {disabled} type="submit">
      Submit
    </Button>
  </footer>
</form>

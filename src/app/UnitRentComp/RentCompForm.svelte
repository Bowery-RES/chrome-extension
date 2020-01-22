<script>
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import Button from "@smui/button";
  import Textfield from "../components/TextField.svelte";
  import HelperText from "@smui/textfield/helper-text/index";
  import DatePicker from "./../components/DatePicker.svelte";
  import Select from "./../components/Select.svelte";
  import { UNIT_AMENITIES_LIST, UNIT_TYPES_LIST } from "../../constants";
  import validateRentComp from "../../validation";

  export let values;
  const dispatch = createEventDispatcher();
  $: values.pricePerSqft = values.sqft ? (values.rent * 12) / values.sqft : NaN;
  $: invalid = validateRentComp(values);
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
    justify-content: flex-end;
    grid-column: 1 / 3;
  }
</style>

<h1 class="mdc-typography--headline1 ">Rent Comp</h1>
<form transition:fly={{ y: 800, duration: 500 }} on:submit|preventDefault={e => dispatch('submit', values)}>
  <Textfield
    name="address"
    required
    bind:value={values.address}
    label="Address" />
  <Select
    isMulti
    name="amenities"
    label="Amenities"
    items={UNIT_AMENITIES_LIST}
    placeholder="Select Unit Amenities"
    bind:selectedValue={values.amenities} />
  <Textfield name="city" required bind:value={values.city} label="City" />
  <Textfield name="state" bind:value={values.state} label="State" />
  <Textfield name="zip" bind:value={values.zip} label="Zip Code" />
  <Textfield
    name="unitNumber"
    bind:value={values.unitNumber}
    label="Unit Number" />
  <DatePicker
    name="dateOfValue"
    bind:value={values.dateOfValue}
    label="Date Of Value" />

  <Select
    name="unitLayout"
    label="Unit Type"
    items={UNIT_TYPES_LIST}
    bind:selectedValue={values.unitLayout}
    placeholder="Select Unit Type" />
  <Textfield
    name="bathrooms"
    required
    type="number"
    bind:value={values.bathrooms}
    label="Number of Bathrooms" />
  <Textfield
    required
    type="number"
    name="bedrooms"
    bind:value={values.bedrooms}
    label="Number of Bedrooms" />
  <Textfield
    type="number"
    name="sqft"
    bind:value={values.sqft}
    label="Unit Square Footage" />

  <Textfield
    required
    type="number"
    name="rent"
    bind:value={values.rent}
    label="Monthly Rent">
    <span slot="helperText">
      <HelperText persistent>
        Rent per SF:
        {#if isFinite(values.pricePerSqft)}
          ${values.pricePerSqft.toFixed(2)}
        {:else}N/A{/if}
      </HelperText>
    </span>
  </Textfield>
  <footer>
    <Button
      style="color: white;"
      variant="raised"
      disabled={invalid}
      type="submit">
      Submit
    </Button>
  </footer>
</form>

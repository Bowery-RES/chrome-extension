<script>
  import { createEventDispatcher } from 'svelte'
  import { fly } from 'svelte/transition'
  import Button from '@smui/button'
  import HelperText from '@smui/textfield/helper-text/index'

  import { fetchingStatus } from './../stores.js'
  import Input from '../components/Input.svelte'
  import DatePicker from './../components/DatePicker.svelte'
  import Select from './../components/Select.svelte'
  import { UNIT_AMENITIES_LIST, UNIT_TYPES_LIST } from '../../constants'
  import validateRentComp from '../../validation'

  export let values
  const dispatch = createEventDispatcher()
  $: values.pricePerSqft = values.sqft ? (values.rent * 12) / values.sqft : NaN
  $: invalid = validateRentComp(values)
</script>

<div class="subtitle1">Rent Comp</div>
<form transition:fly={{ y: 800, duration: 500 }} on:submit|preventDefault={(e) => dispatch('submit', values)}>
  <Input type="text" name="address" required bind:value={values.address} label="Address" />
  <Input type="text" name="unitNumber" required bind:value={values.unitNumber} label="Unit Number" />
  <Input type="text" name="city" required bind:value={values.city} label="City" />
  <Input type="text" name="state" required bind:value={values.state} label="State" />
  <Input type="text" name="zip" required bind:value={values.zip} label="Zip Code" />
  <Input type="number" required name="rent" step={1} bind:value={values.rent} label="Monthly Rent">
    <span slot="helperText">
      <HelperText persistent>
        Rent per SF:
        {#if isFinite(values.pricePerSqft)}
          ${values.pricePerSqft.toFixed(2)}
        {:else}N/A{/if}
      </HelperText>
    </span>
  </Input>
  <Input type="number" required step={1} name="bedrooms" bind:value={values.bedrooms} label="No. of Bedrooms" />
  <Input type="number" name="bathrooms" step={0.5} required bind:value={values.bathrooms} label="No. of Bathrooms" />
  <Input type="number" name="sqft" bind:value={values.sqft} label="Unit Square Footage" />
  <DatePicker name="dateOfValue" required bind:value={values.dateOfValue} label="Date of Value" />
  <Select
    name="unitLayout"
    label="Unit Type"
    items={UNIT_TYPES_LIST}
    bind:selectedValue={values.unitLayout}
    placeholder="Select Unit Type"
  />
  <Select
    isMulti
    name="amenities"
    label="Amenities"
    items={UNIT_AMENITIES_LIST}
    placeholder="Select Unit Amenities"
    bind:selectedValue={values.amenities}
  />

  <footer>
    <Button class="submit-button" variant="raised" disabled={invalid || $fetchingStatus.isLoading} type="submit"
      >Save Rent Comp</Button
    >
  </footer>
</form>

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
    grid-column: 1 / 3;
  }

  footer > :global(.submit-button) {
    color: white;
    flex-grow: 1;
    height: 48px;
  }
</style>

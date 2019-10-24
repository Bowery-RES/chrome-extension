<script>
  import Button from "@smui/button";
  import Textfield from "@smui/textfield";
  export let initialValues;

  let values = {
    ...initialValues
  }

  $: pricePerSqft = values.rent / values.sqft;
</script>

<style>
  section {
    width: 750px;
    height: 520px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }
  section :global(.textfield) {
    margin: 8px 10px;
  }
</style>

<section>
  <Textfield
    class="textfield"
    variant="outlined"
    dense
    bind:value={values.address}
    label="Address" />
  <Textfield
    class="textfield"
    variant="outlined"
    dense
    bind:value={values.city}
    label="City" />
  <Textfield
    class="textfield"
    variant="outlined"
    dense
    bind:value={values.state}
    label="State" />
  <Textfield
    class="textfield"
    variant="outlined"
    dense
    bind:value={values.zip}
    label="Zip Code" />

  <Textfield
    class="textfield"
    variant="outlined"
    dense
    bind:value={values.unitNumber}
    label="Unit Number" />

  <Textfield
    class="textfield"
    variant="outlined"
    dense
    bind:value={values.rent}
    label="Monthly Rent" />

  <Textfield
    class="textfield"
    variant="outlined"
    dense
    bind:value={values.bedrooms}
    label="Number of Bedrooms" />

  <Textfield
    class="textfield"
    variant="outlined"
    dense
    bind:value={values.bathrooms}
    label="Number of Bathrooms" />
  <Textfield
    class="textfield"
    variant="outlined"
    dense
    bind:value={values.sqft}
    label="Unit Square Footage" />

  <p>{pricePerSqft}</p>
  <footer>
    <Button>Cancel</Button>
    <Button>Submit</Button>
  </footer>
</section>

<script>
  import Flatpickr from "svelte-flatpickr/src/Flatpickr.svelte";

  import "flatpickr/dist/flatpickr.css";
  import "flatpickr/dist/themes/light.css";
  export let value;
  export let label;
  export let required;
  const flatpickrOptions = {
    element: "#picker",
    dateFormat: "m-d-Y"
  };
</script>

<style>
  span {
    position: absolute !important;
    top: -24px !important;
    font-weight: 600 !important;
  }
  :global(.mdc-notched-outline) {
    height: 36px;
  }

  .root {
    padding-top: 16px;
    position: relative;
    margin-top: 2px;
  }
  label {
    height: 36px !important;
  }
  .required::after {
    content: " *";
  }
</style>

<Flatpickr bind:value options={flatpickrOptions} element="#picker">
  <div class="root">
    <label
      id="picker"
      class="mdc-text-field flatpickr mdc-text-field--outlined
      mdc-text-field--dense">
      <span class:required>{label}</span>
      <input class="mdc-text-field__input" data-input />
      <div
        class="mdc-notched-outline mdc-notched-outline--upgraded
        mdc-notched-outline--notched">
        <div class="mdc-notched-outline__leading" />
        <div class="mdc-notched-outline__trailing" />
      </div>
    </label>
  </div>
</Flatpickr>

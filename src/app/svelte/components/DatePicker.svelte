<script>
  import Flatpickr from "svelte-flatpickr/src/Flatpickr.svelte";

  import "flatpickr/dist/flatpickr.css";
  import "flatpickr/dist/themes/light.css";
  export let value;
  export let label;
  const flatpickrOptions = {
    element: "#picker",
    dateFormat: "m-d-Y"
  };
</script>

<Flatpickr
  bind:value
  options={flatpickrOptions}
  placeholder="optional placeholder"
  element="#picker">
  <label
    class="mdc-text-field formField flatpickr mdc-text-field--outlined
    mdc-text-field--dense"
    id="picker">
    <input class="mdc-text-field__input" data-input />
    <div
      class="mdc-notched-outline mdc-notched-outline--upgraded
      mdc-notched-outline--notched">
      <div class="mdc-notched-outline__leading" />
      <div class="mdc-notched-outline__notch" style="width: 155.68px;">
        <span
          class="mdc-floating-label mdc-floating-label--float-above"
          style="">
          {label}
        </span>
      </div>
      <div class="mdc-notched-outline__trailing" />
    </div>
  </label>
</Flatpickr>

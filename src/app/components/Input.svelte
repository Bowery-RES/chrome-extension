<script>
  import { Input } from '@smui/textfield'
  export let value = ''
  export let label
  export let required
  export let disabled
  export let type
  export let step = 0.000001
  export let forceInvalid = false

  let invalid
</script>

<div class="root">
  <label
    class="mdc-text-field mdc-text-field--outlined mdc-text-field--dense {(forceInvalid || invalid) &&
      'mdc-text-field--invalid'}"
  >
    <span class:required>{label}</span>
    <Input {type} {required} {step} {disabled} bind:value bind:invalid />
    <div
      class="mdc-notched-outline mdc-notched-outline--upgraded
      mdc-notched-outline--notched"
    >
      <div class="mdc-notched-outline__leading" />
      <div class="mdc-notched-outline__trailing" />
    </div>
  </label>
  <slot name="helperText" />
</div>

<style>
  .root {
    padding-top: 16px;
    margin-top: 2px;
  }
  label {
    height: 36px !important;
  }
  span {
    position: absolute !important;
    top: -24px !important;
    font-weight: 600 !important;
  }
  .required::before {
    content: '*';
  }

  :global(.mdc-text-field) {
    width: 100%;
  }
  :global(.mdc-text-field__input) {
    padding: 12px 16px !important;
  }
</style>

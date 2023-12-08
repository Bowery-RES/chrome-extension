<script>
  import Textfield, { Input } from "@smui/textfield";
  export let value = "";
  export let label;
  export let required;
  export let disabled;
  export let type;
</script>

<style>
  div {
    padding-top: 16px;
    margin-top: 2px;
  }
  span {
    position: absolute !important;
    top: -24px !important;
    font-weight: 600 !important;
  }
  .required::before {
    content: "*";
  }
  :global(.mdc-text-field--invalid span) {
    color: rgba(255, 62, 0, 0.87);
  }

  :global(.mdc-text-field) {
    width: 100%;
  }
  :global(.mdc-text-field__input) {
    padding: 12px 16px !important;
  }
</style>

<div>
  <Textfield
    {type}
    bind:value
    on:change
    on:input
    input$required={required}
    {disabled}
    variant="outlined"
    noLabel>
    <span class:required>{label}</span>
  </Textfield>
  <slot name="helperText" />
</div>

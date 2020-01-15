<script>
  import Textfield, { Input } from "@smui/textfield";
  export let value;
  export let label;
  export let required;
  export let variant;
</script>

<style>
  div {
    padding-top: 16px;
    margin: 8px 0;
    width: 100%;
  }
  span {
    position: absolute !important;
    top: -24px !important;
    font-weight: 600 !important;
  }
  .required::after{
    content: " *"
  }
  :global(.mdc-text-field--invalid span) {
    color: rgba(255, 62, 0, .87);
  }

  :global(.mdc-text-field) {
    width: 100%;
  }
</style>

<div>
  <Textfield bind:value input$required={required} variant="outlined" noLabel>
    <span class:required>{label}</span>
  </Textfield>
  <slot name="helperText" />
</div>

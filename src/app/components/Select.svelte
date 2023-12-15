<script>
  import Select from "svelte-select/src/Select.svelte";
  export let selectedValue;
  export let placeholder = "Select Option";
  export let items = [];
  export let isMulti;
  export let label = "";
  export let isClearable = false;
  export let isSearchable = false;
</script>

<style>
  .select {
    --border: 1px solid rgba(0, 0, 0, 0.38);
    --borderFocusColor: #4160d3;
    --height: 34px;
    --borderRadius: 4px;
    --multiItemMargin: 4px 4px 0 0;
    --multiItemBG: #ebefff;
    --multiItemActiveBG: #e8efff;
    --multiItemActiveColor: -internal-root-color;
    --multiClearHoverBG: #4160d3;
    --multiClearHoverFill: #ebedef;
    --multiClearFill: rgba(0, 0, 0, 0.6);
    --multiClearBG: #ebefff;
    --placeholderColor: rgba(0, 0, 0, 0.6);
    --inputFontSize: 16px;
    --listMaxHeight: 200px;
    --clearSelectTop: 8px;
    --indicatorTop: 8px;
    --multiClearTop: 6px;
    --multiItemHeight: 28px;
    --multiSelectPadding: 0 35px 0 8px;
    padding-top: 16px;
    margin-top: 2px;
    position: relative;
  }

  :global(.select .multiSelect input) {
    height: 34px !important;
  }
  label {
    top: -8px;
    font-weight: 600 !important;
    position: absolute;
  }

  :global(.selectContainer) {
    --height: 36px;
  }
</style>

<div class="select">
  <label>{label}</label>
  <Select
    {isMulti}
    {placeholder}
    {items}
    {isClearable}
    {isSearchable}
    bind:selectedValue
    on:change={v => (selectedValue = v)} />
  <slot name="helperText" />
</div>

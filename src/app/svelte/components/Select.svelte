<script>
  import Select from "svelte-select/src/Select.svelte";
  export let selectedValue;
  export let placeholder = "Select Option";
  export let items = [];
  export let isMulti;
  export let label = '';
</script>

<style>
  .select {
    --border: 1px solid rgba(0, 0, 0, 0.38);
    --borderFocusColor: #4160d3;
    --height: 34px;
    --borderRadius: 4px;
    --multiItemMargin: 3px 4px 0 0;
    --multiItemBG: #e0e0e0;
    --multiItemActiveBG: rgb(206, 206, 206);
    --multiItemActiveColor: -internal-root-color;
    --multiClearHoverBG: #52616f;
    --multiClearHoverFill: #ebedef;
    --placeholderColor: rgba(0, 0, 0, 0.6);
    --inputFontSize: 1rem;
    --listMaxHeight: 200px;
    --clearSelectTop: 8px;
    --multiClearTop: 7px;
    --multiItemHeight: 28px;
    padding-top: 16px;
    margin-top: 2px;
    position: relative;
  }
  label {
    top: -8px;
    font-weight: 600 !important;
    position: absolute;
  }

  :global(.selectContainer){
    --height: 36px;
  }
</style>

<div class="select">
  <label>{label}</label>
  <Select
    {isMulti}
    {placeholder}
    {items}
    bind:selectedValue
    on:change={v => (selectedValue = v)} />
</div>

<script>
  import Select from "svelte-select/src/Select.svelte";
  let className = "";
  export { className as class };

</script>

<style>
  .select {
    --border: 1px solid rgba(0, 0, 0, 0.38);
    --borderFocusColor: #2a4370;
    --height: 46px;
    --borderRadius: 4px;
    --multiItemMargin: 8px 4px 0 0;
    --multiItemBG: #e0e0e0;
    --multiItemActiveBG: rgb(206, 206, 206);
    --multiItemActiveColor: -internal-root-color;
    --multiClearHoverBG: #52616f;
    --multiClearHoverFill: #ebedef;
    --placeholderColor: rgba(0,0,0,.6);
    --inputFontSize: 0.8rem;
    --listMaxHeight: 200px;
  }
</style>

<div class={`select ${className}`}>
  <Select {...$$props} isMulti={true} />
</div>

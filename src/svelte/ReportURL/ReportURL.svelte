<script>
  import axios from "axios";
  import get from "lodash/get";
  import { targetReport } from "./../stores.js";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text/index";
  import LastReportUsed from "./LastReportUsed.svelte";
  import { getReportAddress } from "@utils";
  let checked;

  $: address = getReportAddress($targetReport);
</script>

<style>
  section {
    display: flex;
  }
  div {
    max-width: 350px;
    margin: 8px 10px;
  }
</style>

<section>
  <div>
    <Textfield
      variant="outlined"
      style="width: 350px;"
      dense
      disabled={checked}
      bind:value={$targetReport}
      label="Report URL" />

    <HelperText class="mdc-typography--headline6" persistent>
      {#await address}
        loading...
      {:then value}
        {value || ''}
      {:catch error}
        Error: {error.message}
      {/await}
    </HelperText>
  </div>
  <LastReportUsed bind:value={$targetReport} bind:checked />
</section>

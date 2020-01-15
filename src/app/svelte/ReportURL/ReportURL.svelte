<script>
  import axios from "axios";
  import get from "lodash/get";
  import { targetReport } from "./../stores.js";
  import Textfield from "../components/TextField.svelte";
  import HelperText from "@smui/textfield/helper-text/index";
  import LastReportUsed from "./LastReportUsed.svelte";
  import { fetchReport } from "../../lib/api";
  let checked;

  $: report = fetchReport($targetReport);
</script>

<style>
  section {
    display: flex;
  }
  div {
    max-width: 300px;
    width: 300px;
  }
</style>

<section>
  <div>
    <Textfield
      variant="outlined"
      disabled={checked}
      bind:value={$targetReport}
      label="Report URL">
      <span slot="helperText">
        <HelperText class="mdc-typography--headline6" persistent>
          {#await report}
            loading...
          {:then reportData}
            {get(reportData, 'new.address', '')}
          {:catch error}
            Error: {error.message}
          {/await}
        </HelperText>
      </span>
    </Textfield>

  </div>
  <LastReportUsed bind:value={$targetReport} bind:checked />
</section>

<script>
  import axios from "axios";
  import get from "lodash/get";
  import { targetReport } from "./../stores.js";
  import Textfield from "../components/TextField.svelte";
  import HelperText from "@smui/textfield/helper-text/index";
  import LastReportUsed from "./LastReportUsed.svelte";
  import { fetchReport } from "../../lib/api";
  let checked;

  $: report = fetchReport($targetReport.value);
</script>

<style>
  section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 30px;
  }
</style>

<section>
  <div>
    <Textfield
      variant="outlined"
      disabled={checked}
      bind:value={$targetReport.value}
      label="Report URL">
      <span slot="helperText">
        <HelperText class="mdc-typography--headline6" persistent>
          {#await report}
            loading...
          {:then reportData}
            <a href={`${$targetReport.value}/residential-rent-comps`} target="_blank">
              {get(reportData, 'new.address', '')}
            </a>
          {:catch error}
            Error: {error.message}
          {/await}
        </HelperText>
      </span>
    </Textfield>

  </div>
  <LastReportUsed bind:checked />
</section>

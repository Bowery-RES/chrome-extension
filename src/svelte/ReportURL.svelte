<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import get from "lodash/get";
  import uniqBy from "lodash/uniqBy";
  import { BOWERY_APP_DOMAIN } from "secrets";
  import Select, { Option } from "@smui/select";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text/index";
  import Switch from "@smui/switch";
  import FormField from "@smui/form-field";
  import LastReportUsed from "./LastReportUsed.svelte";

  let checked;
  let lastReports = [];
  export let value = "";

  $: address = chrome.storage.local
    .get("token")
    .then(({ token }) =>
      axios.get(value, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      })
    )
    .then(({ data }) => {
      return get(data, "new.address");
    });
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
      bind:value
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
  <LastReportUsed bind:value={value} bind:checked />
</section>

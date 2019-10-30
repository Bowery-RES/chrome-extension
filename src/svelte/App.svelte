<script>
  import UnitRentComp from "./UnitRentComp/UnitRentComp.svelte";
  import Loading from './components/Loading.svelte'
  import ReportUrl from './ReportURL/ReportURL.svelte'
  
  const initialValues = new Promise((resolve, reject) => {
    function extensionListener({ type, data, error }) {
      if (error) {
        reject(new Error(error));
      }

      if (type === "comp-parsed") {
        resolve(data);
        chrome.extension.onRequest.removeListener(extensionListener);
      }
    }
    chrome.extension.onRequest.addListener(extensionListener);
    chrome.extension.sendRequest({ type: "popup-opened" });
  });

</script>

<style>
  main {
    padding: 16px;
    width: 750px;
    height: 527px;
  }
</style>

<main>
  {#await initialValues}
    <Loading/>
  {:then value}
    <ReportUrl />
    <UnitRentComp initialValues={value} />
  {:catch error}
    <p>Something went wrong: {error.message}</p>
  {/await}
</main>

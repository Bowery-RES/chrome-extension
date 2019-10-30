<script>
  import RentComp from "./RentComp.svelte";
  import Loading from './Loading.svelte'
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
    <RentComp initialValues={value} />
  {:catch error}
    <p>Something went wrong: {error.message}</p>
  {/await}
</main>

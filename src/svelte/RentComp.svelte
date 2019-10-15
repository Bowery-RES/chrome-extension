<script>

  let first = "asdasd";
  let result = "None";
  let token = "";
  async function test() {
    debugger;
    result = await new Promise(res => {
      chrome.extension.onRequest.addListener(function(parsedData) {
        debugger;
        console.log(parsedData);
        res(parsedData);
      });

      chrome.tabs.executeScript(null, {
        file: "parse-comp.bundle.js"
      });
    });
  }
</script>

<main>
  <input bind:value={first} placeholder="first" name="id" />
  <button on:click={test}>test</button>
  <p>{JSON.stringify(result)}</p>
  <p>TOKEN: {JSON.stringify(token)}</p>
</main>

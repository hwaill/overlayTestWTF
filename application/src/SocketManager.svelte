<script>
  import { onMount } from "svelte";

  import { socketUpdateStore } from "./socketClientConnect.js"
  import { createSocketConnection } from "./socketClientConnect.js";
  import { socketUpdateProcessor } from "./socketUpdateProcessor.js";

  onMount(() => {
    createSocketConnection()
  });

  $: socketUpdateProcessor($socketUpdateStore);
</script>

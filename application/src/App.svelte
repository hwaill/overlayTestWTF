<script>
  import { onMount } from "svelte";

  import { createSocketConnection, socketSendMessage } from "./socketClientConnect.js";
  import { socketUpdateProcessor } from "./socketUpdateProcessor.js";
  import { updateStateStore, currentArenaStore, ballStore, playersStore, teamsStore } from "./stores";

  import Minimap from "./Minimap.svelte";

  let socketUpdateStore;
  onMount(() => {
    socketUpdateStore = createSocketConnection();
  });

  $: socketUpdateProcessor($socketUpdateStore);

  let sendMessage = () => {
    socketSendMessage({
      event: "controller:minimap_visible",
      data: {
        isVisible: "test minimap visible message",
      },
    });
  };
</script>

<main>
  <Minimap />

  <button on:click={sendMessage}>Click me!</button>
  <p>test</p>
</main>

<style>
</style>

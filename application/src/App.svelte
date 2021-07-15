<script>
  import { onMount } from "svelte";

  import { createSocketConnection, socketSendMessage } from "./containers/socketManager.js";

  import Minimap from "./Minimap.svelte";

  onMount(() => {
    createSocketConnection();
  });

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

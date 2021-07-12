import socketIOClient from "socket.io-client";
import { writable } from "svelte/store";

export const createSocketConnection = () => {
  const socketUpdateStore = writable({});

  const socket = socketIOClient("http://localhost:6969", {
    withCredentials: true,
  });

  socket.emit("join", "FRONTEND");
  socket.emit("watchGame");

  socket.on("payload", async (data) => {
    socketUpdateStore.set(data);
  });

  socket.on("update", (update) => {
    console.log(update);
    socketUpdateStore.set(update);
  });

  return socketUpdateStore;
};

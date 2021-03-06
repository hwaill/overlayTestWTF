import socketIOClient from "socket.io-client";
import { writable } from "svelte/store";

let socket;

export const socketUpdateStore = writable({});

export const createSocketConnection = () => {

  socket = socketIOClient("http://localhost:6969", {
    withCredentials: true,
  });

  socket.on("connect", () => {
    socket.emit("join", "FRONTEND");
    socket.emit("watchGame");
  });

  socket.on("payload", async (data) => {
    // socketUpdateStore.set(data);
  });

  socket.on("update", (update) => {
    console.log(update)
    // socketUpdateStore.set(update);
  });
};

export const socketSendMessage = (message) => {
  socket.emit("payload", message);
};

export const hideDefaultOverlay = () => {
  rconSend('rcon_refresh_allowed');
    rconSend('replay_gui hud 1');
    rconSend('replay_gui matchinfo 1');
    setTimeout(() => {
      rconSend('replay_gui hud 0');
      rconSend('replay_gui matchinfo 0');
    }, 300);
}
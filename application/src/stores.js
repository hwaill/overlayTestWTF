import { derived, writable } from "svelte/store";

export const updateStateStore = writable({
  game: {
    arena: "",
    ball: {
      location: {
        X: "",
        Y: "",
        Z: "",
      },
      speed: "",
      team: "",
    },
    hasTarget: "",
    hasWinner: "",
    isOT: false,
    isReplay: false,
    target: "",
    teams: {
      0: {
        color_primary: "000000",
        color_secondary: "000000",
        name: "",
        score: "",
      },
      1: {
        color_primary: "000000",
        color_secondary: "000000",
        name: "",
        score: "",
      },
    },
    time: "",
    winner: "",
  },
  hasGame: false,
  players: {},
});
export const currentArenaStore = derived(updateStateStore, ($updateStateStore) => $updateStateStore.game.arena);
export const ballStore = derived(updateStateStore, ($updateStateStore) => $updateStateStore.game.ball);
export const playersStore = derived(updateStateStore, ($updateStateStore) => $updateStateStore.players);
export const teamsStore = derived(updateStateStore, ($updateStateStore) => $updateStateStore.game.teams);
export const focusedPlayerIDStore = derived(updateStateStore, ($updateStateStore) => $updateStateStore.game.target);

export const hasHiddenDefaultOverlay = writable(false);
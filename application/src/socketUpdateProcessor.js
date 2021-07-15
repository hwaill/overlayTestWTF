import { focusedPlayerIDStore, updateStateStore, currentArenaStore, ballStore, playersStore, teamsStore, hasHiddenDefaultOverlay } from "./stores";
import { hideDefaultOverlay } from "./socketClientConnect.js";

export const socketUpdateProcessor = (updateToProcess) => {
  if (updateToProcess) {
    let data = updateToProcess.data;
    let event = updateToProcess.event;

    event === "game:match_created" && handleUpdate_game_matchCreated(data);
    event === "game:initialized" && handleUpdate_game_initialized(data);
    event === "game:pre_countdown_begin" && handleUpdate_game_preCountdownBegin(data);
    event === "game:post_countdown_begin" && handleUpdate_game_postCountdownBegin(data);
    event === "game:update_state" && handleUpdate_game_updateState(data);
    event === "game:ball_hit" && handleUpdate_game_ballHit(data);
    event === "game:statfeed_event" && handleUpdate_game_statfeedEvent(data);
    event === "game:goal_scored" && handleUpdate_game_goalScored(data);
    event === "game:replay_start" && handleUpdate_game_replayStart(data);
    event === "game:replay_will_end" && handleUpdate_game_replayWillEnd(data);
    event === "game:replay_end" && handleUpdate_game_replayEnd(data);
    event === "game:match_ended" && handleUpdate_game_matchEnded(data);
    event === "game:podium_start" && handleUpdate_game_podiumStart(data);
    event === "game:match_destroyed" && handleUpdate_game_matchDestroyed(data);
    event === "controller:minimap_visible" && handleUpdate_controller_minimapVisible(data);
  }
};

const handleUpdate_game_matchCreated = (d) => {};

const handleUpdate_game_initialized = (d) => {
  // if ($hasHiddenDefaultOverlay == false) {
  //   console.log('test');
  //   hideDefaultOverlay();
  //   hasHiddenDefaultOverlay.set(true);
  // }
};

const handleUpdate_game_preCountdownBegin = (d) => {};

const handleUpdate_game_postCountdownBegin = (d) => {};

const handleUpdate_game_updateState = (d) => {
  updateStateStore.set(d);
  // console.log($hasHiddenDefaultOverlay);
  // if ($hasHiddenDefaultOverlay == false) {
  //   console.log('test');
  //   hideDefaultOverlay();
  //   hasHiddenDefaultOverlay.set(true);
  // }
};

const handleUpdate_game_ballHit = (d) => {};

const handleUpdate_game_statfeedEvent = (d) => {};

const handleUpdate_game_goalScored = (d) => {};

const handleUpdate_game_replayStart = (d) => {};

const handleUpdate_game_replayWillEnd = (d) => {};

const handleUpdate_game_replayEnd = (d) => {};

const handleUpdate_game_matchEnded = (d) => {};

const handleUpdate_game_podiumStart = (d) => {};

const handleUpdate_game_matchDestroyed = (d) => {};

const handleUpdate_controller_minimapVisible = (d) => {};

function rconSend(command) {
  socket.emit('RCON', {
    data: {
      command: command,
    },
  });
}
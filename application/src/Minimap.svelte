<script>
  import { onMount } from "svelte";

  import { teamsStore, ballStore, playersStore, focusedPlayerIDStore } from "./stores";

  //minimap camera parameters
  let fieldCornerInset = 1152;
  let fieldGoalDepth = 880;
  let fieldGoalWidth = 893;
  let fieldWidth = 4096;
  let fieldLength = 5120;
  let goalHeight = 643;
  let projectionDist = 46000;
  let cameraDist = 48000;
  let mapDepth = -18000;
  let ballSize = 7;
  let playerSize = 5;
  let objectDist;
  let objectX;
  let objectY;

  $: team0Color = $teamsStore[0] ? $teamsStore[0].color_primary : "000000";
  $: team1Color = $teamsStore[1] ? $teamsStore[1].color_primary : "000000";

  let field3DBaseCanvas;
  let field3DLinesCanvas;
  let field3DDotsCanvas;
  let field3DBaseContext;
  let field3DLinesContext;
  let field3DDotsContext;

  let hasMounted = false;

  onMount(() => {
    field3DBaseCanvas = document.getElementById("field3DBase");
    field3DLinesCanvas = document.getElementById("field3DLines");
    field3DDotsCanvas = document.getElementById("field3DDots");
    field3DBaseContext = field3DBaseCanvas.getContext("2d");
    field3DLinesContext = field3DLinesCanvas.getContext("2d");
    field3DDotsContext = field3DDotsCanvas.getContext("2d");

    field3DBaseContext.translate(1280, 560);
    field3DLinesContext.translate(1280, 560);
    field3DDotsContext.translate(1280, 560);

    drawFieldBase(field3DBaseContext);

    hasMounted = true;
  });

  $: team0Color || team1Color || hasMounted, colorUpdated();
  const colorUpdated = () => {
    if (hasMounted) {
      field3DLinesContext.clearRect(-1280, -560, 2560, 1440);
      drawFieldOutlines(field3DLinesContext, "#" + team0Color + "b0", "#" + team1Color + "b0");
    }
  };

  $: $ballStore || $playersStore || hasMounted, updateMinimap();

  let players = [];
  let playerIterator = 0;
  $: numPlayers = Object.keys($playersStore).length;
  const updateMinimap = () => {
    if (hasMounted) {
      playerIterator = 0;
      for (let nameKey of Object.keys($playersStore)) {
        players[playerIterator++] = {
          id: $playersStore[nameKey].id,
          posX: $playersStore[nameKey].location ? $playersStore[nameKey].location.X : null,
          posY: $playersStore[nameKey].location ? $playersStore[nameKey].location.Y : null,
          posZ: $playersStore[nameKey].location ? $playersStore[nameKey].location.Z : null,
          name: $playersStore[nameKey].name,
          team: $playersStore[nameKey].team,
        };
      }

      let ballX = $ballStore.location.X;

      let playerIndex = [];
      for (let i = 0; i < numPlayers; i++) {
        playerIndex[i] = i;
      }

      for (let i = 0; i < numPlayers - 1; i++) {
        for (let j = i + 1; j < numPlayers; j++) {
          if (players[playerIndex[j]].posX > players[playerIndex[j - 1]].posX) {
            let temp = playerIndex[j];
            playerIndex[j] = playerIndex[j - 1];
            playerIndex[j - 1] = temp;
          }
        }
      }

      field3DDotsContext.clearRect(-1280, -560, 2560, 1440);

      let ballRendered = false;
      let thisPlayerColor;
      for (let i = numPlayers - 1; i >= 0; i--) {
        if ($ballStore.location.X > players[playerIndex[i]].posX && !ballRendered) {
          drawPoint($ballStore.location.X, $ballStore.location.Y, $ballStore.location.Z, "#ffffff", ballSize, field3DDotsContext, false);
          ballRendered = true;
        }

        thisPlayerColor = players[playerIndex[i]].team == 0 ? team0Color : team1Color;

        if (players[playerIndex[i]].posX != null) {
          drawPoint(players[playerIndex[i]].posX, players[playerIndex[i]].posY, players[playerIndex[i]].posZ, "#" + thisPlayerColor, playerSize, field3DDotsContext, players[playerIndex[i]].id == $focusedPlayerIDStore ? true : false);
        }
      }

      if (!ballRendered) {
        drawPoint($ballStore.location.X, $ballStore.location.Y, $ballStore.location.Z, "#ffffff", ballSize, field3DDotsContext, false);
      }
    }
  };

  function drawPoint(x, y, z, color, size, context, isFocused) {
    drawPointLine(x, y, z, color + "80", context);
    if (isFocused) {
      context.fillStyle = "#ffffff";
      context.beginPath();
      context.arc(pointTo2DX(-1 * x, -1 * y, mapDepth + z), pointTo2DY(-1 * x, -1 * y, mapDepth + z), size + 2, 0, 2 * Math.PI);
      context.fill();
    }

    context.fillStyle = color;
    context.beginPath();
    context.arc(pointTo2DX(-1 * x, -1 * y, mapDepth + z), pointTo2DY(-1 * x, -1 * y, mapDepth + z), size, 0, 2 * Math.PI);
    context.fill();
  }

  function drawPointLine(x, y, z, color, context) {
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(pointTo2DX(-1 * x, -1 * y, mapDepth + z), pointTo2DY(-1 * x, -1 * y, mapDepth + z));
    context.lineTo(pointTo2DX(-1 * x, -1 * y, mapDepth), pointTo2DY(-1 * x, -1 * y, mapDepth));
    context.stroke();
  }

  function drawFieldOutlines(context, team1Color, team2Color) {
    context.lineJoin = "round";
    context.strokeStyle = team1Color;
    context.lineWidth = 6;
    context.lineCap = "round";

    //left team outline
    context.beginPath();
    context.moveTo(pointTo2DX(-fieldWidth, 200, mapDepth), pointTo2DY(-fieldWidth, 200, mapDepth));
    context.lineTo(pointTo2DX(-fieldWidth, fieldLength - fieldCornerInset, mapDepth), pointTo2DY(-fieldWidth, fieldLength - fieldCornerInset, mapDepth));
    context.lineTo(pointTo2DX(-fieldWidth + fieldCornerInset, fieldLength, mapDepth), pointTo2DY(-fieldWidth + fieldCornerInset, fieldLength, mapDepth));
    context.lineTo(pointTo2DX(-fieldGoalWidth, fieldLength, mapDepth), pointTo2DY(-fieldGoalWidth, fieldLength, mapDepth));
    context.lineTo(pointTo2DX(-fieldGoalWidth, fieldLength + fieldGoalDepth, mapDepth), pointTo2DY(-fieldGoalWidth, fieldLength + fieldGoalDepth, mapDepth));
    context.lineTo(pointTo2DX(fieldGoalWidth, fieldLength + fieldGoalDepth, mapDepth), pointTo2DY(fieldGoalWidth, fieldLength + fieldGoalDepth, mapDepth));
    context.lineTo(pointTo2DX(fieldGoalWidth, fieldLength, mapDepth), pointTo2DY(fieldGoalWidth, fieldLength, mapDepth));
    context.lineTo(pointTo2DX(fieldWidth - fieldCornerInset, fieldLength, mapDepth), pointTo2DY(fieldWidth - fieldCornerInset, fieldLength, mapDepth));
    context.lineTo(pointTo2DX(fieldWidth, fieldLength - fieldCornerInset, mapDepth), pointTo2DY(fieldWidth, fieldLength - fieldCornerInset, mapDepth));
    context.lineTo(pointTo2DX(fieldWidth, 200, mapDepth), pointTo2DY(fieldWidth, 200, mapDepth));
    context.stroke();

    //right team outline
    context.strokeStyle = team2Color;
    context.beginPath();
    context.moveTo(pointTo2DX(fieldWidth, -200, mapDepth), pointTo2DY(fieldWidth, -200, mapDepth));
    context.lineTo(pointTo2DX(fieldWidth, -fieldLength + fieldCornerInset), pointTo2DY(fieldWidth, -fieldLength + fieldCornerInset, mapDepth));
    context.lineTo(pointTo2DX(fieldWidth - fieldCornerInset, -fieldLength, mapDepth), pointTo2DY(fieldWidth - fieldCornerInset, -fieldLength, mapDepth));
    context.lineTo(pointTo2DX(fieldGoalWidth, -fieldLength, mapDepth), pointTo2DY(fieldGoalWidth, -fieldLength, mapDepth));
    context.lineTo(pointTo2DX(fieldGoalWidth, -1 * (fieldLength + fieldGoalDepth), mapDepth), pointTo2DY(fieldGoalWidth, -1 * (fieldLength + fieldGoalDepth), mapDepth));

    context.lineTo(pointTo2DX(-fieldGoalWidth, -1 * (fieldLength + fieldGoalDepth), mapDepth), pointTo2DY(-fieldGoalWidth, -1 * (fieldLength + fieldGoalDepth), mapDepth));
    context.lineTo(pointTo2DX(-fieldGoalWidth, -fieldLength, mapDepth), pointTo2DY(-fieldGoalWidth, -fieldLength, mapDepth));
    context.lineTo(pointTo2DX(-fieldWidth + fieldCornerInset, -fieldLength, mapDepth), pointTo2DY(-fieldWidth + fieldCornerInset, -fieldLength, mapDepth));
    context.lineTo(pointTo2DX(-fieldWidth, -fieldLength + fieldCornerInset, mapDepth), pointTo2DY(-fieldWidth, -fieldLength + fieldCornerInset, mapDepth));
    context.lineTo(pointTo2DX(-fieldWidth, -200, mapDepth), pointTo2DY(-fieldWidth, -200, mapDepth));
    context.stroke();

    return;
  }

  function drawFieldBase(context) {
    context.fillStyle = "rgba(0,0,0,0.5)";
    context.lineWidth = 10;

    context.beginPath();
    context.moveTo(pointTo2DX(-fieldWidth, fieldLength - fieldCornerInset, mapDepth), pointTo2DY(-fieldWidth, fieldLength - fieldCornerInset, mapDepth));
    context.lineTo(pointTo2DX(-fieldWidth + fieldCornerInset, fieldLength, mapDepth), pointTo2DY(-fieldWidth + fieldCornerInset, fieldLength, mapDepth));
    context.lineTo(pointTo2DX(-fieldGoalWidth, fieldLength, mapDepth), pointTo2DY(-fieldGoalWidth, fieldLength, mapDepth));
    context.lineTo(pointTo2DX(-fieldGoalWidth, fieldLength + fieldGoalDepth, mapDepth), pointTo2DY(-fieldGoalWidth, fieldLength + fieldGoalDepth, mapDepth));

    context.lineTo(pointTo2DX(fieldGoalWidth, fieldLength + fieldGoalDepth, mapDepth), pointTo2DY(fieldGoalWidth, fieldLength + fieldGoalDepth, mapDepth));
    context.lineTo(pointTo2DX(fieldGoalWidth, fieldLength, mapDepth), pointTo2DY(fieldGoalWidth, fieldLength, mapDepth));
    context.lineTo(pointTo2DX(fieldWidth - fieldCornerInset, fieldLength, mapDepth), pointTo2DY(fieldWidth - fieldCornerInset, fieldLength, mapDepth));
    context.lineTo(pointTo2DX(fieldWidth, fieldLength - fieldCornerInset, mapDepth), pointTo2DY(fieldWidth, fieldLength - fieldCornerInset, mapDepth));

    context.lineTo(pointTo2DX(fieldWidth, -fieldLength + fieldCornerInset), pointTo2DY(fieldWidth, -fieldLength + fieldCornerInset, mapDepth));
    context.lineTo(pointTo2DX(fieldWidth - fieldCornerInset, -fieldLength, mapDepth), pointTo2DY(fieldWidth - fieldCornerInset, -fieldLength, mapDepth));
    context.lineTo(pointTo2DX(fieldGoalWidth, -fieldLength, mapDepth), pointTo2DY(fieldGoalWidth, -fieldLength, mapDepth));
    context.lineTo(pointTo2DX(fieldGoalWidth, -1 * (fieldLength + fieldGoalDepth), mapDepth), pointTo2DY(fieldGoalWidth, -1 * (fieldLength + fieldGoalDepth), mapDepth));

    context.lineTo(pointTo2DX(-fieldGoalWidth, -1 * (fieldLength + fieldGoalDepth), mapDepth), pointTo2DY(-fieldGoalWidth, -1 * (fieldLength + fieldGoalDepth), mapDepth));
    context.lineTo(pointTo2DX(-fieldGoalWidth, -fieldLength, mapDepth), pointTo2DY(-fieldGoalWidth, -fieldLength, mapDepth));
    context.lineTo(pointTo2DX(-fieldWidth + fieldCornerInset, -fieldLength, mapDepth), pointTo2DY(-fieldWidth + fieldCornerInset, -fieldLength, mapDepth));
    context.lineTo(pointTo2DX(-fieldWidth, -fieldLength + fieldCornerInset, mapDepth), pointTo2DY(-fieldWidth, -fieldLength + fieldCornerInset, mapDepth));
    context.closePath();
    context.fill();

    return;
  }

  function pointTo2DY(x, y, z) {
    objectDist = x;
    objectY = z;
    objectX = y;

    return (-1 * (objectY * (cameraDist - projectionDist))) / (cameraDist - objectDist);
  }

  function pointTo2DX(x, y, z) {
    objectDist = x;
    objectY = z;
    objectX = y;

    return (-1 * (objectX * (cameraDist - projectionDist))) / (cameraDist - objectDist);
  }
</script>

<div id="minimap">
  <canvas id="field3DBase" width="2560px" height="1440px" />
  <canvas id="field3DLines" width="2560px" height="1440px" />
  <canvas id="field3DDots" width="2560px" height="1440px" />
</div>

<style>
  #field3DBase,
  #field3DLines,
  #field3DDots {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
</style>

import { gameState, initialUpgrades } from "./state.js";
import { startProject, progressWork, fixBugs, polishProject, marketProject, restPlayer, releaseProject } from "./projects.js";
import { triggerRandomEvent } from "./events.js";
import { saveGame, loadGame, loadGameFromFile, downloadSaveXml, resetGame } from "./save.js";
import { renderUI, showReleaseModal, wireModal } from "./ui.js";

const actions = {
  "action-work": progressWork,
  "action-fix": fixBugs,
  "action-polish": polishProject,
  "action-market": marketProject,
  "action-rest": restPlayer,
};

function initializeGame() {
  gameState.upgrades = JSON.parse(JSON.stringify(initialUpgrades));
  gameState.eventLog = ["Welcome to Indie Dev Studio Simulator! Start a new project to begin."];
  wireModal();
  attachListeners();
  renderUI();
}

function applyPassiveIncome() {
  const income = Math.max(
    Math.round(gameState.fans * 0.12 + gameState.releasedGames.length * 5 + Math.max(gameState.reputation, 0) * 0.3),
    0,
  );
  if (income > 0) {
    gameState.money += income;
    gameState.eventLog.unshift(`Passive income: +$${income} from fans buying your games.`);
    if (gameState.eventLog.length > 10) {
      gameState.eventLog.pop();
    }
    renderUI();
  }
}

function attachListeners() {
  document.getElementById("start-project-button").addEventListener("click", () => {
    const name = document.getElementById("project-name").value.trim();
    const genre = document.getElementById("project-genre").value;
    const size = document.getElementById("project-size").value;
    if (startProject(name, genre, size)) {
      renderUI();
    }
  });

  Object.keys(actions).forEach(actionId => {
    document.getElementById(actionId).addEventListener("click", () => {
      const action = actions[actionId];
      const result = action();
      if (result.ok) {
        triggerRandomEvent();
      }
      renderUI();
    });
  });

  document.getElementById("action-release").addEventListener("click", () => {
    const result = releaseProject();
    if (result.ok) {
      showReleaseModal(result.result, result.releaseRecord.name);
      renderUI();
    }
  });

  document.getElementById("save-button").addEventListener("click", () => {
    saveGame();
    downloadSaveXml();
    renderUI();
  });

  document.getElementById("load-button").addEventListener("click", () => {
    const fileInput = document.getElementById("load-file-input");
    if (fileInput) {
      fileInput.click();
    }
  });

  const fileInput = document.getElementById("load-file-input");
  if (fileInput) {
    fileInput.addEventListener("change", async event => {
      const file = event.target.files?.[0];
      if (file) {
        const success = await loadGameFromFile(file);
        if (success) {
          renderUI();
        }
        fileInput.value = "";
      }
    });
  }

  document.getElementById("reset-button").addEventListener("click", () => {
    resetGame();
    renderUI();
  });
}

window.addEventListener("load", () => {
  initializeGame();
  setInterval(applyPassiveIncome, 60000);
});

import { gameState } from "./state.js";
import { canPerformAction } from "./projects.js";
import { buyUpgrade } from "./upgrades.js";
import { releaseProject } from "./projects.js";

const elements = {
  statDay: document.getElementById("stat-day"),
  statMoney: document.getElementById("stat-money"),
  statEnergy: document.getElementById("stat-energy"),
  statStress: document.getElementById("stat-stress"),
  statFans: document.getElementById("stat-fans"),
  statReputation: document.getElementById("stat-reputation"),
  projectPanel: document.getElementById("project-panel"),
  upgradeList: document.getElementById("upgrade-list"),
  eventLog: document.getElementById("event-log"),
  releasedGames: document.getElementById("released-games"),
  actionWork: document.getElementById("action-work"),
  actionFix: document.getElementById("action-fix"),
  actionPolish: document.getElementById("action-polish"),
  actionMarket: document.getElementById("action-market"),
  actionRest: document.getElementById("action-rest"),
  actionRelease: document.getElementById("action-release"),
  releaseModal: document.getElementById("release-modal"),
  releaseDetails: document.getElementById("release-details"),
  closeReleaseModal: document.getElementById("close-release-modal"),
};

export function renderUI() {
  updateStats();
  renderProjectPanel();
  renderUpgradeShop();
  renderEventLog();
  renderReleasedGames();
  updateActionButtons();
}

function updateStats() {
  elements.statDay.textContent = gameState.day;
  elements.statMoney.textContent = `$${gameState.money}`;
  elements.statEnergy.textContent = `${gameState.energy}`;
  elements.statStress.textContent = `${gameState.stress}`;
  elements.statFans.textContent = `${gameState.fans}`;
  elements.statReputation.textContent = `${gameState.reputation}`;
}

function renderProjectPanel() {
  if (!gameState.currentProject) {
    elements.projectPanel.innerHTML = `<p>No project active yet. Start one to begin building your studio.</p>`;
    return;
  }
  const project = gameState.currentProject;
  elements.projectPanel.innerHTML = `
    <p class="project-stat"><span><strong>${project.name}</strong> (${project.genre})</span><span>${project.size}</span></p>
    <div class="project-stat"><span>Progress</span><span>${project.progress}/${project.progressNeeded}</span></div>
    <div class="progress-bar"><span style="width:${Math.round((project.progress / project.progressNeeded) * 100)}%"></span></div>
    <div class="project-stat"><span>Quality</span><span>${project.quality}</span></div>
    <div class="project-stat"><span>Bugs</span><span>${project.bugs}</span></div>
    <div class="project-stat"><span>Hype</span><span>${project.hype}</span></div>
  `;
}

function renderUpgradeShop() {
  elements.upgradeList.innerHTML = "";
  gameState.upgrades.forEach(upgrade => {
    const item = document.createElement("div");
    item.className = "upgrade-item";
    item.innerHTML = `
      <h4>${upgrade.name}</h4>
      <p>${upgrade.description}</p>
      <small>Cost: $${upgrade.cost}</small>
      <button data-upgrade-id="${upgrade.id}" ${upgrade.purchased ? "disabled" : ""}>${upgrade.purchased ? "Purchased" : "Buy"}</button>
    `;
    const button = item.querySelector("button");
    button.addEventListener("click", () => {
      const result = buyUpgrade(upgrade.id);
      if (result.ok) {
        renderUI();
      }
    });
    elements.upgradeList.appendChild(item);
  });
}

function renderEventLog() {
  elements.eventLog.innerHTML = "";
  gameState.eventLog.slice(0, 6).forEach(entry => {
    const item = document.createElement("div");
    item.className = "event-log-item";
    item.textContent = entry;
    elements.eventLog.appendChild(item);
  });
}

function renderReleasedGames() {
  elements.releasedGames.innerHTML = "";
  if (gameState.releasedGames.length === 0) {
    elements.releasedGames.innerHTML = `<p>You have not released a game yet.</p>`;
    return;
  }
  gameState.releasedGames.forEach(game => {
    const item = document.createElement("div");
    item.className = "released-game";
    item.innerHTML = `
      <strong>${game.name}</strong>
      <p>Score: ${game.score}/10 • Earnings: $${game.earnings}</p>
      <p>Fans: +${game.fans} • Reputation: ${game.reputation > 0 ? "+" : ""}${game.reputation}</p>
    `;
    elements.releasedGames.appendChild(item);
  });
}

function updateActionButtons() {
  elements.actionWork.disabled = !canPerformAction("work");
  elements.actionFix.disabled = !canPerformAction("fix");
  elements.actionPolish.disabled = !canPerformAction("polish");
  elements.actionMarket.disabled = !canPerformAction("market");
  elements.actionRelease.disabled = !(gameState.currentProject && gameState.currentProject.progress >= gameState.currentProject.progressNeeded);
}

export function showReleaseModal(result, projectName) {
  elements.releaseDetails.innerHTML = `
    <p><strong>${projectName}</strong> is out now!</p>
    <p>Review Score: <strong>${result.reviewScore}/10</strong></p>
    <p>Money Earned: <strong>$${result.moneyEarned}</strong></p>
    <p>Fans Gained: <strong>+${result.fansEarned}</strong></p>
    <p>Reputation Change: <strong>${result.reputationChange >= 0 ? "+" : ""}${result.reputationChange}</strong></p>
  `;
  elements.releaseModal.classList.remove("hidden");
}

export function closeModal() {
  elements.releaseModal.classList.add("hidden");
}

export function wireModal() {
  elements.closeReleaseModal.addEventListener("click", closeModal);
}

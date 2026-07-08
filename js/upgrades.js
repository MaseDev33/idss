import { gameState } from "./state.js";

export function initializeUpgrades() {
  if (gameState.upgrades.length === 0) {
    gameState.upgrades = JSON.parse(JSON.stringify(gameState.upgrades));
  }
}

export function buyUpgrade(upgradeId) {
  const upgrade = gameState.upgrades.find(u => u.id === upgradeId);
  if (!upgrade) return { ok: false, reason: "Upgrade not found" };
  if (upgrade.purchased) return { ok: false, reason: "Already purchased" };
  if (gameState.money < upgrade.cost) return { ok: false, reason: "Not enough money" };
  gameState.money -= upgrade.cost;
  upgrade.purchased = true;
  gameState.eventLog.unshift(`Purchased ${upgrade.name}.`);
  return { ok: true };
}

export function loadDefaultUpgrades(defaultUpgrades) {
  gameState.upgrades = defaultUpgrades.map(u => ({ ...u }));
}

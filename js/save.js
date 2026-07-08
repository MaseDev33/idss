import { gameState, initialUpgrades } from "./state.js";

const saveKey = "indie-dev-studio-sim-save";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildXml(state) {
  const currentProjectXml = state.currentProject
    ? `<currentProject>
        <name>${escapeXml(state.currentProject.name)}</name>
        <genre>${escapeXml(state.currentProject.genre)}</genre>
        <size>${escapeXml(state.currentProject.size)}</size>
        <progress>${state.currentProject.progress}</progress>
        <progressNeeded>${state.currentProject.progressNeeded}</progressNeeded>
        <quality>${state.currentProject.quality}</quality>
        <bugs>${state.currentProject.bugs}</bugs>
        <hype>${state.currentProject.hype}</hype>
      </currentProject>`
    : "<currentProject />";

  const releasedGamesXml = state.releasedGames
    .map(game => `
      <game>
        <name>${escapeXml(game.name)}</name>
        <genre>${escapeXml(game.genre)}</genre>
        <size>${escapeXml(game.size)}</size>
        <score>${game.score}</score>
        <earnings>${game.earnings}</earnings>
        <fans>${game.fans}</fans>
        <reputation>${game.reputation}</reputation>
      </game>`)
    .join("");

  const upgradesXml = state.upgrades
    .map(upgrade => `
      <upgrade id="${escapeXml(upgrade.id)}">
        <name>${escapeXml(upgrade.name)}</name>
        <description>${escapeXml(upgrade.description)}</description>
        <cost>${upgrade.cost}</cost>
        <purchased>${upgrade.purchased}</purchased>
      </upgrade>`)
    .join("");

  const eventLogXml = state.eventLog
    .map(entry => `<entry>${escapeXml(entry)}</entry>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<game>
  <stats>
    <day>${state.day}</day>
    <money>${state.money}</money>
    <energy>${state.energy}</energy>
    <stress>${state.stress}</stress>
    <fans>${state.fans}</fans>
    <reputation>${state.reputation}</reputation>
  </stats>
  ${currentProjectXml}
  <releasedGames>${releasedGamesXml}
  </releasedGames>
  <upgrades>${upgradesXml}
  </upgrades>
  <eventLog>${eventLogXml}
  </eventLog>
</game>`;
}

function parseNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseBoolean(value) {
  return String(value).toLowerCase() === "true";
}

function parseXmlState(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");
  const parsererror = doc.querySelector("parsererror");
  if (parsererror) {
    throw new Error("Invalid XML file");
  }

  const stats = doc.querySelector("stats");
  const gameNode = doc.querySelector("currentProject");

  const currentProject = gameNode && gameNode.querySelector("name")
    ? {
        name: gameNode.querySelector("name").textContent || "Untitled",
        genre: gameNode.querySelector("genre").textContent || "Platformer",
        size: gameNode.querySelector("size").textContent || "Tiny",
        progress: parseNumber(gameNode.querySelector("progress")?.textContent, 0),
        progressNeeded: parseNumber(gameNode.querySelector("progressNeeded")?.textContent, 60),
        quality: parseNumber(gameNode.querySelector("quality")?.textContent, 20),
        bugs: parseNumber(gameNode.querySelector("bugs")?.textContent, 0),
        hype: parseNumber(gameNode.querySelector("hype")?.textContent, 5),
      }
    : null;

  const releasedGames = Array.from(doc.querySelectorAll("releasedGames > game")).map(gameEl => ({
    name: gameEl.querySelector("name")?.textContent || "Untitled",
    genre: gameEl.querySelector("genre")?.textContent || "Platformer",
    size: gameEl.querySelector("size")?.textContent || "Tiny",
    score: parseNumber(gameEl.querySelector("score")?.textContent, 0),
    earnings: parseNumber(gameEl.querySelector("earnings")?.textContent, 0),
    fans: parseNumber(gameEl.querySelector("fans")?.textContent, 0),
    reputation: parseNumber(gameEl.querySelector("reputation")?.textContent, 0),
  }));

  const upgrades = Array.from(doc.querySelectorAll("upgrades > upgrade")).map(upEl => ({
    id: upEl.getAttribute("id") || "",
    name: upEl.querySelector("name")?.textContent || "",
    description: upEl.querySelector("description")?.textContent || "",
    cost: parseNumber(upEl.querySelector("cost")?.textContent, 0),
    purchased: parseBoolean(upEl.querySelector("purchased")?.textContent),
  }));

  const eventLog = Array.from(doc.querySelectorAll("eventLog > entry")).map(entry => entry.textContent || "");

  return {
    day: parseNumber(stats?.querySelector("day")?.textContent, 1),
    money: parseNumber(stats?.querySelector("money")?.textContent, 0),
    energy: parseNumber(stats?.querySelector("energy")?.textContent, 100),
    stress: parseNumber(stats?.querySelector("stress")?.textContent, 0),
    fans: parseNumber(stats?.querySelector("fans")?.textContent, 0),
    reputation: parseNumber(stats?.querySelector("reputation")?.textContent, 0),
    currentProject,
    releasedGames,
    upgrades: upgrades.length > 0 ? upgrades : JSON.parse(JSON.stringify(initialUpgrades)),
    eventLog: eventLog.length > 0 ? eventLog : ["Loaded game from XML save."],
  };
}

export function saveGame() {
  const payload = {
    ...gameState,
    currentProject: gameState.currentProject,
    releasedGames: gameState.releasedGames,
    upgrades: gameState.upgrades,
    eventLog: gameState.eventLog,
  };
  localStorage.setItem(saveKey, JSON.stringify(payload));
  return true;
}

export function downloadSaveXml() {
  const xml = buildXml(gameState);
  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `indie-dev-studio-save-day-${gameState.day}.xml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function loadGame() {
  const saved = localStorage.getItem(saveKey);
  if (!saved) return false;
  try {
    const data = JSON.parse(saved);
    Object.assign(gameState, {
      day: data.day,
      money: data.money,
      energy: data.energy,
      stress: data.stress,
      fans: data.fans,
      reputation: data.reputation,
      currentProject: data.currentProject,
      releasedGames: data.releasedGames || [],
      upgrades: data.upgrades || JSON.parse(JSON.stringify(initialUpgrades)),
      eventLog: data.eventLog || [],
    });
    return true;
  } catch (error) {
    console.error("Failed to load game:", error);
    return false;
  }
}

export function loadGameFromFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const xmlString = reader.result;
        const parsedState = parseXmlState(xmlString);
        Object.assign(gameState, parsedState);
        saveGame();
        resolve(true);
      } catch (error) {
        console.error("Failed to load XML save file:", error);
        resolve(false);
      }
    };
    reader.onerror = () => resolve(false);
    reader.readAsText(file);
  });
}

export function resetGame() {
  gameState.day = 1;
  gameState.money = 150;
  gameState.energy = 100;
  gameState.stress = 10;
  gameState.fans = 0;
  gameState.reputation = 0;
  gameState.currentProject = null;
  gameState.releasedGames = [];
  gameState.upgrades = JSON.parse(JSON.stringify(initialUpgrades));
  gameState.eventLog = ["Welcome to Indie Dev Studio Simulator! Start a new project to begin."];
  localStorage.removeItem(saveKey);
}

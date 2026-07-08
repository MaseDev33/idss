import { gameState, projectSizes, constants } from "./state.js";

export function createProject(name, genre, size) {
  const stats = projectSizes[size];
  const progressNeeded = stats.progressNeeded;
  return {
    name,
    genre,
    size,
    progress: 0,
    progressNeeded,
    quality: 20,
    bugs: Math.ceil(progressNeeded * stats.bugRate),
    hype: 5,
  };
}

export function startProject(name, genre, size) {
  if (!name || !genre || !size) {
    return false;
  }
  gameState.currentProject = createProject(name, genre, size);
  gameState.eventLog.unshift(`Started new ${size} ${genre} game: ${name}.`);
  normalizeDay();
  return true;
}

function normalizeDay() {
  if (gameState.day < 1) gameState.day = 1;
}

export function progressWork() {
  if (!gameState.currentProject) return { ok: false, reason: "No active project" };
  const project = gameState.currentProject;
  const baseProgress = 18;
  let multiplier = 1;
  if (gameState.upgrades.some(u => u.id === "pc")) multiplier += 0.2;
  if (gameState.upgrades.some(u => u.id === "keyboard")) multiplier += 0.15;
  if (gameState.stress > constants.stressPenaltyThreshold) multiplier *= 0.8;
  const earned = Math.ceil(baseProgress * multiplier);
  project.progress = Math.min(project.progress + earned, project.progressNeeded);
  project.bugs += Math.round(projectSizes[project.size].bugRate * earned);
  gameState.energy = Math.max(gameState.energy - constants.workEnergyCost, constants.minEnergy);
  gameState.stress = Math.min(gameState.stress + 12, constants.maxStress);
  advanceDay();
  gameState.eventLog.unshift(`Worked on ${project.name}: +${earned} progress, +${project.bugs ? 0 : 0} bugs.`);
  return { ok: true };
}

export function fixBugs() {
  if (!gameState.currentProject) return { ok: false, reason: "No active project" };
  const project = gameState.currentProject;
  const baseReduction = 14;
  const bonus = gameState.upgrades.some(u => u.id === "debug") ? 1.25 : 1;
  const fixed = Math.min(project.bugs, Math.ceil(baseReduction * bonus));
  project.bugs = Math.max(project.bugs - fixed, 0);
  gameState.energy = Math.max(gameState.energy - constants.fixEnergyCost, constants.minEnergy);
  gameState.stress = Math.min(gameState.stress + 8, constants.maxStress);
  advanceDay();
  gameState.eventLog.unshift(`Fixed ${fixed} bugs on ${project.name}.`);
  return { ok: true };
}

export function polishProject() {
  if (!gameState.currentProject) return { ok: false, reason: "No active project" };
  const project = gameState.currentProject;
  const baseQuality = 12;
  let multiplier = 1;
  if (gameState.upgrades.some(u => u.id === "monitors")) multiplier += 0.15;
  if (gameState.stress > constants.stressPenaltyThreshold) multiplier *= 0.85;
  const qualityGain = Math.ceil(baseQuality * multiplier);
  project.quality = Math.min(project.quality + qualityGain, 100);
  gameState.energy = Math.max(gameState.energy - constants.polishEnergyCost, constants.minEnergy);
  gameState.stress = Math.min(gameState.stress + 9, constants.maxStress);
  advanceDay();
  gameState.eventLog.unshift(`Polished ${project.name}: +${qualityGain} quality.`);
  return { ok: true };
}

export function marketProject() {
  if (!gameState.currentProject) return { ok: false, reason: "No active project" };
  const project = gameState.currentProject;
  const baseHype = 18;
  let multiplier = 1;
  if (gameState.upgrades.some(u => u.id === "marketing")) multiplier += 0.2;
  const hypeGain = Math.ceil(baseHype * multiplier);
  project.hype = Math.min(project.hype + hypeGain, 100);
  gameState.energy = Math.max(gameState.energy - constants.marketEnergyCost, constants.minEnergy);
  gameState.money = Math.max(gameState.money - 20, -9999);
  gameState.stress = Math.min(gameState.stress + 6, constants.maxStress);
  advanceDay();
  gameState.eventLog.unshift(`Marketed ${project.name}: +${hypeGain} hype, -$20.`);
  return { ok: true };
}

export function restPlayer() {
  gameState.energy = Math.min(gameState.energy + constants.restEnergyGain, constants.maxEnergy);
  let reduction = constants.restStressReduction;
  if (gameState.upgrades.some(u => u.id === "coffee")) reduction *= 1.15;
  if (gameState.upgrades.some(u => u.id === "chair")) gameState.stress *= 0.96;
  gameState.stress = Math.max(gameState.stress - Math.round(reduction), 0);
  advanceDay();
  gameState.eventLog.unshift(`Took a rest: +energy, -stress.`);
  return { ok: true };
}

export function calculateRelease() {
  const project = gameState.currentProject;
  if (!project) return null;
  const sizeData = projectSizes[project.size];
  const qualityScore = project.quality / 10;
  const bugPenalty = Math.max(project.bugs / 15, 0);
  const hypeBonus = project.hype / 25;
  const fanBonus = Math.min(gameState.fans / 120, 1);
  const repBonus = Math.min(gameState.reputation / 60, 1);
  const rawScore = qualityScore + hypeBonus + fanBonus + repBonus - bugPenalty;
  const reviewScore = Math.min(Math.max(rawScore * constants.releaseScoreScale, 1), 10).toFixed(1);
  const moneyEarned = Math.round((project.quality + project.hype) * sizeData.earningMultiplier * 35 + project.progressNeeded * 12);
  const fansEarned = Math.max(Math.round((project.quality + project.hype) / 5 + repBonus * 20), 6);
  const reputationChange = Math.round((project.quality - project.bugs) / 30 + hypeBonus * 2);
  return { reviewScore, moneyEarned, fansEarned, reputationChange };
}

export function releaseProject() {
  if (!gameState.currentProject) return { ok: false, reason: "No active project" };
  const project = gameState.currentProject;
  if (project.progress < project.progressNeeded) {
    return { ok: false, reason: "Project is not ready yet." };
  }
  const result = calculateRelease();
  const releaseRecord = {
    name: project.name,
    genre: project.genre,
    size: project.size,
    score: Number(result.reviewScore),
    earnings: result.moneyEarned,
    fans: result.fansEarned,
    reputation: result.reputationChange,
  };
  gameState.money += result.moneyEarned;
  gameState.fans += result.fansEarned;
  gameState.reputation = Math.max(gameState.reputation + result.reputationChange, -50);
  gameState.releasedGames.unshift(releaseRecord);
  gameState.eventLog.unshift(`Released ${project.name}: Score ${result.reviewScore}, +$${result.moneyEarned}.`);
  gameState.currentProject = null;
  return { ok: true, result, releaseRecord };
}

function advanceDay() {
  gameState.day += 1;
}

export function canPerformAction(action) {
  if (!gameState.currentProject && ["work", "fix", "polish", "market", "release"].includes(action)) {
    return false;
  }
  if (action === "work" && gameState.energy < 15) return false;
  if (action === "fix" && gameState.energy < 12) return false;
  if (action === "polish" && gameState.energy < 14) return false;
  if (action === "market" && gameState.energy < 10) return false;
  return true;
}

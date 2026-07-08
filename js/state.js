export const gameState = {
  day: 1,
  money: 150,
  energy: 100,
  stress: 10,
  fans: 0,
  reputation: 0,
  currentProject: null,
  releasedGames: [],
  upgrades: [],
  eventLog: [],
};

export const constants = {
  maxEnergy: 100,
  minEnergy: 0,
  maxStress: 100,
  workEnergyCost: 18,
  fixEnergyCost: 14,
  polishEnergyCost: 16,
  marketEnergyCost: 10,
  restEnergyGain: 30,
  restStressReduction: 20,
  baseFanGain: 10,
  baseReputationGain: 2,
  releaseScoreScale: 1.2,
  stressPenaltyThreshold: 65,
  lowEnergyThreshold: 20,
};

export const projectSizes = {
  Tiny: { progressNeeded: 60, bugRate: 0.08, earningMultiplier: 0.7 },
  Small: { progressNeeded: 100, bugRate: 0.12, earningMultiplier: 1.0 },
  Medium: { progressNeeded: 150, bugRate: 0.16, earningMultiplier: 1.4 },
};

export const genres = ["Platformer", "Puzzle", "Horror", "Idle", "Survival"];

export const initialUpgrades = [
  { id: "keyboard", name: "Better Keyboard", description: "Work actions are more efficient.", cost: 120, effect: { workBonus: 1.15 }, purchased: false },
  { id: "pc", name: "Faster PC", description: "Finish projects quicker with faster progress.", cost: 180, effect: { progressBonus: 1.2 }, purchased: false },
  { id: "chair", name: "Better Chair", description: "Stress builds up slower while working.", cost: 130, effect: { stressReduction: 0.85 }, purchased: false },
  { id: "debug", name: "Debugging Software", description: "Fix bugs more effectively.", cost: 170, effect: { bugFixBonus: 1.25 }, purchased: false },
  { id: "coffee", name: "Coffee Machine", description: "Rest restores more energy.", cost: 100, effect: { restBonus: 1.25 }, purchased: false },
  { id: "marketing", name: "Marketing Course", description: "Marketing generates stronger hype.", cost: 150, effect: { hypeBonus: 1.2 }, purchased: false },
  { id: "monitors", name: "Dual Monitors", description: "Quality increases faster during polish.", cost: 160, effect: { qualityBonus: 1.15 }, purchased: false },
  { id: "snacks", name: "Snack Drawer", description: "Reduce stress from everyday work.", cost: 140, effect: { stressReduction: 0.9 }, purchased: false },
];

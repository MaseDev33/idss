import { gameState, constants } from "./state.js";

export const randomEvents = [
  {
    id: "pcCrash",
    title: "PC Crash",
    description: "Your computer locked up and you lost a day of work.",
    effect() {
      if (gameState.currentProject) {
        gameState.currentProject.progress = Math.max(gameState.currentProject.progress - 8, 0);
      }
      gameState.stress = Math.min(gameState.stress + 15, constants.maxStress);
      return "PC crash! Lost some progress and gained stress.";
    },
  },
  {
    id: "streamer",
    title: "Streamer Spotlight",
    description: "A streamer noticed your last project and fans are excited.",
    effect() {
      const earned = 12;
      gameState.fans += earned;
      return `Streamer feature! +${earned} fans.`;
    },
  },
  {
    id: "burnout",
    title: "Burnout",
    description: "You feel drained and must slow down for a day.",
    effect() {
      gameState.energy = Math.max(gameState.energy - 20, constants.minEnergy);
      gameState.stress = Math.min(gameState.stress + 20, constants.maxStress);
      return "Burnout hit you, energy drops and stress rises.";
    },
  },
  {
    id: "gameJam",
    title: "Game Jam Invitation",
    description: "A community game jam gave you inspiration.",
    effect() {
      if (gameState.currentProject) {
        gameState.currentProject.quality = Math.min(gameState.currentProject.quality + 10, 100);
        return "Game jam inspiration improved current project quality.";
      }
      return "Game jam vibe but no project to apply it to.";
    },
  },
  {
    id: "reviewBacklash",
    title: "Backlash",
    description: "A small review stirs controversy and affects reputation.",
    effect() {
      gameState.reputation = Math.max(gameState.reputation - 6, -50);
      return "A review backlash reduced your reputation.";
    },
  },
  {
    id: "unexpectedBill",
    title: "Unexpected Bill",
    description: "A surprise expense hits your budget.",
    effect() {
      const cost = 50;
      gameState.money -= cost;
      return `Unexpected bill: -$${cost}.`;
    },
  },
  {
    id: "viralPost",
    title: "Viral Post",
    description: "A tweet about your studio went viral.",
    effect() {
      const hypeGain = 12;
      if (gameState.currentProject) {
        gameState.currentProject.hype = Math.min(gameState.currentProject.hype + hypeGain, 100);
      }
      gameState.fans += 15;
      return "Viral post increased project hype and fans.";
    },
  },
  {
    id: "emailOffer",
    title: "Publisher Email",
    description: "A publisher expresses interest in your future work.",
    effect() {
      gameState.reputation += 8;
      return "Publisher interest boosted your reputation.";
    },
  },
];

export function triggerRandomEvent() {
  const chance = Math.random();
  if (chance < 0.35) {
    return null;
  }
  const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
  const message = event.effect();
  gameState.eventLog.unshift(`${event.title}: ${message}`);
  if (gameState.eventLog.length > 8) {
    gameState.eventLog.pop();
  }
  return event;
}

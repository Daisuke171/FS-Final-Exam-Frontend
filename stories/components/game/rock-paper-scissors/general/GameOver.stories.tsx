import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GameOver from "@/components/game/rock-paper-scissors/general/GameOver";
import { pl } from "zod/locales";

const meta: Meta<typeof GameOver> = {
  title: "Game/RockPaperScissors/GameOver",
  component: GameOver,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/games/rock-paper-scissors",
      },
    },
  },
  argTypes: {
    showXp: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof GameOver>;

export const Default: Story = {
  args: {
    gameWinner: "player1",
    playerId: "player1",
    players: [{ id: "player1" }, { id: "player2" }],
    confirmedPlayers: ["player1", "player2"],
    scores: { player1: 100, player2: 0 },
    xpData: {
      player1: {
        xpGained: 40,
        leveledUp: false,
        oldLevel: 1,
        newLevel: 2,
        unlockedSkins: [],
        xpInCurrentLevelBefore: 0,
        xpNeededForLevelBefore: 100,
        progressBefore: 0,
        xpInCurrentLevelAfter: 20,
        xpNeededForLevelAfter: 200,
        progressAfter: 40,
        oldLevelName: "Hydrogen",
        oldLevelSymbol: "H",
        oldLevelColor: "blue",
        newLevelName: "Helium",
        newLevelSymbol: "He",
        newLevelColor: "yellow",
      },
    },
    showXp: true,
    action: () => console.log("Play again clicked"),
  },
};

export const LeveledUp: Story = {
  args: {
    gameWinner: "player1",
    playerId: "player1",
    players: [{ id: "player1" }, { id: "player2" }],
    confirmedPlayers: ["player1", "player2"],
    scores: { player1: 100, player2: 0 },
    xpData: {
      player1: {
        xpGained: 100,
        leveledUp: true,
        oldLevel: 1,
        newLevel: 2,
        unlockedSkins: [],
        xpInCurrentLevelBefore: 0,
        xpNeededForLevelBefore: 80,
        progressBefore: 0,
        xpInCurrentLevelAfter: 20,
        xpNeededForLevelAfter: 200,
        progressAfter: 10,
        oldLevelName: "Hydrogen",
        oldLevelSymbol: "H",
        oldLevelColor: "blue",
        newLevelName: "Helium",
        newLevelSymbol: "He",
        newLevelColor: "yellow",
      },
    },
    showXp: true,
    action: () => console.log("Play again clicked"),
  },
};

export const LeveledUpWithSkins: Story = {
  args: {
    gameWinner: "player1",
    playerId: "player1",
    players: [{ id: "player1" }, { id: "player2" }],
    confirmedPlayers: ["player1", "player2"],
    scores: { player1: 100, player2: 0 },
    xpData: {
      player1: {
        xpGained: 100,
        leveledUp: true,
        oldLevel: 1,
        newLevel: 2,
        unlockedSkins: [
          { name: "Skin 1", id: "skin1", img: "/avatars/gon.webp", level: 2 },
          {
            name: "Skin 2",
            id: "skin2",
            img: "/avatars/killua.webp",
            level: 2,
          },
        ],
        xpInCurrentLevelBefore: 0,
        xpNeededForLevelBefore: 80,
        progressBefore: 0,
        xpInCurrentLevelAfter: 20,
        xpNeededForLevelAfter: 200,
        progressAfter: 10,
        oldLevelName: "Hydrogen",
        oldLevelSymbol: "H",
        oldLevelColor: "blue",
        newLevelName: "Helium",
        newLevelSymbol: "He",
        newLevelColor: "yellow",
      },
    },
    showXp: true,
    setShowXp: (value: boolean) => console.log("setShowXp called with:", value),
    action: () => console.log("Play again clicked"),
  },
};

export const PlayerWon: Story = {
  args: {
    gameWinner: "player1",
    playerId: "player1",
    players: [{ id: "player1" }, { id: "player2" }],
    confirmedPlayers: ["player1", "player2"],
    action: () => console.log("Play again clicked"),
  },
};

export const PlayerLost: Story = {
  args: {
    gameWinner: "player2",
    playerId: "player1",
    players: [{ id: "player1" }, { id: "player2" }],
    confirmedPlayers: ["player1", "player2"],
    action: () => console.log("Play again clicked"),
  },
};

export const Tie: Story = {
  args: {
    gameWinner: "tie",
    playerId: "player1",
    players: [{ id: "player1" }, { id: "player2" }],
    confirmedPlayers: ["player1", "player2"],
    action: () => console.log("Play again clicked"),
  },
};

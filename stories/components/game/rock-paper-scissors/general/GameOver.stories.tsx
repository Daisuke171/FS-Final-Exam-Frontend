import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GameOver from "@/components/game/rock-paper-scissors/general/GameOver";

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
};

export default meta;
type Story = StoryObj<typeof GameOver>;

export const Default: Story = {
  args: {
    gameWinner: "player1",
    playerId: "player1",
    players: [{ id: "player1" }, { id: "player2" }],
    confirmedPlayers: ["player1", "player2"],
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

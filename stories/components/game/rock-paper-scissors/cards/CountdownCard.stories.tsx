import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CountdownCard from "@/components/game/rock-paper-scissors/cards/CountdownCard";

const meta: Meta = {
  title: "Game/RockPaperScissors/CountdownCard",
  component: CountdownCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CountdownCard>;

export const Default: Story = {
  args: {
    countDown: 3,
  },
};

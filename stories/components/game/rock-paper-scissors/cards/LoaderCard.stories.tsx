import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoaderCard from "@/components/game/rock-paper-scissors/cards/LoaderCard";

const meta: Meta = {
  title: "Game/RockPaperScissors/LoaderCard",
  component: LoaderCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LoaderCard>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Card from "@/components/game/rock-paper-scissors/cards/Card";

const meta: Meta = {
  title: "Game/RockPaperScissors/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Rock: Story = {
  args: {
    title: "Rock",
    img: "game-icons:fist",
  },
};

export const Paper: Story = {
  args: {
    title: "Paper",
    img: "game-icons:paper",
  },
};

export const Scissors: Story = {
  args: {
    title: "Scissors",
    img: "game-icons:scissors",
  },
};

export const Disabled: Story = {
  args: {
    title: "Scissors",
    img: "game-icons:scissors",
    disableCards: true,
  },
};

export const Clicked: Story = {
  args: {
    title: "Scissors",
    img: "game-icons:scissors",
    isClicked: true,
  },
};

export const ClickedAndDisabled: Story = {
  args: {
    title: "Scissors",
    img: "game-icons:scissors",
    isClicked: true,
    disableCards: true,
  },
};

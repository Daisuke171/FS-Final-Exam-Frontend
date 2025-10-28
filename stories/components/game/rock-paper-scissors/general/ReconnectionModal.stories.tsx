import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ReconnectionModal from "@/components/game/rock-paper-scissors/modals/ReconnectionModal";

const meta: Meta = {
  title: "Game/RockPaperScissors/ReconnectionModal",
  component: ReconnectionModal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ReconnectionModal>;

export const Default: Story = {
  args: {
    countdown: 10,
    player: "BigNigga69",
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";

const meta: Meta = {
  title: "Game/RockPaperScissors/CustomButtonOne",
  component: CustomButtonOne,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CustomButtonOne>;

export const PrimaryFilled: Story = {
  args: {
    variant: "filled",
    color: "primary",
    text: "Button",
    icon: "mdi:rocket-launch",
  },
};

export const secondaryFilled: Story = {
  args: {
    variant: "filled",
    color: "secondary",
    text: "Button",
    icon: "mdi:rocket-launch",
  },
};

export const PrimaryOutlined: Story = {
  args: {
    variant: "outlined",
    color: "primary",
    text: "Button",
    icon: "mdi:rocket-launch",
  },
};

export const SecondaryOutlined: Story = {
  args: {
    variant: "outlined",
    color: "secondary",
    text: "Button",
    icon: "mdi:rocket-launch",
  },
};

export const LoadingOutlined: Story = {
  args: {
    variant: "outlined",
    color: "secondary",
    text: "Button",
    icon: "mdi:rocket-launch",
    loading: true,
  },
};

export const LoadingFilled: Story = {
  args: {
    variant: "filled",
    color: "secondary",
    text: "Button",
    icon: "mdi:rocket-launch",
    loading: true,
  },
};

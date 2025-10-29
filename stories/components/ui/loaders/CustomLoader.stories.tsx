import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HamsterLoader from "@/components/ui/loaders/HamsterLoader";

const meta: Meta = {
  title: "Components/ui/HamsterLoader",
  component: HamsterLoader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HamsterLoader>;

export const Default: Story = {};

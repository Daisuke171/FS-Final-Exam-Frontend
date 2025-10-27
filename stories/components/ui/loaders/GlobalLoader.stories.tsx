import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GlobalLoader from "@/components/ui/loaders/GlobalLoader";

const meta: Meta = {
  title: "Components/ui/GlobalLoader",
  component: GlobalLoader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GlobalLoader>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import RegisterSuccess from "@/components/register/RegisterSuccess";

const meta: Meta = {
  title: "Components/Register/RegisterSuccess",
  component: RegisterSuccess,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RegisterSuccess>;

export const Default: Story = {};

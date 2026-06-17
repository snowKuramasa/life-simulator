import type { Meta, StoryObj } from "@storybook/react-vite";

import startImage from "@/assets/welcome_transparent.png";
import { Image } from "@/components/common/baseUi/Image";

const meta = {
  title: "Components/Common/BaseUi/Image",
  component: Image,
  tags: ["autodocs"],
  args: {
    src: startImage,
    alt: "飲み物を持って窓辺で過ごす人のイラスト",
    width: 250,
    height: 250,
  },
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Responsive: Story = {
  args: {
    width: { base: 250, md: 410 },
    height: { base: 250, md: 410 },
  },
};

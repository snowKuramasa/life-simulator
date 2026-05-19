import type { Meta, StoryObj } from "@storybook/react-vite";

import startImage from "@/assets/90.png";
import { Image } from "@/components/commons/uis/Image";

const meta = {
  title: "Components/Common/Atom/Image",
  component: Image,
  tags: ["autodocs"],
  args: {
    src: startImage,
    alt: "食卓で過ごす人と犬のイラスト",
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

import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/baseUi/Select";

const meta = {
  title: "Components/Common/BaseUi/Select",
  component: Select,
  tags: ["autodocs"],
  render: () => (
    <div className="w-56">
      <Select defaultValue="tokyo">
        <SelectTrigger aria-label="都道府県">
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tokyo">東京都</SelectItem>
          <SelectItem value="kanagawa">神奈川県</SelectItem>
          <SelectItem value="saitama">埼玉県</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

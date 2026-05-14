import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { LoginPage } from "@/pages/LoginPage";
import { AppProviders } from "@/providers/AppProviders";
import { LoginPageProvider } from "@/providers/pages/LoginPageProvider";

const meta = {
  title: "Pages/LoginPage",
  component: LoginPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <AppProviders>
        <MemoryRouter>
          <LoginPageProvider>
            <Story />
          </LoginPageProvider>
        </MemoryRouter>
      </AppProviders>
    ),
  ],
} satisfies Meta<typeof LoginPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

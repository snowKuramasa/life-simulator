import { createBrowserRouter } from "react-router";

import { AppLayout } from "@/components/common/layout/AppLayout";
import { LoginPage } from "@/pages/LoginPage";
import { StartUpPage } from "@/pages/StartUpPage";
import { LoginPageProvider } from "@/providers/pages/LoginPageProvider";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <StartUpPage />,
      },
      {
        path: "login",
        element: (
          <LoginPageProvider>
            <LoginPage />
          </LoginPageProvider>
        ),
      },
    ],
  },
]);

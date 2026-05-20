import { createBrowserRouter } from "react-router";

import { AppLayout } from "@/components/common/layouts/AppLayout";
import { LoginPage } from "@/pages/LoginPage";
import { StartUpPage } from "@/pages/StartUpPage";
import { WorkplaceNewPage } from "@/pages/WorkplaceNewPage";
import { LoginPageProvider } from "@/providers/pages/LoginPageProvider";
import { WorkplaceNewPageProvider } from "@/providers/pages/WorkplaceNewPageProvider";

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
      {
        path: "workplaces/new",
        element: (
          <WorkplaceNewPageProvider>
            <WorkplaceNewPage />
          </WorkplaceNewPageProvider>
        ),
      },
    ],
  },
]);

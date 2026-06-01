import { createBrowserRouter } from "react-router";

import { AppLayout } from "@/components/common/layouts/AppLayout";
import { LoginPage } from "@/pages/LoginPage";
import { ResidenceEditPage } from "@/pages/ResidenceEditPage";
import { ResidenceNewPage } from "@/pages/ResidenceNewPage";
import { StartUpPage } from "@/pages/StartUpPage";
import { WorkplaceEditPage } from "@/pages/WorkplaceEditPage";
import { WorkplaceNewPage } from "@/pages/WorkplaceNewPage";
import { LoginPageProvider } from "@/providers/pages/LoginPageProvider";
import { ResidenceEditPageProvider } from "@/providers/pages/ResidenceEditPageProvider";
import { ResidenceNewPageProvider } from "@/providers/pages/ResidenceNewPageProvider";
import { WorkplaceEditPageProvider } from "@/providers/pages/WorkplaceEditPageProvider";
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
        path: "residences/new",
        element: (
          <ResidenceNewPageProvider>
            <ResidenceNewPage />
          </ResidenceNewPageProvider>
        ),
      },
      {
        path: "residences/:id/edit",
        element: (
          <ResidenceEditPageProvider>
            <ResidenceEditPage />
          </ResidenceEditPageProvider>
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
      {
        path: "workplaces/:id/edit",
        element: (
          <WorkplaceEditPageProvider>
            <WorkplaceEditPage />
          </WorkplaceEditPageProvider>
        ),
      },
    ],
  },
]);

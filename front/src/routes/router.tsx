import { createBrowserRouter } from "react-router";

import { AppLayout } from "@/components/common/layouts/AppLayout";
import { LoginPage } from "@/pages/LoginPage";
import { ResidenceEditPage } from "@/pages/ResidenceEditPage";
import { ResidenceListPage } from "@/pages/ResidenceListPage";
import { ResidenceNewPage } from "@/pages/ResidenceNewPage";
import { ResultListPage } from "@/pages/ResultListPage";
import { StartUpPage } from "@/pages/StartUpPage";
import { WorkplaceEditPage } from "@/pages/WorkplaceEditPage";
import { WorkplaceListPage } from "@/pages/WorkplaceListPage";
import { WorkplaceNewPage } from "@/pages/WorkplaceNewPage";
import { LoginPageProvider } from "@/providers/pages/LoginPageProvider";
import { ResidenceEditPageProvider } from "@/providers/pages/ResidenceEditPageProvider";
import { ResidenceListPageProvider } from "@/providers/pages/ResidenceListPageProvider";
import { ResidenceNewPageProvider } from "@/providers/pages/ResidenceNewPageProvider";
import { ResultListPageProvider } from "@/providers/pages/ResultListPageProvider";
import { WorkplaceEditPageProvider } from "@/providers/pages/WorkplaceEditPageProvider";
import { WorkplaceListPageProvider } from "@/providers/pages/WorkplaceListPageProvider";
import { WorkplaceNewPageProvider } from "@/providers/pages/WorkplaceNewPageProvider";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

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
        element: <ProtectedRoute />,
        children: [
          {
            path: "results",
            element: (
              <ResultListPageProvider>
                <ResultListPage />
              </ResultListPageProvider>
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
            path: "residences",
            element: (
              <ResidenceListPageProvider>
                <ResidenceListPage />
              </ResidenceListPageProvider>
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
            path: "workplaces",
            element: (
              <WorkplaceListPageProvider>
                <WorkplaceListPage />
              </WorkplaceListPageProvider>
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
    ],
  },
]);

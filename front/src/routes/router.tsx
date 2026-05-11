import { createBrowserRouter } from "react-router";

import { StartUpPage } from "@/pages/StartUpPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <StartUpPage />,
  },
]);

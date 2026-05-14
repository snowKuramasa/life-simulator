import { useContext } from "react";

import { LoginPageContext } from "@/providers/pages/LoginPageContext";

export function useLoginPage() {
  const loginPage = useContext(LoginPageContext);

  if (!loginPage) {
    throw new Error("useLoginPage must be used within LoginPageProvider");
  }

  return loginPage;
}

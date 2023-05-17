import React from "react";
import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";
import AuthContext, { AuthProvider } from "./AuthProvider";
import { log } from "console";

interface AuthContextValue {
  userToken?: string;
  setUserToken: React.Dispatch<React.SetStateAction<string | undefined>>;
}

describe("AuthProvider", () => {
  test("renders its children", () => {
    render(
      <AuthProvider>
        <div data-testid="child-component">Child component</div>
      </AuthProvider>
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});

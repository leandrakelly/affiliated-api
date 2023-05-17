import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

describe("App", () => {
  test("renders Register component on / path", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("renders Login component on /login path", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("renders Transactions component on / path after authentication", async () => {
    jest
      .spyOn(axios, "post")
      .mockResolvedValueOnce({ data: { access_token: "mockToken" } });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    const loginButton = screen.getByText("Login");
    loginButton.click();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    act(() => {
      fireEvent.submit(screen.getByRole("button", { name: /Sign in/i }));
    });

    await waitFor(() => {
      const errorMessage = screen.queryByText(/Network error/i);
      expect(errorMessage).not.toBeInTheDocument();

      const invalidEmailPasswordMessage = screen.queryByText(
        /Invalid email or password/
      );
      expect(invalidEmailPasswordMessage).not.toBeInTheDocument();

      const accountNotVerifiedMessage =
        screen.queryByText(/Account not verified/i);
      expect(accountNotVerifiedMessage).not.toBeInTheDocument();
    });
  });

  test("redirects to /login for unknown paths", () => {
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});

import "@testing-library/jest-dom/extend-expect";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { Login } from "./index";
import { MemoryRouter } from "react-router-dom";
import axios from "../../api/axios";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login", () => {
  test("renders Login component", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginTitle = screen.getByText(/Login/i);
    expect(loginTitle).toBeInTheDocument();
  });

  test("handles form submission successfully", async () => {
    jest
      .spyOn(axios, "post")
      .mockResolvedValueOnce({ data: { access_token: "mockToken" } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

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

  test("handles form submission with network error", async () => {
    jest.spyOn(axios, "post").mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

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
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("handles form submission with invalid email or password", async () => {
    jest
      .spyOn(axios, "post")
      .mockRejectedValueOnce({ response: { status: 400 } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

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
      const errorMessage = screen.queryByText(/Invalid email or password/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("handles form submission with account not verified", async () => {
    jest
      .spyOn(axios, "post")
      .mockRejectedValueOnce({ response: { status: 403 } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

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
      const errorMessage = screen.queryByText(/Account not verified/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("Test focus behavior: Verify that the email input field receives focus when the component mounts", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const emailInput = screen.getByLabelText("Email");
    expect(document.activeElement).toBe(emailInput);
  });

  test("Test input field updates: Verify that changes to the email and password input fields update the component's state correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("navigates to Register page when button is clicked", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Register now"));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, "/register");
  });
});

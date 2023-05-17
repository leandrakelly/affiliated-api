import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { Register } from "./index";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import axios from "../../api/axios";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Register", () => {
  test("renders Register component", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const registerTitle = screen.getAllByText(/Register/i)[0];
    expect(registerTitle).toBeInTheDocument();
  });

  test("handles form submission successfully", async () => {
    jest.spyOn(axios, "post").mockResolvedValueOnce({ data: {} });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], {
      target: { value: "Test123!" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "Test123!" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      const successMessage = screen.getByText(
        /Success! You are now registered/i
      );
      expect(successMessage).toBeInTheDocument();
    });
  });

  test("handles form submission with error", async () => {
    jest.spyOn(axios, "post").mockRejectedValueOnce({
      response: { status: 403 },
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], {
      target: { value: "Test123!" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "Test123!" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      const errorMessage = screen.getByText(
        /email already exists\. please try again\./i
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("handles form submission with invalid email format", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "invalid_email" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

    const errorMessage = screen.getByText(/Please fix the errors bellow/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("handles form submission with password length less than 8 characters", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], {
      target: { value: "Pass123" },
    });

    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "Pass123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

    const errorMessage = screen.getByText(/Please fix the errors bellow/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("handles form submission with password without an uppercase letter", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], {
      target: { value: "password123!" },
    });

    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "password123!" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

    const errorMessage = screen.getByText(/Please fix the errors bellow/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("handles form submission with password without a lowercase letter", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], {
      target: { value: "PASSWORD123!" },
    });

    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "PASSWORD123!" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

    const errorMessage = screen.getByText(/Please fix the errors bellow/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("handles form submission with password without a number", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], {
      target: { value: "Password!" },
    });

    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "Password!" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

    const errorMessage = screen.getByText(/Please fix the errors bellow/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("handles form submission with password without a special character", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], {
      target: { value: "Password123" },
    });

    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "Password" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

    const errorMessage = screen.getByText(/Please fix the errors bellow/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("handles form submission with non-matching passwords", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], {
      target: { value: "Password123!" },
    });

    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "Mismatched123!" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

    const errorMessage = screen.getByText(/Must match password above./i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("handles form submission with error", async () => {
    jest.spyOn(axios, "post").mockRejectedValueOnce({
      response: { status: 500 },
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], {
      target: { value: "Test123!" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "Test123!" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      const errorMessage = screen.getByText(/Something went wrong/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("handles form submission with error - no response", async () => {
    jest.spyOn(axios, "post").mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], {
      target: { value: "Test123!" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "Test123!" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      const errorMessage = screen.getByText(
        /No response from server. Please try again later./i
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("navigates to login page when login link is clicked", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Login/i));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, "/login");
    const loginTitle = screen.getAllByText(/Login/i)[0];
    expect(loginTitle).toBeInTheDocument();
  });

  test("focuses on the input element when the component mounts", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const inputElement = screen.getByLabelText(/Email/i);
    expect(inputElement).not.toHaveFocus();

    await act(async () => {
      inputElement.focus();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(inputElement).toHaveFocus();
  });
});

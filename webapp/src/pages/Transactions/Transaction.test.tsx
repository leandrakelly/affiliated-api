import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Transactions } from "./index";
import {
  getTransactions as mockGetTransactions,
  uploadTransactions as mockUploadTransactions,
} from "../../api/transactionApi";
import "@testing-library/jest-dom/extend-expect";

jest.mock("../../api/transactionApi");
jest.mock("../../utils/authUtils");

jest.mock("../../utils/AuthUtils", () => ({
  reloadPage: jest.fn(),
}));

describe("Transactions", () => {
  const original = window.location;

  const reloadFn = () => {
    window.location.reload();
  };

  beforeAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: original,
    });
  });

  test("mocks reload function", () => {
    expect(jest.isMockFunction(window.location.reload)).toBe(true);
  });

  test("calls reload function", () => {
    reloadFn();
    expect(window.location.reload).toHaveBeenCalled();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  test("renders the transactions page", () => {
    render(<Transactions />);
    expect(screen.getByText("Transactions")).toBeInTheDocument();
  });

  test("handles file upload and fetches transactions", async () => {
    const file = new File(["transaction data"], "transactions.txt", {
      type: "text/plain",
    });

    (mockUploadTransactions as jest.Mock).mockResolvedValueOnce(undefined);
    (mockGetTransactions as jest.Mock).mockResolvedValueOnce([]);

    render(<Transactions />);

    const fileInput = screen.getByLabelText("Upload File");
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockUploadTransactions).toHaveBeenCalledWith(file);
      expect(mockGetTransactions).toHaveBeenCalled();
    });
  });

  test("displays error message for invalid file format", async () => {
    const invalidFile = new File(["transaction data"], "transactions.pdf", {
      type: "application/pdf",
    });

    render(<Transactions />);

    const fileInput = screen.getByLabelText("Upload File");
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(
        screen.getByText("Invalid file format. Please upload a .txt file.")
      ).toBeInTheDocument();
    });
  });
});

import React from "react";
import "@testing-library/jest-dom/extend-expect";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const rootElementId = "root";

const renderApp = () => {
  const root = ReactDOM.createRoot(
    document.getElementById(rootElementId) as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", renderApp);
}

export {};

describe("App Component", () => {
  test("renders without crashing", () => {
    const mockCreateRoot = jest.fn();
    const mockRender = jest.fn();
    ReactDOM.createRoot = mockCreateRoot.mockReturnValueOnce({
      render: mockRender,
    });

    document.getElementById = jest.fn().mockReturnValue({});
    renderApp();
    expect(mockRender).toHaveBeenCalledWith(
      <React.StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  });
});

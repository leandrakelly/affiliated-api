import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet } from "react-router-dom";
import Layout from "./index";

describe("Layout", () => {
  it("renders the Outlet component", () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    const outletComponent = screen.getByRole("main");

    expect(outletComponent).toBeInTheDocument();
  });

  it("renders the main container element with the class 'App'", () => {
    const { container } = render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    expect(container.querySelector(".App")).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Field from "../client/components/Field";

describe("Field Component", () => {
  const createTestField = () =>
    Array(20)
      .fill(null)
      .map(() => Array(10).fill(0));

  const createTestPiece = () => ({
    type: "I",
    x: 3,
    y: 0,
    rotation: 0,
  });

  it("should render empty field", () => {
    const field = createTestField();
    const { container } = render(
      <Field field={field} currentPiece={null} ghostPiece={null} />
    );

    const cells = container.querySelectorAll(".cell");
    expect(cells.length).toBe(200); // 20x10
  });

  it("should render field with current piece", () => {
    const field = createTestField();
    const piece = createTestPiece();

    const { container } = render(
      <Field field={field} currentPiece={piece} ghostPiece={null} />
    );

    expect(container.querySelector(".field")).toBeInTheDocument();
  });

  it("should render field with ghost piece", () => {
    const field = createTestField();
    const piece = createTestPiece();
    const ghostPiece = { ...piece, y: 18 };

    const { container } = render(
      <Field field={field} currentPiece={piece} ghostPiece={ghostPiece} />
    );

    expect(container.querySelector(".field")).toBeInTheDocument();
  });

  it("should render field with blocks", () => {
    const field = createTestField();
    field[19][5] = 1; // Place a block

    const { container } = render(
      <Field field={field} currentPiece={null} ghostPiece={null} />
    );

    const cells = container.querySelectorAll(".cell");
    expect(cells.length).toBe(200);
  });
});

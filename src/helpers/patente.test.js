import test from "node:test";
import assert from "node:assert/strict";
import { normalizarPatente } from "./patente.js";

test("normaliza patentes a mayúsculas sin espacios ni guiones", () => {
  assert.equal(normalizarPatente(" ab 123-cd "), "AB123CD");
});

test("tolera valores vacíos", () => {
  assert.equal(normalizarPatente(), "");
});

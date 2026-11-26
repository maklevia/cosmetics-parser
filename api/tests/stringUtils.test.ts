import { test } from "node:test";
import assert from "node:assert/strict";

import {
  normalizeVariantValue,
  productNamesSimilarityScore,
  stripCategorySuffix,
} from "../src/parsers/utils/stringUtils.js";

test("normalizeVariantValue maps Cyrillic units to Latin units", () => {
  assert.equal(normalizeVariantValue("100 мл"), "100ml");
  assert.equal(normalizeVariantValue("3,5 гр"), "3.5g");
  assert.equal(normalizeVariantValue("50 ml"), "50ml");
});

test("stripCategorySuffix removes trailing store category words", () => {
  assert.equal(
    stripCategorySuffix(
      "Calvin Klein Eternity for Women Парфумована вода жіноча",
    ),
    "Calvin Klein Eternity for Women",
  );
});

test("stripCategorySuffix keeps names without category suffixes intact", () => {
  assert.equal(stripCategorySuffix("MAC Matte Lipstick"), "MAC Matte Lipstick");
});

test("productNamesSimilarityScore returns 100 for identical products", () => {
  assert.equal(
    productNamesSimilarityScore(
      "MAC Matte Lipstick",
      "MAC Matte Lipstick",
      "MAC",
      "MAC",
    ),
    100,
  );
});

test("productNamesSimilarityScore returns 0 for different brands", () => {
  assert.equal(
    productNamesSimilarityScore(
      "MAC Matte Lipstick",
      "MAC Matte Lipstick",
      "MAC",
      "Maybelline",
    ),
    0,
  );
});

import { test } from "node:test";
import assert from "node:assert/strict";

import { BaseParser } from "../src/parsers/BaseParser.js";
import { ParserOrchestrator } from "../src/parsers/ParserOrchestrator.js";
import { StoreName } from "../src/types/Enums.js";
import type { ParsedStoreProduct } from "../src/types/ProductTypes.js";

class TestParser extends BaseParser {
  readonly storeName = StoreName.Eva;

  protected async fetchByLink(): Promise<ParsedStoreProduct | null> {
    return null;
  }

  protected async fetchByNameAndBrand(): Promise<ParsedStoreProduct | null> {
    return null;
  }
}

const product: ParsedStoreProduct = {
  name: "MAC Matte Lipstick",
  brand: "MAC",
  inStock: true,
  link: "https://makeup.com.ua/ua/product/1311812/",
  storeName: StoreName.Makeup,
  variants: [
    {
      optionId: "2520601",
      label: "Cafe Mocha",
      isDefault: false,
      offers: [
        {
          name: "MAC Matte Lipstick Cafe Mocha",
          brand: "MAC",
          inStock: true,
          link: "https://makeup.com.ua/ua/product/1311812/",
          storeName: StoreName.Makeup,
          variantId: "2520601",
        },
        {
          name: "MAC Matte Lipstick Cafe Mocha",
          brand: "MAC",
          inStock: true,
          link: "https://makeup.com.ua/ua/product/1311812/",
          storeName: StoreName.Makeup,
          variantId: "2520601_3",
        },
      ],
    },
  ],
};

test("selectOffer finds an offer by concrete variant id", () => {
  const parser = new TestParser();
  const offer = parser.selectOffer(product, "2520601_3");

  assert.equal(offer?.variantId, "2520601_3");
});

test("selectOffer returns null for unknown variant ids", () => {
  const parser = new TestParser();
  assert.equal(parser.selectOffer(product, "unknown"), null);
});

test("selectOption finds a logical option by id", () => {
  const parser = new TestParser();
  const option = parser.selectOption(product, "2520601");

  assert.equal(option?.optionId, "2520601");
  assert.equal(option?.offers.length, 2);
});

test("extractVariantIdFromLink reads store-specific variant ids", () => {
  const orchestrator = new ParserOrchestrator();

  assert.equal(
    orchestrator.extractVariantIdFromLink(
      StoreName.Eva,
      "https://eva.ua/ua/pr91057/",
    ),
    "91057",
  );
  assert.equal(
    orchestrator.extractVariantIdFromLink(
      StoreName.Notino,
      "https://www.notino.ua/mac-cosmetics/macximal-silky-matte-lipstick-matujucha-pomada/p-16282214/",
    ),
    "16282214",
  );
  assert.equal(
    orchestrator.extractVariantIdFromLink(
      StoreName.Makeup,
      "https://makeup.com.ua/ua/product/1311812/",
    ),
    null,
  );
});

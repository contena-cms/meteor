import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("mt-base-field styles", () => {
  it("uses the active theme background for autofilled inputs", () => {
    const source = readFileSync(
      resolve("src/components/_internal/mt-base-field/mt-base-field.vue"),
      "utf8",
    );

    expect(source).toContain(
      "-webkit-box-shadow: 0 0 0 1000px var(--color-background-primary-default) inset;",
    );
  });
});

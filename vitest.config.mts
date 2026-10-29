import { defineConfig } from "vitest/config";

// Tests run in Node with no browser and no database, except where a test
// says otherwise.
export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next"],
  },
});

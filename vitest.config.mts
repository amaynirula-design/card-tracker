import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

// Tests run in Node with no browser and no database, except where a test
// says otherwise. Only TEST_ settings are loaded, so a test can't pick up the
// real Supabase project from .env.local.
export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next"],
    env: loadEnv("test", process.cwd(), "TEST_"),
  },
});

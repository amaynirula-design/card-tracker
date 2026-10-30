"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { SegmentedControl } from "./segmented-control";

// The user's choice is saved in this browser under "theme": "light" or "dark".
// Nothing saved means "system": follow the device's light/dark setting.
type Theme = "system" | "light" | "dark";

const STORAGE_KEY = "theme";
const CHANGE_EVENT = "themechange";

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return "system";
  }
}

function applyTheme(theme: Theme) {
  if (theme === "system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", theme);
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

// Runs in <head> before the page is drawn, so a saved theme never flashes.
export const themeScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

// In development React resets <html> attributes once on load; this puts the
// theme back before paint, on every page.
export function ThemeRestorer() {
  useLayoutEffect(() => applyTheme(readTheme()), []);
  return null;
}

export function ThemeSwitch() {
  // The server can't see localStorage, so it renders "system"; the browser then shows the real choice.
  const theme = useSyncExternalStore(subscribe, readTheme, () => "system" as Theme);

  function choose(next: Theme) {
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing can block storage; the theme still changes for this visit.
    }
    applyTheme(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <SegmentedControl<Theme>
      ariaLabel="Appearance"
      stretch
      value={theme}
      onChange={choose}
      options={[
        { value: "system", label: "System" },
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
      ]}
    />
  );
}

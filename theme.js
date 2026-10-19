// Light (Paper) or dark (Classic): follows the device until the visitor picks one with the header button.
// Loaded in <head> so a saved choice applies before the page paints.
(function () {
  const KEY = "boros-theme";
  const root = document.documentElement;
  const system = matchMedia("(prefers-color-scheme: light)");
  const BG = { light: "#f3f0e8", dark: "#000000" };

  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;

  const effective = () => root.dataset.theme || (system.matches ? "light" : "dark");

  // Screenshots: <source data-light> holds the Paper twin. Forced themes override the media query.
  function sync() {
    const t = effective(), forced = !!root.dataset.theme;
    document.querySelectorAll("source[data-light]").forEach(s => {
      s.media = forced ? (t === "light" ? "all" : "not all") : "(prefers-color-scheme: light)";
    });
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => {
      if (forced) { m.content = BG[t]; m.removeAttribute("media"); }
    });
    document.querySelectorAll(".mode-toggle").forEach(b => {
      b.setAttribute("aria-label", t === "light" ? "Switch to dark mode" : "Switch to light mode");
      b.dataset.mode = t;
    });
    document.dispatchEvent(new CustomEvent("boros-theme", { detail: t }));
  }

  function toggle() {
    const next = effective() === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch (e) {}
    sync();
  }

  system.addEventListener("change", () => { if (!root.dataset.theme) sync(); });
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".mode-toggle").forEach(b => b.addEventListener("click", toggle));
    sync();
  });
  window.borosTheme = effective;
})();

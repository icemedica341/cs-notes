// Explorer Loop 6 retry override (cs-notes, Quartz 5) — SURGICAL 2 ONLY.
// F1 expand/contract-all button + F4 default-open. F2 sort + F3 locate ship via ./loop7.js (Loop 7).
// Renders no markup of its own; injects behaviour script as afterDOMLoaded,
// directly after the upstream explorer.
// NOTE: the client script below must not contain backticks or ${ sequences,
// as it is embedded in a template literal.
import { loop7Script } from "./loop7.js"
const loop6Script = `(function () {
if (window.__explorerLoop6) return;
window.__explorerLoop6 = true;
var TREE_KEY = "fileTree";
function readTree() {
  var map = {};
  try {
    JSON.parse(localStorage.getItem(TREE_KEY) || "[]").forEach(function (n) {
      if (n && n.path) map[n.path] = !!n.collapsed;
    });
  } catch (e) {}
  return map;
}
function writeTree(map) {
  try {
    localStorage.setItem(TREE_KEY, JSON.stringify(Object.keys(map).map(function (p) {
      return { path: p, collapsed: !!map[p] };
    })));
  } catch (e) {}
}
function explorers() {
  return Array.prototype.slice.call(document.querySelectorAll("div.explorer"));
}
function contentOf(root) { return root.querySelector(".explorer-content"); }
function folderPairs(root) {
  return Array.prototype.slice.call(root.querySelectorAll(".folder-container[data-folderpath]")).map(function (c) {
    var outer = c.nextElementSibling;
    if (!outer || !outer.classList || !outer.classList.contains("folder-outer")) return null;
    return { container: c, outer: outer, path: c.getAttribute("data-folderpath") };
  }).filter(function (p) { return !!p; });
}
function allOpen(root) {
  var pairs = folderPairs(root);
  return pairs.length > 0 && pairs.every(function (p) { return p.outer.classList.contains("open"); });
}
function setAll(root, open) {
  var saved = readTree();
  var changed = false;
  folderPairs(root).forEach(function (p) {
    if (open) p.outer.classList.add("open"); else p.outer.classList.remove("open");
    if (p.path && saved[p.path] !== !open) { saved[p.path] = !open; changed = true; }
  });
  if (changed) writeTree(saved);
  refreshToolbar(root);
}
function applyDefaultOpen(root) {
  var saved = readTree();
  folderPairs(root).forEach(function (p) {
    if (p.path && !(p.path in saved)) p.outer.classList.add("open");
  });
}
function refreshToolbar(root) {
  var content = contentOf(root);
  if (!content) return;
  var bar = content.querySelector(":scope > .explorer-loop6-toolbar");
  if (!bar) return;
  var toggle = bar.querySelector('[data-loop6="toggle-all"]');
  var open = allOpen(root);
  if (toggle) {
    toggle.textContent = open ? "Collapse all" : "Expand all";
    toggle.setAttribute("aria-pressed", open ? "true" : "false");
    toggle.setAttribute("data-state", open ? "open" : "shut");
  }
}
function ensureToolbar(root) {
  var content = contentOf(root);
  if (!content) return;
  var bar = content.querySelector(":scope > .explorer-loop6-toolbar");
  if (!bar) {
    bar = document.createElement("div");
    bar.className = "explorer-loop6-toolbar";
    bar.setAttribute("role", "toolbar");
    bar.setAttribute("aria-label", "Explorer view options");
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "explorer-loop6-btn";
    toggle.setAttribute("data-loop6", "toggle-all");
    toggle.addEventListener("click", function (ev) { ev.stopPropagation(); setAll(root, !allOpen(root)); });
    bar.appendChild(toggle);
    content.insertBefore(bar, content.firstChild);
  }
  refreshToolbar(root);
}
function applyAll(root) {
  if (root.dataset.loop6Busy) return;
  root.dataset.loop6Busy = "1";
  try {
    ensureToolbar(root);
    applyDefaultOpen(root);
    refreshToolbar(root);
  } finally {
    delete root.dataset.loop6Busy;
  }
}
function scheduleApply(root) {
  if (root.dataset.loop6Scheduled) return;
  root.dataset.loop6Scheduled = "1";
  requestAnimationFrame(function () {
    delete root.dataset.loop6Scheduled;
    applyAll(root);
  });
}
var observedUls = new WeakSet();
function initOne(root) {
  var ul = root.querySelector(".explorer-ul");
  if (ul && !observedUls.has(ul)) {
    observedUls.add(ul);
    new MutationObserver(function () { scheduleApply(root); }).observe(ul, { childList: true, subtree: true });
  }
  applyAll(root);
}
function initAll() { explorers().forEach(initOne); }
document.addEventListener("nav", initAll);
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAll);
initAll();
})();`;

export function ExplorerLoop6(_opts) {
  const Component = () => null;
  Component.displayName = "ExplorerLoop6";
  Component.afterDOMLoaded = [loop6Script, loop7Script];
  return Component;
}

export default ExplorerLoop6;

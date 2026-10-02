// Explorer Loop 7 (cs-notes, Quartz 5) — SURGICAL: F2 sort toggle + F3 locate+centre.
// Companion to index.js (Loop 6 retry F1 expand-all + F4 default-open), loaded as the
// second afterDOMLoaded script so index.js behaviour stays byte-identical.
// F2: A-Z / Z-A toggle button in the explorer header toolbar (next to expand/collapse),
//     direction persists via localStorage, DOM re-ordered per ul (folders-first both ways).
// F3: on nav + first load, expand ancestors of the active link, centre it vertically
//     inside .explorer-content only (page scroll untouched), 3s highlight flash.
// NOTE: the client script below must not contain backticks or ${ sequences,
// as it is embedded in a template literal.
export const SORT_KEY = "explorerSortDir";
export const FLASH_CLASS = "explorer-loop7-flash";
export const FLASH_MS = 3000;

// Pure comparator shared with tests. The client script carries an identical copy
// (cmpEntries); keep both in sync. dir: 1 = A-Z, -1 = Z-A. Folders-first both ways.
export function compareEntries(a, b, dir) {
  if (!!a.isFolder !== !!b.isFolder) return a.isFolder ? -1 : 1;
  var an = String(a.name);
  var bn = String(b.name);
  var c = an.localeCompare(bn, undefined, { numeric: true, sensitivity: "base" });
  if (c === 0) c = an < bn ? -1 : an > bn ? 1 : 0;
  return dir < 0 ? -c : c;
}

export function basenameOf(p) {
  if (!p) return "";
  var parts = String(p).split("/").filter(function (s) { return s.length > 0; });
  return parts.length > 0 ? parts[parts.length - 1] : "";
}

export const loop7Script = `(function () {
if (window.__explorerLoop7) return;
window.__explorerLoop7 = true;
var SORT_KEY = "explorerSortDir";
var FLASH_CLASS = "explorer-loop7-flash";
var FLASH_MS = 3000;
var LOCATE_TRIES_MAX = 10;
var locatePending = true;
var locateTries = 0;
function readSortDir() {
  try { return localStorage.getItem(SORT_KEY) === "desc" ? -1 : 1; } catch (e) { return 1; }
}
function writeSortDir(dir) {
  try { localStorage.setItem(SORT_KEY, dir < 0 ? "desc" : "asc"); } catch (e) {}
}
function baseLast(p) {
  if (!p) return "";
  var parts = String(p).split("/").filter(function (s) { return s.length > 0; });
  return parts.length > 0 ? parts[parts.length - 1] : "";
}
function cmpEntries(a, b, dir) {
  if (!!a.isFolder !== !!b.isFolder) return a.isFolder ? -1 : 1;
  var c = String(a.name).localeCompare(String(b.name), undefined, { numeric: true, sensitivity: "base" });
  if (c === 0) {
    var an = String(a.name);
    var bn = String(b.name);
    c = an < bn ? -1 : (an > bn ? 1 : 0);
  }
  return dir < 0 ? -c : c;
}
function readTree() {
  var map = {};
  try {
    JSON.parse(localStorage.getItem("fileTree") || "[]").forEach(function (n) {
      if (n && n.path) map[n.path] = !!n.collapsed;
    });
  } catch (e) {}
  return map;
}
function writeTree(map) {
  try {
    localStorage.setItem("fileTree", JSON.stringify(Object.keys(map).map(function (p) {
      return { path: p, collapsed: !!map[p] };
    })));
  } catch (e) {}
}
function explorers() {
  return Array.prototype.slice.call(document.querySelectorAll("div.explorer"));
}
function contentOf(root) { return root.querySelector(".explorer-content"); }
function entryInfo(li) {
  var fc = li.querySelector(":scope > .folder-container");
  if (fc) {
    var name = "";
    var t = fc.querySelector(".folder-title");
    if (t && t.textContent) name = t.textContent.trim();
    if (!name) {
      var fp = fc.getAttribute("data-folderpath") || "";
      if (!fp) {
        var fb = fc.querySelector(".folder-button");
        fp = (fb && fb.getAttribute && fb.getAttribute("data-folderpath")) || "";
      }
      name = baseLast(fp);
    }
    return { isFolder: true, name: name };
  }
  var a = li.querySelector(":scope > a");
  var an = (a && a.textContent) ? a.textContent.trim() : "";
  return { isFolder: false, name: an };
}
function sortUl(ul, dir) {
  var items = Array.prototype.filter.call(ul.children, function (el) {
    return !!el && el.tagName === "LI" && !el.classList.contains("overflow-end");
  });
  if (items.length < 2) return;
  var infos = items.map(entryInfo);
  var idx = items.map(function (x, i) { return i; });
  idx.sort(function (x, y) { return cmpEntries(infos[x], infos[y], dir); });
  var ordered = idx.every(function (v, i) { return v === i; });
  if (ordered) return;
  idx.forEach(function (v) { ul.appendChild(items[v]); });
}
function applySort(root) {
  var dir = readSortDir();
  var uls = root.querySelectorAll("ul.explorer-ul, ul.content");
  Array.prototype.forEach.call(uls, function (ul) { sortUl(ul, dir); });
}
function ensureSortButton(root) {
  var content = contentOf(root);
  if (!content) return;
  var bar = content.querySelector(":scope > .explorer-loop6-toolbar");
  if (!bar) return;
  var btn = bar.querySelector('[data-loop7="toggle-sort"]');
  if (!btn) {
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "explorer-loop6-btn";
    btn.setAttribute("data-loop7", "toggle-sort");
    btn.title = "Toggle sort direction";
    btn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      writeSortDir(-readSortDir());
      explorers().forEach(function (r) { applySort(r); refreshSortButton(r); });
    });
    bar.appendChild(btn);
  }
  refreshSortButton(root);
}
function refreshSortButton(root) {
  var content = contentOf(root);
  if (!content) return;
  var bar = content.querySelector(":scope > .explorer-loop6-toolbar");
  if (!bar) return;
  var btn = bar.querySelector('[data-loop7="toggle-sort"]');
  if (!btn) return;
  var desc = readSortDir() < 0;
  btn.textContent = desc ? "Z-A" : "A-Z";
  btn.setAttribute("aria-pressed", desc ? "true" : "false");
  btn.setAttribute("data-state", desc ? "desc" : "asc");
}
function activeLink(root) {
  var content = contentOf(root);
  if (!content) return null;
  return content.querySelector("a.active, a.is-active");
}
function expandAncestors(root, link) {
  var saved = readTree();
  var changed = false;
  var li = link.closest("li");
  var guard = 0;
  while (li && guard < 64) {
    guard++;
    var ul = li.parentElement;
    if (!ul || ul.tagName !== "UL") break;
    var outer = ul.parentElement;
    if (!outer || !outer.classList || !outer.classList.contains("folder-outer")) break;
    outer.classList.add("open");
    var cont = outer.previousElementSibling;
    var fp = (cont && cont.getAttribute) ? cont.getAttribute("data-folderpath") : null;
    if (fp && saved[fp] !== false) { saved[fp] = false; changed = true; }
    li = outer.closest("li");
  }
  if (changed) writeTree(saved);
}
function centreLink(root, link) {
  var container = contentOf(root);
  if (!container) return;
  var pageY = (typeof window.scrollY === "number") ? window.scrollY : 0;
  try {
    var cr = container.getBoundingClientRect();
    var lr = link.getBoundingClientRect();
    var target = container.scrollTop + (lr.top - cr.top) - (container.clientHeight - link.clientHeight) / 2;
    if (isFinite(target)) container.scrollTo({ top: target, behavior: "auto" });
  } catch (e) {}
  try {
    if (window.scrollY !== pageY) window.scrollTo(0, pageY);
  } catch (e) {}
}
function flashLink(link) {
  try {
    link.classList.add(FLASH_CLASS);
    if (link._loop7flash) clearTimeout(link._loop7flash);
    link._loop7flash = setTimeout(function () { link.classList.remove(FLASH_CLASS); }, FLASH_MS);
  } catch (e) {}
}
function locateCentre(root) {
  var link = activeLink(root);
  if (!link) return false;
  expandAncestors(root, link);
  centreLink(root, link);
  flashLink(link);
  return true;
}
function applyAll(root) {
  if (root.dataset.loop7Busy) return;
  root.dataset.loop7Busy = "1";
  try {
    ensureSortButton(root);
    applySort(root);
    if (locatePending) {
      locateTries++;
      if (locateCentre(root)) {
        locatePending = false;
        locateTries = 0;
        (function (r) {
          setTimeout(function () {
            var l = activeLink(r);
            if (l) { centreLink(r, l); flashLink(l); }
          }, 450);
        })(root);
      } else if (locateTries >= LOCATE_TRIES_MAX) {
        locatePending = false;
        locateTries = 0;
      }
    }
    refreshSortButton(root);
  } finally {
    delete root.dataset.loop7Busy;
  }
}
function scheduleApply(root) {
  if (root.dataset.loop7Scheduled) return;
  root.dataset.loop7Scheduled = "1";
  requestAnimationFrame(function () {
    delete root.dataset.loop7Scheduled;
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
document.addEventListener("nav", function () {
  locatePending = true;
  locateTries = 0;
  initAll();
});
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAll);
initAll();
})();`;

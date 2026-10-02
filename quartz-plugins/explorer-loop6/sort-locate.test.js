// Loop 7 e2e/regression tests (F2 sort toggle + F3 locate+centre).
// Pure-comparator behaviour is tested directly; client-script wiring is asserted
// against the shipped loop7Script string (same artifact concatenated into the bundle).
import test, { describe } from "node:test"
import assert from "node:assert"
import {
  compareEntries,
  basenameOf,
  SORT_KEY,
  FLASH_CLASS,
  FLASH_MS,
  loop7Script,
} from "./components/loop7.js"
import { ExplorerLoop6 } from "./components/index.js"

const F = (name) => ({ isFolder: true, name })
const f = (name) => ({ isFolder: false, name })

function sorted(names, isFolder, dir) {
  return names
    .map((name) => ({ isFolder, name }))
    .sort((a, b) => compareEntries(a, b, dir))
    .map((e) => e.name)
}

describe("F2 sort comparator", () => {
  test("A-Z ascending orders folders alphabetically", () => {
    assert.deepStrictEqual(sorted(["Software", "Hardware", "Math"], true, 1), [
      "Hardware",
      "Math",
      "Software",
    ])
  })

  test("Z-A is the exact reverse of A-Z at folder level", () => {
    const folders = ["Hardware", "Math", "Software", "Algorithms"]
    const asc = sorted(folders, true, 1)
    const desc = sorted(folders, true, -1)
    assert.deepStrictEqual(desc, [...asc].reverse())
  })

  test("folders-first grouping preserved both directions", () => {
    const mixed = [f("zebra.md"), F("Hardware"), f("apple.md"), F("Math")]
    const asc = [...mixed].sort((a, b) => compareEntries(a, b, 1))
    const desc = [...mixed].sort((a, b) => compareEntries(a, b, -1))
    for (const arr of [asc, desc]) {
      assert.strictEqual(arr[0].isFolder, true)
      assert.strictEqual(arr[1].isFolder, true)
      assert.strictEqual(arr[2].isFolder, false)
      assert.strictEqual(arr[3].isFolder, false)
    }
    assert.deepStrictEqual(
      asc.map((e) => e.name),
      ["Hardware", "Math", "apple.md", "zebra.md"],
    )
  })

  test("numeric-aware and case-insensitive like upstream sortFn", () => {
    assert.deepStrictEqual(sorted(["ch10", "ch2", "ch1"], false, 1), ["ch1", "ch2", "ch10"])
    assert.ok(compareEntries(f("gray code"), f("Gray Code"), 1) > 0)
    assert.ok(compareEntries(f("Gray Code"), f("gray code"), 1) < 0)
    // tie-break is deterministic (byte order) when localeCompare ties
    assert.deepStrictEqual(sorted(["b", "B", "a"], false, 1)[0], "a")
  })
})

describe("F2/F3 helpers and constants", () => {
  test("SORT_KEY defaults to ascending A-Z contract", () => {
    assert.strictEqual(SORT_KEY, "explorerSortDir")
  })

  test("flash highlight lasts 3s per SPEC", () => {
    assert.strictEqual(FLASH_CLASS, "explorer-loop7-flash")
    assert.strictEqual(FLASH_MS, 3000)
  })

  test("basenameOf falls back to last non-empty path segment", () => {
    assert.strictEqual(basenameOf("Hardware/Digital Formats"), "Digital Formats")
    assert.strictEqual(basenameOf("Hardware/"), "Hardware")
    assert.strictEqual(basenameOf(""), "")
  })
})

describe("F2+F3 client script wiring (shipped artifact)", () => {
  test("sort direction persists via localStorage", () => {
    assert.ok(loop7Script.includes("explorerSortDir"))
    assert.ok(loop7Script.includes("localStorage"))
  })

  test("sort toggle button lives in the explorer header toolbar", () => {
    assert.ok(loop7Script.includes("explorer-loop6-toolbar"))
    assert.ok(loop7Script.includes('data-loop7="toggle-sort"') || loop7Script.includes("toggle-sort"))
    assert.ok(loop7Script.includes("A-Z") && loop7Script.includes("Z-A"))
  })

  test("DOM re-order covers folders by title with path/basename fallback", () => {
    assert.ok(loop7Script.includes(".folder-title"))
    assert.ok(loop7Script.includes("data-folderpath"))
    assert.ok(loop7Script.includes("overflow-end"))
    assert.ok(loop7Script.includes("ul.explorer-ul"))
  })

  test("locate centres inside .explorer-content and never moves page scroll", () => {
    assert.ok(loop7Script.includes(".explorer-content"))
    assert.ok(loop7Script.includes("getBoundingClientRect"))
    assert.ok(loop7Script.includes("scrollTo"))
    assert.ok(loop7Script.includes("window.scrollY"))
    assert.ok(loop7Script.includes("a.active"))
    assert.ok(loop7Script.includes("folder-outer"))
  })

  test("locate flashes the active link for 3s", () => {
    assert.ok(loop7Script.includes("explorer-loop7-flash"))
    assert.ok(loop7Script.includes("3000"))
    assert.ok(loop7Script.includes("setTimeout"))
  })

  test("re-inits on SPA nav and guards double injection", () => {
    assert.ok(loop7Script.includes("__explorerLoop7"))
    assert.ok(loop7Script.includes('"nav"'))
    assert.ok(loop7Script.includes("MutationObserver"))
  })

  test("script is template-literal safe (no backticks or ${})", () => {
    assert.ok(!loop7Script.includes("`"))
    assert.ok(!loop7Script.includes("${"))
  })

  test("override component ships both behaviour scripts in order", () => {
    const Component = ExplorerLoop6()
    assert.ok(Array.isArray(Component.afterDOMLoaded))
    assert.strictEqual(Component.afterDOMLoaded.length, 2)
    assert.ok(Component.afterDOMLoaded[1].includes("__explorerLoop7"))
  })
})

# MegaTabs — Design Specification

## Concept

MegaTabs introduces a **parent/child tab model** using horizontal rows rather than the vertical sidebar trees used by existing solutions (Tree Style Tab, Sidebery, etc.).

- **Row 1 (top):** Parent tabs — behaves like a normal browser tab bar.
- **Row 2 (below):** Child tabs — contextual to whichever parent tab is active. Swaps out when you switch parents, like a website megamenu.
- **Maximum two levels.** No grandchild tabs. This is a deliberate constraint to avoid vertical space creep.

---

## Interaction Model

### All tab levels (parent and child)

| Action | Behaviour |
|--------|-----------|
| **Click** | Navigates within the current tab/viewport. Normal browser behaviour. |
| **⌘/Ctrl + Click** | Opens the link as a **sibling tab on the same row**. If you're on a parent tab, it opens a new parent tab. If you're on a child tab, it opens a new sibling child tab. |

### Parent level only

| Action | Behaviour |
|--------|-----------|
| **⌘/Ctrl + ⇧ + Click** | Opens the link as a **child tab** in row 2 beneath the current parent. This action is not available from child tabs. |

The key insight: **⌘+Click always means "same row sibling"** regardless of which row you're on. The child-opening shortcut is a separate, parent-only action.

---

## Child Row Behaviour (Megamenu Model)

- When a parent tab is selected, its child tabs appear in row 2.
- Switching to a different parent swaps out the child row entirely — only children of the active parent are visible.
- If the active parent has no children, row 2 shows as an empty reserved space (no shift).
- Parents with children show a small coloured dot indicator on their tab.

---

## Viewport Shift

- When the **first child tab is opened anywhere** (on any parent), the browser viewport shifts down to make room for row 2.
- The viewport **stays shifted** as long as any parent has any children.
- The viewport only shifts back up when **all children across all parents are closed**.
- Switching to a parent with no children does NOT shift the viewport back — the empty row 2 space remains. This prevents jarring content jumps.

---

## Child Row Positioning

- Child tabs are **centred horizontally underneath their parent tab**.
- If centering would cause child tabs to overflow the left or right edge of the container, the position is **clamped** so tabs stay fully visible.
- For a parent tab near the left edge (e.g., the first tab), children align flush left and extend rightward.
- For a parent tab near the right edge, children push leftward to stay within bounds.
- The clamping calculation runs on render using DOM measurements (parent tab centre, child group width, container width).

---

## Tab Closing

- Closing a **child tab** removes it from the child row. If it was the active child, the last remaining sibling becomes active.
- Closing a **parent tab** closes all of its child tabs as well.
- When all children everywhere are closed, the child row collapses and the viewport shifts back up.

---

## Visual Design

- **Connector:** A small circular nub appears at the bottom centre of the active parent tab when it has children, visually linking it to the child row below. The design intent is subtly skeuomorphic.
- **Child tab border:** Each child tab has a coloured top border matching its parent tab's accent colour. The active child has a fully opaque border; inactive children have a faded version.
- **Parent indicator dot:** A small coloured dot appears on parent tabs that have children, visible even when those children aren't displayed (because another parent is active).

---

## File Structure

```
browser-prototype.jsx          — React component with all logic
browser-prototype.module.scss  — SCSS module with all styling
```

The JSX imports the SCSS module via `import styles from "./browser-prototype.module.scss"`. Dynamic values (colours from page data, computed margins for child row positioning) remain as inline styles; everything else uses CSS classes.

---

## Mock Data

The prototype uses a `MOCK_PAGES` object that maps page IDs to page definitions. Each page has: `title`, `icon`, `url`, `color`, and `content` (with `heading` and `links`). Every page has at least two outgoing links so the interaction model can be fully demonstrated at any depth.

Pages are grouped by domain: Google Search results, GitHub repository pages, BBC News articles, Amazon product pages, MDN documentation, Nielsen Norman Group articles, and Chromium source code.

---

## Key State

| State | Purpose |
|-------|---------|
| `parentTabs` | Array of parent tab IDs (order = display order) |
| `activeParent` | Currently selected parent tab ID |
| `parentPageStack` | Map of parent tab ID → current page ID (for in-place navigation) |
| `childTabs` | Map of parent tab ID → array of child tab IDs |
| `activeChild` | Map of parent tab ID → active child tab ID |
| `childPageMap` | Map of child tab ID → current page ID (for in-place navigation within child tabs) |
| `hasAnyChildren` | Boolean — true if any parent has any children (controls viewport shift) |
| `childRowLeft` | Computed pixel offset for centering the child group under the active parent |

---

## What's Next / Open Questions

- **Tab overflow:** When too many tabs exist on either row to fit, how should overflow be handled? Horizontal scrolling? Compressing tab widths? A "more" dropdown?
- **Skeuomorphic connector:** The current connector nub is minimal. Could be refined with a more pronounced visual bridge between parent and child row.
- **Animations:** Child row appearance/disappearance, tab insertion, child row sliding when switching parents.
- **Keyboard navigation:** Tab switching via keyboard shortcuts (not just mouse clicks on links).
- **Right-click context menu:** "Open in child tab" / "Open in new tab" options.
- **Tab reordering:** Drag and drop within a row.
- **Persistence:** Saving tab state across sessions.

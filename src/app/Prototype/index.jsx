'use client'

import { useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import styles from "./Prototype.module.scss";

const ICONS = {
  globe: "🌐",
  search: "🔍",
  doc: "📄",
  shop: "🛒",
  code: "💻",
  mail: "✉️",
  news: "📰",
  video: "🎬",
};

const MOCK_PAGES = {
  "tab-1": {
    title: "Google Search",
    icon: "search",
    url: "google.com",
    color: "#4285F4",
    content: {
      heading: "Search Results: Browser UI Design",
      links: [
        { label: "MDN: Browser Chrome Architecture", id: "mdn-article" },
        { label: "Nielsen Norman: Tab Design Patterns", id: "nn-tabs" },
        { label: "Chromium Blog: Tab Strip Redesign", id: "chromium-blog" },
      ],
    },
  },
  "tab-2": {
    title: "GitHub",
    icon: "code",
    url: "github.com/browser-project",
    color: "#238636",
    content: {
      heading: "browser-project / README.md",
      links: [
        { label: "View Issues (23 open)", id: "gh-issues" },
        { label: "Pull Requests", id: "gh-prs" },
        { label: "Wiki: Architecture Docs", id: "gh-wiki" },
      ],
    },
  },
  "tab-3": {
    title: "BBC News",
    icon: "news",
    url: "bbc.co.uk/news",
    color: "#BB1919",
    content: {
      heading: "BBC News — Top Stories",
      links: [
        { label: "Tech: New browser wars heat up in 2026", id: "bbc-tech" },
        { label: "Science: Webb telescope latest images", id: "bbc-science" },
        { label: "Sport: Premier League roundup", id: "bbc-sport" },
      ],
    },
  },
  "tab-4": {
    title: "Amazon",
    icon: "shop",
    url: "amazon.co.uk",
    color: "#FF9900",
    content: {
      heading: "Your Recommendations",
      links: [
        { label: "Logitech MX Master 3S — £89.99", id: "amz-mouse" },
        { label: "Keychron K2 Keyboard — £74.99", id: "amz-keyboard" },
        { label: "Dell UltraSharp 27\" — £449.99", id: "amz-monitor" },
      ],
    },
  },
  "mdn-article": { title: "MDN: Browser Chrome", icon: "doc", url: "developer.mozilla.org/browser-chrome", color: "#1B1B1B", content: { heading: "Browser Chrome Architecture — MDN Web Docs", links: [{ label: "See also: Web Extensions API", id: "mdn-ext" }, { label: "Glossary: User Agent", id: "mdn-glossary" }] } },
  "nn-tabs": { title: "NN: Tab Patterns", icon: "doc", url: "nngroup.com/articles/tabs", color: "#1B1B1B", content: { heading: "Tabs, Used Right — Nielsen Norman Group", links: [{ label: "Related: Navigation Design", id: "nn-nav" }] } },
  "chromium-blog": { title: "Chromium Blog", icon: "doc", url: "blog.chromium.org/tab-strip", color: "#4285F4", content: { heading: "Redesigning the Tab Strip — Chromium Blog", links: [{ label: "Chromium Source: tab_strip_model.cc", id: "cr-source" }] } },
  "gh-issues": { title: "Issues · browser-project", icon: "code", url: "github.com/browser-project/issues", color: "#238636", content: { heading: "23 Open Issues", links: [{ label: "#142 — Child tab overflow behaviour", id: "gh-142" }] } },
  "gh-prs": { title: "Pull Requests", icon: "code", url: "github.com/browser-project/pulls", color: "#238636", content: { heading: "Pull Requests — 3 open, 47 merged", links: [{ label: "PR #48 — Refactor tab state management", id: "gh-pr48" }, { label: "PR #47 — Add child tab animations", id: "gh-pr47" }] } },
  "gh-wiki": { title: "Wiki", icon: "code", url: "github.com/browser-project/wiki", color: "#238636", content: { heading: "Architecture Documentation", links: [{ label: "Page: Rendering Pipeline", id: "gh-wiki-render" }, { label: "Page: Tab Lifecycle", id: "gh-wiki-lifecycle" }] } },
  "bbc-tech": { title: "BBC Tech", icon: "news", url: "bbc.co.uk/news/technology", color: "#BB1919", content: { heading: "New browser wars heat up in 2026", links: [{ label: "Related: Chrome loses market share for first time", id: "bbc-chrome" }, { label: "Also: Apple unveils Safari 20 features", id: "bbc-safari" }] } },
  "bbc-science": { title: "BBC Science", icon: "news", url: "bbc.co.uk/news/science", color: "#BB1919", content: { heading: "Webb Telescope: Stunning New Images", links: [{ label: "Gallery: Full resolution images", id: "bbc-gallery" }, { label: "Explainer: How Webb captures infrared light", id: "bbc-infrared" }] } },
  "bbc-sport": { title: "BBC Sport", icon: "news", url: "bbc.co.uk/sport", color: "#BB1919", content: { heading: "Premier League Weekend Roundup", links: [{ label: "Match report: Arsenal 3–1 Chelsea", id: "bbc-arsenal" }, { label: "Table: Premier League standings", id: "bbc-table" }, { label: "Transfers: January window latest", id: "bbc-transfers" }] } },
  "amz-mouse": { title: "Logitech MX Master", icon: "shop", url: "amazon.co.uk/dp/B09HM94VDS", color: "#FF9900", content: { heading: "Logitech MX Master 3S — Wireless Mouse", links: [{ label: "Compare with: Razer DeathAdder V3", id: "amz-razer" }, { label: "Customers also bought: Mouse pad XL", id: "amz-pad" }] } },
  "amz-keyboard": { title: "Keychron K2", icon: "shop", url: "amazon.co.uk/dp/B0BG9TJ3LW", color: "#FF9900", content: { heading: "Keychron K2 — Wireless Mechanical Keyboard", links: [{ label: "Compare with: Keychron Q1 Pro", id: "amz-q1" }, { label: "Accessories: Keycap set — Retro", id: "amz-keycaps" }] } },
  "amz-monitor": { title: "Dell UltraSharp", icon: "shop", url: "amazon.co.uk/dp/B0B5H8D1N4", color: "#FF9900", content: { heading: "Dell UltraSharp U2723QE — 27\" 4K Monitor", links: [{ label: "Compare with: LG 27UN850-W", id: "amz-lg" }, { label: "Monitor arm: Ergotron LX — £109.99", id: "amz-arm" }] } },
  "mdn-ext": { title: "Web Extensions API", icon: "doc", url: "developer.mozilla.org/web-extensions", color: "#1B1B1B", content: { heading: "Web Extensions API — MDN", links: [{ label: "Guide: Your first extension", id: "mdn-first-ext" }, { label: "API Reference: tabs.create()", id: "mdn-tabs-api" }] } },
  "mdn-glossary": { title: "Glossary: User Agent", icon: "doc", url: "developer.mozilla.org/glossary/user-agent", color: "#1B1B1B", content: { heading: "User Agent — MDN Glossary", links: [{ label: "See also: HTTP Headers", id: "mdn-headers" }] } },
  "nn-nav": { title: "Navigation Design", icon: "doc", url: "nngroup.com/articles/navigation", color: "#1B1B1B", content: { heading: "Navigation Design Principles — NNG", links: [{ label: "Related: Mega Menus Work Well", id: "nn-mega" }, { label: "Study: Hamburger Menus Revisited", id: "nn-hamburger" }] } },
  "cr-source": { title: "tab_strip_model.cc", icon: "code", url: "source.chromium.org/tab_strip_model", color: "#4285F4", content: { heading: "chromium / src / tab_strip_model.cc", links: [{ label: "Related: tab_strip_controller.cc", id: "cr-controller" }, { label: "Header: tab_strip_model.h", id: "cr-header" }] } },
  "gh-142": { title: "#142 — Overflow", icon: "code", url: "github.com/browser-project/issues/142", color: "#238636", content: { heading: "Issue #142: Child tab overflow behaviour", links: [{ label: "Linked PR: #45 — Horizontal scroll for child row", id: "gh-pr45" }, { label: "Related: #98 — Max tabs per row", id: "gh-98" }] } },
  "gh-pr48": { title: "PR #48 — Refactor", icon: "code", url: "github.com/browser-project/pull/48", color: "#238636", content: { heading: "PR #48: Refactor tab state management", links: [{ label: "Diff: src/state/tabStore.ts", id: "gh-pr48-diff" }, { label: "Review comment by @aliceDev", id: "gh-pr48-review" }] } },
  "gh-pr47": { title: "PR #47 — Animations", icon: "code", url: "github.com/browser-project/pull/47", color: "#238636", content: { heading: "PR #47: Add child tab animations", links: [{ label: "Diff: src/ui/childRow.css", id: "gh-pr47-diff" }, { label: "CI: Build passed ✓", id: "gh-pr47-ci" }] } },
  "gh-wiki-render": { title: "Rendering Pipeline", icon: "code", url: "github.com/browser-project/wiki/rendering", color: "#238636", content: { heading: "Wiki: Rendering Pipeline", links: [{ label: "Diagram: Frame lifecycle", id: "gh-wiki-frame" }, { label: "Related: Compositing layers", id: "gh-wiki-comp" }] } },
  "gh-wiki-lifecycle": { title: "Tab Lifecycle", icon: "code", url: "github.com/browser-project/wiki/tab-lifecycle", color: "#238636", content: { heading: "Wiki: Tab Lifecycle", links: [{ label: "States: created → active → suspended → closed", id: "gh-wiki-states" }, { label: "API hook: onTabStateChange", id: "gh-wiki-hook" }] } },
  "gh-pr45": { title: "PR #45 — Scroll", icon: "code", url: "github.com/browser-project/pull/45", color: "#238636", content: { heading: "PR #45: Horizontal scroll for child row", links: [{ label: "Screenshot: overflow demo", id: "gh-pr45-screenshot" }, { label: "Related issue: #98", id: "gh-98" }] } },
  "gh-98": { title: "#98 — Max tabs", icon: "code", url: "github.com/browser-project/issues/98", color: "#238636", content: { heading: "Issue #98: Max tabs per row", links: [{ label: "Proposal: Scroll vs wrap", id: "gh-98-proposal" }, { label: "Linked PR: #45", id: "gh-pr45" }] } },
  "bbc-chrome": { title: "Chrome market share", icon: "news", url: "bbc.co.uk/news/technology/chrome", color: "#BB1919", content: { heading: "Chrome loses market share for first time", links: [{ label: "Analysis: What went wrong for Google", id: "bbc-chrome-analysis" }, { label: "Data: Browser usage stats 2026", id: "bbc-browser-stats" }] } },
  "bbc-safari": { title: "Safari 20", icon: "news", url: "bbc.co.uk/news/technology/safari", color: "#BB1919", content: { heading: "Apple unveils Safari 20 features", links: [{ label: "Feature: Built-in translation engine", id: "bbc-safari-translate" }, { label: "Review: First impressions", id: "bbc-safari-review" }] } },
  "bbc-gallery": { title: "Webb Gallery", icon: "news", url: "bbc.co.uk/news/science/webb-gallery", color: "#BB1919", content: { heading: "Webb Telescope: Full Resolution Gallery", links: [{ label: "Image: Carina Nebula (8K)", id: "bbc-carina" }, { label: "Image: Phantom Galaxy core", id: "bbc-phantom" }] } },
  "bbc-infrared": { title: "Infrared Explainer", icon: "news", url: "bbc.co.uk/news/science/infrared", color: "#BB1919", content: { heading: "How Webb captures infrared light", links: [{ label: "Diagram: NIRCam vs MIRI sensors", id: "bbc-sensors" }, { label: "Video: Light spectrum explained", id: "bbc-spectrum" }] } },
  "bbc-arsenal": { title: "Arsenal 3–1 Chelsea", icon: "news", url: "bbc.co.uk/sport/football/arsenal-chelsea", color: "#BB1919", content: { heading: "Match Report: Arsenal 3–1 Chelsea", links: [{ label: "Player ratings: Saka 9/10", id: "bbc-ratings" }, { label: "Post-match: Arteta press conference", id: "bbc-arteta" }] } },
  "bbc-table": { title: "PL Standings", icon: "news", url: "bbc.co.uk/sport/football/table", color: "#BB1919", content: { heading: "Premier League Table 2025/26", links: [{ label: "Form guide: Last 5 matches", id: "bbc-form" }, { label: "Stats: Top scorers", id: "bbc-scorers" }] } },
  "bbc-transfers": { title: "Transfer News", icon: "news", url: "bbc.co.uk/sport/football/transfers", color: "#BB1919", content: { heading: "January Transfer Window: Latest", links: [{ label: "Done deal: Osimhen to Chelsea — £85m", id: "bbc-osimhen" }, { label: "Rumour: Salah contract latest", id: "bbc-salah" }] } },
  "amz-razer": { title: "Razer DeathAdder V3", icon: "shop", url: "amazon.co.uk/dp/razer-v3", color: "#FF9900", content: { heading: "Razer DeathAdder V3 — Ergonomic Mouse", links: [{ label: "Reviews: 4.6★ (2,340 ratings)", id: "amz-razer-reviews" }, { label: "Compare with: Logitech G502 X", id: "amz-g502" }] } },
  "amz-pad": { title: "Mouse Pad XL", icon: "shop", url: "amazon.co.uk/dp/mousepad-xl", color: "#FF9900", content: { heading: "Extended Mouse Pad XL — 900×400mm", links: [{ label: "Reviews: 4.3★ (890 ratings)", id: "amz-pad-reviews" }, { label: "Also available: RGB version", id: "amz-pad-rgb" }] } },
  "amz-q1": { title: "Keychron Q1 Pro", icon: "shop", url: "amazon.co.uk/dp/keychron-q1", color: "#FF9900", content: { heading: "Keychron Q1 Pro — Wireless QMK Keyboard", links: [{ label: "Switch options: Gateron Brown / Red / Blue", id: "amz-q1-switches" }, { label: "Accessory: Palm rest — £24.99", id: "amz-palmrest" }] } },
  "amz-keycaps": { title: "Retro Keycap Set", icon: "shop", url: "amazon.co.uk/dp/retro-keycaps", color: "#FF9900", content: { heading: "PBT Keycap Set — Retro Colourway", links: [{ label: "Compatibility: Cherry MX / Gateron / Kailh", id: "amz-keycap-compat" }, { label: "Also: Pastel colourway", id: "amz-keycap-pastel" }] } },
  "amz-lg": { title: "LG 27UN850-W", icon: "shop", url: "amazon.co.uk/dp/lg-27un850", color: "#FF9900", content: { heading: "LG 27UN850-W — 27\" 4K USB-C Monitor", links: [{ label: "Spec sheet: HDR400, 60Hz, USB-C 96W", id: "amz-lg-spec" }, { label: "Reviews: 4.5★ (1,120 ratings)", id: "amz-lg-reviews" }] } },
  "amz-arm": { title: "Ergotron LX Arm", icon: "shop", url: "amazon.co.uk/dp/ergotron-lx", color: "#FF9900", content: { heading: "Ergotron LX Monitor Arm — £109.99", links: [{ label: "Installation guide (PDF)", id: "amz-arm-guide" }, { label: "Compatible: 7–11.3 kg monitors", id: "amz-arm-compat" }] } },
  "mdn-first-ext": { title: "Your first extension", icon: "doc", url: "developer.mozilla.org/first-extension", color: "#1B1B1B", content: { heading: "Your First Extension — MDN Tutorial", links: [{ label: "Step 1: manifest.json", id: "mdn-manifest" }, { label: "Step 2: Background scripts", id: "mdn-background" }] } },
  "mdn-tabs-api": { title: "tabs.create()", icon: "doc", url: "developer.mozilla.org/api/tabs/create", color: "#1B1B1B", content: { heading: "tabs.create() — Web Extensions API", links: [{ label: "Parameters: url, active, openerTabId", id: "mdn-tabs-params" }, { label: "Related: tabs.update()", id: "mdn-tabs-update" }] } },
  "mdn-headers": { title: "HTTP Headers", icon: "doc", url: "developer.mozilla.org/http-headers", color: "#1B1B1B", content: { heading: "HTTP Headers — MDN Reference", links: [{ label: "Common: Content-Type, Authorization", id: "mdn-common-headers" }, { label: "Security: CORS headers explained", id: "mdn-cors" }] } },
  "nn-mega": { title: "Mega Menus", icon: "doc", url: "nngroup.com/articles/mega-menus", color: "#1B1B1B", content: { heading: "Mega Menus Work Well — NNG", links: [{ label: "Case study: E-commerce navigation", id: "nn-ecommerce" }, { label: "Anti-pattern: Disappearing on hover", id: "nn-hover" }] } },
  "nn-hamburger": { title: "Hamburger Menus", icon: "doc", url: "nngroup.com/articles/hamburger-menus", color: "#1B1B1B", content: { heading: "Hamburger Menus Revisited — NNG", links: [{ label: "Data: Discoverability rates by device", id: "nn-discover" }, { label: "Alternative: Tab bar navigation", id: "nn-tabbar" }] } },
  "cr-controller": { title: "tab_strip_controller.cc", icon: "code", url: "source.chromium.org/tab_strip_controller", color: "#4285F4", content: { heading: "chromium / src / tab_strip_controller.cc", links: [{ label: "Method: AddTab()", id: "cr-addtab" }, { label: "Method: CloseTab()", id: "cr-closetab" }] } },
  "cr-header": { title: "tab_strip_model.h", icon: "code", url: "source.chromium.org/tab_strip_model.h", color: "#4285F4", content: { heading: "chromium / src / tab_strip_model.h", links: [{ label: "Class: TabStripModel", id: "cr-class" }, { label: "Enum: TabStripModelChange", id: "cr-enum" }] } },
  "gh-pr48-diff": { title: "tabStore.ts diff", icon: "code", url: "github.com/browser-project/pull/48/files", color: "#238636", content: { heading: "Diff: src/state/tabStore.ts", links: [{ label: "Line 42: New TabState interface", id: "gh-pr48" }, { label: "Line 87: Migration helper", id: "gh-pr47" }] } },
  "gh-pr48-review": { title: "Review by @aliceDev", icon: "code", url: "github.com/browser-project/pull/48#review", color: "#238636", content: { heading: "Review: @aliceDev — Approve with comments", links: [{ label: "Comment: Consider memoising selector", id: "gh-pr48" }, { label: "Suggestion: Rename tabMeta → tabContext", id: "gh-pr47" }] } },
  "gh-pr47-diff": { title: "childRow.css diff", icon: "code", url: "github.com/browser-project/pull/47/files", color: "#238636", content: { heading: "Diff: src/ui/childRow.css", links: [{ label: "Added: slide-in keyframes", id: "gh-pr47" }, { label: "Modified: .child-tab transition", id: "gh-pr48" }] } },
  "gh-pr47-ci": { title: "CI: Build passed", icon: "code", url: "github.com/browser-project/pull/47/checks", color: "#238636", content: { heading: "CI Pipeline — All checks passed", links: [{ label: "Job: Unit tests (142 passed)", id: "gh-pr47" }, { label: "Job: Visual regression", id: "gh-pr48" }] } },
  "gh-wiki-frame": { title: "Frame lifecycle", icon: "code", url: "github.com/browser-project/wiki/frame-lifecycle", color: "#238636", content: { heading: "Diagram: Frame Lifecycle", links: [{ label: "Phase: Layout calculation", id: "gh-wiki-render" }, { label: "Phase: Paint & composite", id: "gh-wiki-comp" }] } },
  "gh-wiki-comp": { title: "Compositing layers", icon: "code", url: "github.com/browser-project/wiki/compositing", color: "#238636", content: { heading: "Compositing Layers", links: [{ label: "GPU acceleration triggers", id: "gh-wiki-render" }, { label: "Debugging: Layer borders", id: "gh-wiki-frame" }] } },
  "gh-wiki-states": { title: "Tab states", icon: "code", url: "github.com/browser-project/wiki/tab-states", color: "#238636", content: { heading: "Tab States: created → active → suspended → closed", links: [{ label: "Transition rules", id: "gh-wiki-lifecycle" }, { label: "Memory management", id: "gh-wiki-hook" }] } },
  "gh-wiki-hook": { title: "onTabStateChange", icon: "code", url: "github.com/browser-project/wiki/on-tab-state-change", color: "#238636", content: { heading: "API: onTabStateChange", links: [{ label: "Usage example", id: "gh-wiki-lifecycle" }, { label: "Event payload schema", id: "gh-wiki-states" }] } },
  "gh-pr45-screenshot": { title: "Overflow demo", icon: "code", url: "github.com/browser-project/pull/45#screenshot", color: "#238636", content: { heading: "Screenshot: Overflow scroll demo", links: [{ label: "Before: tabs clipped", id: "gh-pr45" }, { label: "After: horizontal scroll", id: "gh-98" }] } },
  "gh-98-proposal": { title: "Scroll vs wrap", icon: "code", url: "github.com/browser-project/issues/98#proposal", color: "#238636", content: { heading: "Proposal: Scroll vs wrap for overflow", links: [{ label: "Option A: Horizontal scroll", id: "gh-pr45" }, { label: "Option B: Compress tab width", id: "gh-98" }] } },
  "bbc-chrome-analysis": { title: "Chrome analysis", icon: "news", url: "bbc.co.uk/news/technology/chrome-analysis", color: "#BB1919", content: { heading: "Analysis: What went wrong for Google Chrome", links: [{ label: "Timeline: Chrome's dominance 2012–2025", id: "bbc-browser-stats" }, { label: "Expert view: Mozilla CEO interview", id: "bbc-chrome" }] } },
  "bbc-browser-stats": { title: "Browser stats 2026", icon: "news", url: "bbc.co.uk/news/technology/browser-stats", color: "#BB1919", content: { heading: "Data: Browser usage statistics 2026", links: [{ label: "Chart: Desktop market share", id: "bbc-chrome" }, { label: "Chart: Mobile market share", id: "bbc-chrome-analysis" }] } },
  "bbc-safari-translate": { title: "Safari translation", icon: "news", url: "bbc.co.uk/news/technology/safari-translate", color: "#BB1919", content: { heading: "Safari 20: Built-in translation engine", links: [{ label: "Supported: 26 languages at launch", id: "bbc-safari" }, { label: "Compare: Chrome Translate vs Safari", id: "bbc-safari-review" }] } },
  "bbc-safari-review": { title: "Safari 20 review", icon: "news", url: "bbc.co.uk/news/technology/safari-review", color: "#BB1919", content: { heading: "First impressions: Safari 20", links: [{ label: "Performance: Speedometer 3 results", id: "bbc-safari" }, { label: "Privacy: Intelligent tracking prevention v5", id: "bbc-safari-translate" }] } },
  "bbc-carina": { title: "Carina Nebula", icon: "news", url: "bbc.co.uk/news/science/webb-carina", color: "#BB1919", content: { heading: "Carina Nebula — 8K Webb Image", links: [{ label: "Zoom: Star-forming region detail", id: "bbc-gallery" }, { label: "Compare: Hubble vs Webb", id: "bbc-phantom" }] } },
  "bbc-phantom": { title: "Phantom Galaxy", icon: "news", url: "bbc.co.uk/news/science/webb-phantom", color: "#BB1919", content: { heading: "Phantom Galaxy Core — Webb Image", links: [{ label: "Data: Spiral arm structure", id: "bbc-gallery" }, { label: "Related: Infrared wavelengths used", id: "bbc-infrared" }] } },
  "bbc-sensors": { title: "NIRCam vs MIRI", icon: "news", url: "bbc.co.uk/news/science/sensors", color: "#BB1919", content: { heading: "Diagram: NIRCam vs MIRI sensors", links: [{ label: "NIRCam: Near-infrared 0.6–5μm", id: "bbc-infrared" }, { label: "MIRI: Mid-infrared 5–28μm", id: "bbc-spectrum" }] } },
  "bbc-spectrum": { title: "Light spectrum", icon: "news", url: "bbc.co.uk/news/science/spectrum", color: "#BB1919", content: { heading: "Video: Light spectrum explained", links: [{ label: "Visible vs infrared wavelengths", id: "bbc-infrared" }, { label: "Why infrared reveals hidden structures", id: "bbc-sensors" }] } },
  "bbc-ratings": { title: "Player ratings", icon: "news", url: "bbc.co.uk/sport/football/arsenal-chelsea-ratings", color: "#BB1919", content: { heading: "Player Ratings: Arsenal 3–1 Chelsea", links: [{ label: "Arsenal: Saka 9, Ødegaard 8, Havertz 7", id: "bbc-arsenal" }, { label: "Chelsea: Palmer 7, Jackson 5", id: "bbc-arteta" }] } },
  "bbc-arteta": { title: "Arteta presser", icon: "news", url: "bbc.co.uk/sport/football/arteta-presser", color: "#BB1919", content: { heading: "Post-match: Arteta press conference", links: [{ label: "Quote: 'Best performance of the season'", id: "bbc-arsenal" }, { label: "Injury update: Gabriel timeline", id: "bbc-ratings" }] } },
  "bbc-form": { title: "Form guide", icon: "news", url: "bbc.co.uk/sport/football/form-guide", color: "#BB1919", content: { heading: "Form Guide: Last 5 matches", links: [{ label: "Arsenal: W W W D W", id: "bbc-table" }, { label: "Liverpool: W W L W W", id: "bbc-scorers" }] } },
  "bbc-scorers": { title: "Top scorers", icon: "news", url: "bbc.co.uk/sport/football/top-scorers", color: "#BB1919", content: { heading: "Stats: Premier League top scorers", links: [{ label: "1. Haaland — 18 goals", id: "bbc-table" }, { label: "2. Salah — 15 goals", id: "bbc-form" }] } },
  "bbc-osimhen": { title: "Osimhen to Chelsea", icon: "news", url: "bbc.co.uk/sport/football/osimhen-chelsea", color: "#BB1919", content: { heading: "Done deal: Osimhen to Chelsea — £85m", links: [{ label: "Profile: Victor Osimhen career stats", id: "bbc-transfers" }, { label: "Analysis: How Chelsea will line up", id: "bbc-salah" }] } },
  "bbc-salah": { title: "Salah contract", icon: "news", url: "bbc.co.uk/sport/football/salah-contract", color: "#BB1919", content: { heading: "Rumour: Salah contract latest", links: [{ label: "Liverpool offered 2-year extension", id: "bbc-transfers" }, { label: "Saudi interest still strong", id: "bbc-osimhen" }] } },
  "amz-razer-reviews": { title: "Razer reviews", icon: "shop", url: "amazon.co.uk/dp/razer-v3/reviews", color: "#FF9900", content: { heading: "Customer Reviews: Razer DeathAdder V3", links: [{ label: "Top review: 'Best ergonomic shape'", id: "amz-razer" }, { label: "Critical review: 'Scroll wheel wobble'", id: "amz-g502" }] } },
  "amz-g502": { title: "Logitech G502 X", icon: "shop", url: "amazon.co.uk/dp/g502x", color: "#FF9900", content: { heading: "Logitech G502 X — Gaming Mouse", links: [{ label: "Compare with: Razer DeathAdder V3", id: "amz-razer" }, { label: "Reviews: 4.4★ (3,100 ratings)", id: "amz-razer-reviews" }] } },
  "amz-pad-reviews": { title: "Pad reviews", icon: "shop", url: "amazon.co.uk/dp/mousepad-xl/reviews", color: "#FF9900", content: { heading: "Customer Reviews: Mouse Pad XL", links: [{ label: "Top review: 'Great desk coverage'", id: "amz-pad" }, { label: "See also: RGB version", id: "amz-pad-rgb" }] } },
  "amz-pad-rgb": { title: "RGB Mouse Pad", icon: "shop", url: "amazon.co.uk/dp/mousepad-rgb", color: "#FF9900", content: { heading: "Extended Mouse Pad XL — RGB Edition", links: [{ label: "12 lighting modes", id: "amz-pad" }, { label: "Reviews: 4.1★", id: "amz-pad-reviews" }] } },
  "amz-q1-switches": { title: "Switch options", icon: "shop", url: "amazon.co.uk/dp/keychron-q1/switches", color: "#FF9900", content: { heading: "Switch Options: Gateron Brown / Red / Blue", links: [{ label: "Brown: Tactile, quiet", id: "amz-q1" }, { label: "Red: Linear, smooth", id: "amz-palmrest" }] } },
  "amz-palmrest": { title: "Palm rest", icon: "shop", url: "amazon.co.uk/dp/keychron-palmrest", color: "#FF9900", content: { heading: "Keychron Wooden Palm Rest — £24.99", links: [{ label: "Compatible keyboards", id: "amz-q1" }, { label: "Material: Walnut wood", id: "amz-q1-switches" }] } },
  "amz-keycap-compat": { title: "Keycap compatibility", icon: "shop", url: "amazon.co.uk/dp/retro-keycaps/compat", color: "#FF9900", content: { heading: "Compatibility: Cherry MX / Gateron / Kailh", links: [{ label: "Layout: ANSI & ISO included", id: "amz-keycaps" }, { label: "See also: Pastel colourway", id: "amz-keycap-pastel" }] } },
  "amz-keycap-pastel": { title: "Pastel keycaps", icon: "shop", url: "amazon.co.uk/dp/pastel-keycaps", color: "#FF9900", content: { heading: "PBT Keycap Set — Pastel Colourway", links: [{ label: "Preview: Colour swatches", id: "amz-keycaps" }, { label: "Reviews: 4.7★", id: "amz-keycap-compat" }] } },
  "amz-lg-spec": { title: "LG spec sheet", icon: "shop", url: "amazon.co.uk/dp/lg-27un850/spec", color: "#FF9900", content: { heading: "Spec: HDR400, 60Hz, USB-C 96W PD", links: [{ label: "Panel: IPS, 4K 3840×2160", id: "amz-lg" }, { label: "Ports: HDMI, DP, USB-C", id: "amz-lg-reviews" }] } },
  "amz-lg-reviews": { title: "LG reviews", icon: "shop", url: "amazon.co.uk/dp/lg-27un850/reviews", color: "#FF9900", content: { heading: "Customer Reviews: LG 27UN850-W", links: [{ label: "Top review: 'Stunning colours'", id: "amz-lg" }, { label: "Criticism: 'Stand is wobbly'", id: "amz-arm" }] } },
  "amz-arm-guide": { title: "Install guide", icon: "shop", url: "amazon.co.uk/dp/ergotron-lx/guide", color: "#FF9900", content: { heading: "Ergotron LX: Installation Guide", links: [{ label: "Step 1: Clamp or grommet mount", id: "amz-arm" }, { label: "Step 2: VESA plate attachment", id: "amz-arm-compat" }] } },
  "amz-arm-compat": { title: "Arm compatibility", icon: "shop", url: "amazon.co.uk/dp/ergotron-lx/compat", color: "#FF9900", content: { heading: "Compatible: 7–11.3 kg monitors", links: [{ label: "Works with: Dell, LG, Samsung 24–34\"", id: "amz-arm" }, { label: "Install guide", id: "amz-arm-guide" }] } },
  "mdn-manifest": { title: "manifest.json", icon: "doc", url: "developer.mozilla.org/manifest", color: "#1B1B1B", content: { heading: "Step 1: manifest.json", links: [{ label: "Required fields: name, version, manifest_version", id: "mdn-first-ext" }, { label: "Permissions reference", id: "mdn-background" }] } },
  "mdn-background": { title: "Background scripts", icon: "doc", url: "developer.mozilla.org/background-scripts", color: "#1B1B1B", content: { heading: "Step 2: Background scripts", links: [{ label: "Event-driven vs persistent", id: "mdn-first-ext" }, { label: "Messaging: runtime.sendMessage()", id: "mdn-manifest" }] } },
  "mdn-tabs-params": { title: "tabs.create params", icon: "doc", url: "developer.mozilla.org/api/tabs/create/params", color: "#1B1B1B", content: { heading: "Parameters: url, active, openerTabId", links: [{ label: "openerTabId: Sets parent relationship", id: "mdn-tabs-api" }, { label: "Example: Open inactive background tab", id: "mdn-tabs-update" }] } },
  "mdn-tabs-update": { title: "tabs.update()", icon: "doc", url: "developer.mozilla.org/api/tabs/update", color: "#1B1B1B", content: { heading: "tabs.update() — Web Extensions API", links: [{ label: "Change URL of existing tab", id: "mdn-tabs-api" }, { label: "Toggle muted state", id: "mdn-tabs-params" }] } },
  "mdn-common-headers": { title: "Common headers", icon: "doc", url: "developer.mozilla.org/common-headers", color: "#1B1B1B", content: { heading: "Common HTTP Headers", links: [{ label: "Content-Type: application/json", id: "mdn-headers" }, { label: "Authorization: Bearer tokens", id: "mdn-cors" }] } },
  "mdn-cors": { title: "CORS explained", icon: "doc", url: "developer.mozilla.org/cors", color: "#1B1B1B", content: { heading: "Security: CORS headers explained", links: [{ label: "Access-Control-Allow-Origin", id: "mdn-headers" }, { label: "Preflight requests: OPTIONS", id: "mdn-common-headers" }] } },
  "nn-ecommerce": { title: "E-commerce nav", icon: "doc", url: "nngroup.com/articles/ecommerce-nav", color: "#1B1B1B", content: { heading: "Case Study: E-commerce navigation", links: [{ label: "Finding: Category menus boost conversion 12%", id: "nn-mega" }, { label: "Pattern: Persistent category sidebar", id: "nn-hover" }] } },
  "nn-hover": { title: "Hover anti-pattern", icon: "doc", url: "nngroup.com/articles/hover-menus", color: "#1B1B1B", content: { heading: "Anti-pattern: Disappearing on hover", links: [{ label: "Fix: Add 300ms delay before closing", id: "nn-mega" }, { label: "Alternative: Click to open menus", id: "nn-ecommerce" }] } },
  "nn-discover": { title: "Discoverability data", icon: "doc", url: "nngroup.com/articles/menu-discoverability", color: "#1B1B1B", content: { heading: "Data: Discoverability rates by device", links: [{ label: "Desktop: 76% find hamburger menu", id: "nn-hamburger" }, { label: "Mobile: 92% find hamburger menu", id: "nn-tabbar" }] } },
  "nn-tabbar": { title: "Tab bar nav", icon: "doc", url: "nngroup.com/articles/tab-bar", color: "#1B1B1B", content: { heading: "Alternative: Tab bar navigation", links: [{ label: "iOS vs Android patterns", id: "nn-hamburger" }, { label: "Max 5 items recommended", id: "nn-discover" }] } },
  "cr-addtab": { title: "AddTab()", icon: "code", url: "source.chromium.org/AddTab", color: "#4285F4", content: { heading: "Method: AddTab()", links: [{ label: "Param: opener_tab_id", id: "cr-controller" }, { label: "Called by: TabStripModel", id: "cr-class" }] } },
  "cr-closetab": { title: "CloseTab()", icon: "code", url: "source.chromium.org/CloseTab", color: "#4285F4", content: { heading: "Method: CloseTab()", links: [{ label: "Handles: child tab cleanup", id: "cr-controller" }, { label: "Event: TabStripModelChange::kRemoved", id: "cr-enum" }] } },
  "cr-class": { title: "TabStripModel class", icon: "code", url: "source.chromium.org/TabStripModel-class", color: "#4285F4", content: { heading: "Class: TabStripModel", links: [{ label: "Members: tab_count_, active_index_", id: "cr-header" }, { label: "Method: AddTab()", id: "cr-addtab" }] } },
  "cr-enum": { title: "TabStripModelChange", icon: "code", url: "source.chromium.org/TabStripModelChange", color: "#4285F4", content: { heading: "Enum: TabStripModelChange", links: [{ label: "Values: kInserted, kRemoved, kMoved", id: "cr-header" }, { label: "Used by: TabStripController", id: "cr-closetab" }] } },
};

const ROOT_TAB_IDS = ["tab-1", "tab-2", "tab-3", "tab-4"];

export default function Prototype() {
  const [parentTabs, setParentTabs] = useState(ROOT_TAB_IDS);
  const [activeParent, setActiveParent] = useState("tab-1");
  const [parentPageStack, setParentPageStack] = useState({
    "tab-1": "tab-1", "tab-2": "tab-2", "tab-3": "tab-3", "tab-4": "tab-4",
  });
  const [childTabs, setChildTabs] = useState({});
  const [activeChild, setActiveChild] = useState({});
  const [childPageMap, setChildPageMap] = useState({});
  const [hasAnyChildren, setHasAnyChildren] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const parentRowRef = useRef(null);
  const parentTabRefs = useRef({});
  const childGroupRef = useRef(null);
  const childRowRef = useRef(null);
  const [childRowLeft, setChildRowLeft] = useState(8);

  useLayoutEffect(() => {
    const rowEl = parentRowRef.current;
    const tabEl = parentTabRefs.current[activeParent];
    const groupEl = childGroupRef.current;
    if (!rowEl || !tabEl) return;
    const rowRect = rowEl.getBoundingClientRect();
    const tabRect = tabEl.getBoundingClientRect();
    const tabCenter = tabRect.left + tabRect.width / 2 - rowRect.left;
    const containerWidth = rowRect.width;
    const padding = 8;
    if (!groupEl) { setChildRowLeft(Math.max(padding, tabCenter)); return; }
    const groupWidth = groupEl.scrollWidth;
    let idealLeft = tabCenter - groupWidth / 2;
    idealLeft = Math.max(padding, idealLeft);
    if (idealLeft + groupWidth > containerWidth - padding) {
      idealLeft = Math.max(padding, containerWidth - padding - groupWidth);
    }
    setChildRowLeft(idealLeft);
  }, [activeParent, parentTabs, childTabs]);

  useEffect(() => {
    setHasAnyChildren(Object.values(childTabs).some((arr) => arr.length > 0));
  }, [childTabs]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const handleNormalClick = useCallback((pageId) => {
    const cur = activeChild[activeParent];
    const children = childTabs[activeParent] || [];
    if (cur && children.includes(cur)) {
      setChildPageMap((p) => ({ ...p, [cur]: pageId }));
    } else {
      setParentPageStack((p) => ({ ...p, [activeParent]: pageId }));
    }
    showToast("Navigated in current tab");
  }, [activeParent, activeChild, childTabs, showToast]);

  const handleCmdClick = useCallback((pageId) => {
    const cur = activeChild[activeParent];
    const children = childTabs[activeParent] || [];
    if (cur && children.includes(cur)) {
      const childId = "child-" + pageId + "-" + Date.now();
      setChildTabs((p) => ({ ...p, [activeParent]: [...(p[activeParent] || []), childId] }));
      setActiveChild((p) => ({ ...p, [activeParent]: childId }));
      setChildPageMap((p) => ({ ...p, [childId]: pageId }));
      showToast("⌘ + Click → Opened as sibling child tab");
    } else {
      const newTabId = "dyn-" + pageId + "-" + Date.now();
      const idx = parentTabs.indexOf(activeParent);
      const newTabs = [...parentTabs];
      newTabs.splice(idx + 1, 0, newTabId);
      setParentTabs(newTabs);
      setParentPageStack((p) => ({ ...p, [newTabId]: pageId }));
      setActiveParent(newTabId);
      showToast("⌘ + Click → Opened as sibling parent tab");
    }
  }, [parentTabs, activeParent, activeChild, childTabs, showToast]);

  const handleChildClick = useCallback((pageId) => {
    const childId = "child-" + pageId + "-" + Date.now();
    setChildTabs((p) => ({ ...p, [activeParent]: [...(p[activeParent] || []), childId] }));
    setActiveChild((p) => ({ ...p, [activeParent]: childId }));
    setChildPageMap((p) => ({ ...p, [childId]: pageId }));
    showToast("⌘ + ⇧ + Click → Opened as child tab");
  }, [activeParent, showToast]);

  const handleLinkClick = useCallback((e, pageId) => {
    e.preventDefault();
    const isMeta = e.metaKey || e.ctrlKey;
    const isShift = e.shiftKey;
    const cur = activeChild[activeParent];
    const children = childTabs[activeParent] || [];
    const viewingChild = cur && children.includes(cur);
    if (isMeta && isShift && !viewingChild) { handleChildClick(pageId); }
    else if (isMeta) { handleCmdClick(pageId); }
    else { handleNormalClick(pageId); }
  }, [handleNormalClick, handleCmdClick, handleChildClick, activeChild, activeParent, childTabs]);

  const closeChildTab = useCallback((parentId, childId, e) => {
    e.stopPropagation();
    setChildTabs((p) => ({ ...p, [parentId]: (p[parentId] || []).filter((id) => id !== childId) }));
    setActiveChild((p) => {
      if (p[parentId] === childId) {
        const remaining = (childTabs[parentId] || []).filter((id) => id !== childId);
        return { ...p, [parentId]: remaining.length > 0 ? remaining[remaining.length - 1] : null };
      }
      return p;
    });
  }, [childTabs]);

  const closeParentTab = useCallback((parentId, e) => {
    e.stopPropagation();
    if (parentTabs.length <= 1) return;
    setParentTabs((p) => p.filter((id) => id !== parentId));
    setChildTabs((p) => { const u = { ...p }; delete u[parentId]; return u; });
    setActiveChild((p) => { const u = { ...p }; delete u[parentId]; return u; });
    if (activeParent === parentId) {
      const idx = parentTabs.indexOf(parentId);
      setActiveParent(parentTabs[idx > 0 ? idx - 1 : 1]);
    }
  }, [parentTabs, activeParent]);

  const currentChildren = childTabs[activeParent] || [];
  const currentActiveChild = activeChild[activeParent];
  const isViewingChild = currentActiveChild && currentChildren.includes(currentActiveChild);

  let activePage;
  if (isViewingChild) {
    activePage = MOCK_PAGES[childPageMap[currentActiveChild] || currentActiveChild];
  } else {
    activePage = MOCK_PAGES[parentPageStack[activeParent] || activeParent];
  }

  const getChildTabPage = (childId) => MOCK_PAGES[childPageMap[childId] || childId] || MOCK_PAGES[childId];
  const getParentTabPage = (parentId) => MOCK_PAGES[parentPageStack[parentId] || parentId] || MOCK_PAGES[parentId];
  const getParentColor = (parentId) => {
    if (!parentId.startsWith("dyn-") && MOCK_PAGES[parentId]) return MOCK_PAGES[parentId].color;
    return MOCK_PAGES[parentPageStack[parentId]]?.color || "#666";
  };

  const resetAll = () => {
    setParentTabs(ROOT_TAB_IDS);
    setActiveParent("tab-1");
    setParentPageStack({ "tab-1": "tab-1", "tab-2": "tab-2", "tab-3": "tab-3", "tab-4": "tab-4" });
    setChildTabs({});
    setActiveChild({});
    setChildPageMap({});
    setHasAnyChildren(false);
    setToast(null);
    showToast("Reset to initial state");
  };

  return (
    <div className={styles.outer}>
      <div className={styles.toastArea}>
        {toast && <div className={styles.toast}>{toast}</div>}
      </div>

      <div className={styles.shell}>
        {/* Title bar */}
        <div className={styles.titleBar}>
          <div className={styles.trafficLights}>
            <span className={styles.trafficDot} style={{ background: "#FF5F57" }} />
            <span className={styles.trafficDot} style={{ background: "#FEBC2E" }} />
            <span className={styles.trafficDot} style={{ background: "#28C840" }} />
          </div>
          <span className={styles.titleText}>MegaTabs — Prototype</span>
          <div style={{ width: 52 }} />
        </div>

        {/* Parent tab row */}
        <div className={styles.parentRow} ref={parentRowRef}>
          {parentTabs.map((id) => {
            const page = getParentTabPage(id);
            if (!page) return null;
            const isActive = id === activeParent;
            const hasChildren = (childTabs[id] || []).length > 0;
            return (
              <div
                key={id}
                ref={(el) => (parentTabRefs.current[id] = el)}
                onClick={() => setActiveParent(id)}
                className={`${styles.parentTab} ${isActive ? styles.active : ""}`}
              >
                <span className={styles.tabIcon}>{ICONS[page.icon]}</span>
                <span className={styles.tabTitle}>{page.title}</span>
                {hasChildren && (
                  <span className={styles.childIndicator} style={{ background: getParentColor(id) }} />
                )}
                {parentTabs.length > 1 && (
                  <button onClick={(e) => closeParentTab(id, e)} className={styles.closeBtn}>×</button>
                )}
                {isActive && hasChildren && <div className={styles.connectorNub} />}
              </div>
            );
          })}
          <button className={styles.newTabBtn}>+</button>
        </div>

        {/* Child tab row */}
        <div
          className={styles.childRowContainer}
          style={{
            height: hasAnyChildren ? 38 : 0,
            borderBottom: hasAnyChildren ? "1px solid #2a2a2a" : "none",
          }}
        >
          {currentChildren.length > 0 && (
            <div className={styles.childRow} ref={childRowRef}>
              <div
                ref={childGroupRef}
                className={styles.childGroup}
                style={{ marginLeft: childRowLeft }}
              >
                {currentChildren.map((childId) => {
                  const page = getChildTabPage(childId);
                  if (!page) return null;
                  const isActive = currentActiveChild === childId;
                  const parentColor = getParentColor(activeParent);
                  return (
                    <div
                      key={childId}
                      onClick={() => setActiveChild((p) => ({ ...p, [activeParent]: childId }))}
                      className={`${styles.childTab} ${isActive ? styles.active : ""}`}
                      style={{
                        borderTop: isActive ? `2px solid ${parentColor}` : `2px solid ${parentColor}44`,
                      }}
                    >
                      <span className={styles.childTabIcon}>{ICONS[page.icon]}</span>
                      <span className={styles.childTabTitle}>{page.title}</span>
                      <button onClick={(e) => closeChildTab(activeParent, childId, e)} className={styles.closeBtnSmall}>×</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {currentChildren.length === 0 && hasAnyChildren && (
            <div className={styles.emptyChildRow}>
              <span className={styles.emptyChildText}>No child tabs for this parent</span>
            </div>
          )}
        </div>

        {/* Address bar */}
        <div className={styles.addressBar}>
          <span className={styles.lockIcon}>🔒</span>
          <span className={styles.urlText}>{activePage?.url}</span>
        </div>

        {/* Viewport */}
        <div className={styles.viewport}>
          <div className={styles.pageContent}>
            <h1 className={styles.pageHeading}>{activePage?.content?.heading}</h1>

            {activePage?.content?.links?.length > 0 && (
              <div className={styles.linkList}>
                {activePage.content.links.map((link) => (
                  <div key={link.id} className={styles.linkItem}>
                    <a href="#" onClick={(e) => handleLinkClick(e, link.id)} className={styles.pageLink}>
                      {link.label}
                    </a>
                    <div className={styles.linkMeta}>
                      <div className={styles.actionRow}>
                        <span className={styles.actionLabel}>Click</span>
                        <span className={styles.actionDesc}>navigate here</span>
                      </div>
                      <div className={styles.actionRow}>
                        <span className={styles.kbdGroup}>
                          <kbd className={styles.kbd}>⌘</kbd>
                          <span className={styles.kbdPlus}>+</span>
                          <kbd className={styles.kbd}>Click</kbd>
                        </span>
                        <span className={styles.actionDesc}>
                          {isViewingChild ? "sibling child tab" : "sibling parent tab"}
                        </span>
                      </div>
                      {!isViewingChild && (
                        <div className={styles.actionRow}>
                          <span className={styles.kbdGroup}>
                            <kbd className={`${styles.kbd} ${styles.highlight}`}>⌘</kbd>
                            <span className={styles.kbdPlus}>+</span>
                            <kbd className={`${styles.kbd} ${styles.highlight}`}>⇧</kbd>
                            <span className={styles.kbdPlus}>+</span>
                            <kbd className={`${styles.kbd} ${styles.highlight}`}>Click</kbd>
                          </span>
                          <span className={`${styles.actionDesc} ${styles.highlight}`}>child tab ✦</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(!activePage?.content?.links || activePage.content.links.length === 0) && (
              <div className={styles.childPageContent}>
                <div className={styles.placeholderBlock} />
                <div className={styles.placeholderBlock} style={{ width: "85%" }} />
                <div className={styles.placeholderBlock} style={{ width: "70%" }} />
                <div className={styles.placeholderBlock} style={{ width: "40%", marginTop: 16 }} />
                <div className={styles.placeholderBlock} style={{ width: "90%" }} />
                <div className={styles.placeholderBlock} style={{ width: "75%" }} />
                <p className={styles.childPageNote}>This page has no outgoing links in the prototype.</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className={styles.instructions}>
          <div className={styles.instructionGrid}>
            <span className={styles.instructionKey}>Click</span>
            <span className={styles.instructionVal}>Navigate in current tab</span>
            <span className={styles.instructionKey}>
              <kbd className={styles.kbdInline}>⌘/Ctrl</kbd> + Click
            </span>
            <span className={styles.instructionVal}>Open as sibling tab (same row)</span>
            {!isViewingChild && (
              <>
                <span className={styles.instructionKey}>
                  <kbd className={styles.kbdInline}>⌘/Ctrl</kbd> + <kbd className={styles.kbdInline}>⇧</kbd> + Click
                </span>
                <span className={`${styles.instructionVal} ${styles.highlight}`}>
                  Open as child tab ✦ parent level only
                </span>
              </>
            )}
          </div>
          <div className={styles.contextBadge}>
            {isViewingChild ? "👁 Viewing: child tab" : "👁 Viewing: parent tab"}
          </div>
        </div>
      </div>

      <div className={styles.resetRow}>
        <button className={styles.resetBtn} onClick={resetAll}>↺ Reset prototype</button>
      </div>
    </div>
  );
}

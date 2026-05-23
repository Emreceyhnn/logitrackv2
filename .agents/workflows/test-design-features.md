---
description: Acts as a Lead UI/UX Designer. Opens a browser, sets viewport strictly to 1920x1080, logs in with test credentials, and audits the rendered UI. Analyzes layout, alignment, typography, and contrast. Scores visual integrity out of 100.
---

# Workflow: Enterprise UI/UX & Visual Render Auditor

## 🎯 Objective

The purpose of this workflow is to perform a visual and structural design audit of the rendered application. The Agent must act as a Lead UI/UX Designer and Frontend QA. Instead of just reading static source code, **you must use your browser/web-browsing capabilities** to visit the live local/staging URL, log into the application, and inspect the rendered DOM and CSS structures.

## ⚙️ Agent Operating Directives & Browser Automation Steps

You must execute the following steps in order before analyzing the design:

1. **Viewport Lock:** Configure your headless browser / viewport strictly to **1920x1080 resolution**. The entire UI was explicitly designed for this desktop layout.
2. **Authentication:** - Navigate to the application's login URL.
   - Locate the email/username input field and enter: `admin@atl.com`
   - Locate the password input field and enter: `3121283455Em!`
   - Submit the form and wait for the dashboard/authenticated area to fully load.
3. **Visual Inspection:** Once logged in, navigate through the main pages. Analyze the rendered CSS, layout alignment, spacing (margins/padding), typography scale, and color contrast.

---

## 🔍 Deep Audit Criteria & Design Violations

Start evaluating the rendered views with a perfect score of **100 points**. Deduct points based on the severity of the UI/UX flaws found below.

### Category 1: Layout & Grid Integrity (1920x1080 Focus)

- **[ -20 Points ] Overflow & Clipping:** Elements (text, images, containers) spilling out of their parent containers or causing unintended horizontal scrolling at 1920px width.
- **[ -15 Points ] Misalignment:** Elements that are supposed to be aligned (e.g., table columns, form inputs, navigation items) but are visibly off-center or breaking the grid system.
- **[ -10 Points ] Wasted Whitespace:** Massive, unintended empty gaps on a 1920x1080 screen because containers do not have proper `max-width` constraints or flex/grid behaviors.

### Category 2: Typography & Readability

- **[ -15 Points ] Broken Hierarchy:** Missing visual distinction between Headings (H1, H2) and Body text (e.g., everything looks the same size or weight).
- **[ -10 Points ] Illegible Text:** Font sizes smaller than `12px` or line heights (leading) that make paragraphs dense and hard to read.
- **[ -5 Points ] Truncation Issues:** Text that gets cut off without proper text-overflow handling (e.g., missing ellipsis `...` on long logistics tracking numbers).

### Category 3: Color, Contrast & Interactive States

- **[ -20 Points ] Accessibility (WCAG) Contrast Failure:** Gray text on a gray background, or white text on a light primary color, making it impossible to read.
- **[ -10 Points ] Missing Interactive Feedback:** Buttons, links, or table rows that lack `:hover`, `:focus`, or `:active` CSS states, leaving the user unsure if the element is clickable.
- **[ -10 Points ] Inconsistent Theming:** Mixing completely different color palettes (e.g., using 5 different shades of blue for primary buttons) instead of CSS variables/Tailwind utility classes.

### Category 4: Component Polish

- **[ -10 Points ] Distorted Media:** Images or icons that appear stretched or squashed because they lack `object-fit: cover/contain` or proper aspect ratios.
- **[ -10 Points ] Spacing Inconsistency:** Failing to use a consistent spacing system (like a 4px/8px grid). E.g., one card has `15px` padding, another has `23px`.

---

## 📊 Standardized Reporting Format

Compile your visual findings and output the report **using strictly the following Markdown structure**.

### 🎨 ENTERPRISE UI/UX & VISUAL DESIGN REPORT

**Target Viewport:** `1920x1080` (Desktop)
**Authentication Status:** `[Success / Failed to login]`
**Date:** `[Current Date]`

#### 🏆 Visual Integrity Score

- **Overall UI Score:** `[Average Score] / 100`
- **Pages/Views Audited:** `[List of URLs or Routes checked]`
- **Design Status:** `[Pixel Perfect | Minor Polish Needed | UI is Broken]`

---

#### 🚨 CRITICAL RENDER ISSUES (1920x1080)

_(List massive visual bugs that break the layout at this specific resolution, like overlapping containers or broken grids.)_

- **[Issue Title]:** [Detailed explanation of what looks broken on the screen]
  - **CSS/DOM Solution:** `[e.g., Add overflow-hidden, or change width to w-full max-w-7xl]`

---

#### 📄 VIEW-BY-VIEW VISUAL BREAKDOWN

_(Agent: Detail the specific routes or components audited.)_

**👁️ View: `[Page URL or Component Name - e.g., /dashboard/shipments]` | Score: `[Score]/100`**

- **🔴 Layout Flaws (-15 & -20 Points):**
  - Target Element `[e.g., Main Navigation Bar]`: [Issue, e.g., Collapsing on itself] -> **Fix:** [Use flex-shrink-0]
- **🟡 Typography & Contrast Warnings (-5 & -10 Points):**
  - Target Element `[e.g., Status Badge]`: [Issue, e.g., White text on yellow is unreadable] -> **Fix:** [Change text color to slate-900]
- **🟢 Beautiful Details:**
  - [Highlight a UI component that looks exceptionally well-designed and polished]

_(Repeat this block for every problematic view...)_

---

#### 🚀 TOP 3 FRONTEND DESIGN PRIORITIES

List the top 3 CSS or structural tasks the frontend developer must implement immediately to fix the UI:

1. **[Priority 1: E.g., Fix the horizontal scrolling issue on the Dashboard caused by the wide table]**
2. **[Priority 2: E.g., Standardize the padding across all Cards to use p-6 (24px) for consistency]**
3. **[Priority 3: E.g., Add visible :hover states to all action buttons in the logistics forms]**

---

_This report was automatically generated by the Antigravity IDE UI/UX Agent._

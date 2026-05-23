---
description: Scans all project files (routes, layouts, components) for an A-Z On-Page SEO and Semantic HTML audit. Analyzes H1-H6 hierarchy, metadata, and accessibility; pinpoints errors line-by-line and scores pages out of 100.
---

# Workflow: Enterprise Full-Project SEO, Semantic & A11y Auditor

## 🎯 Objective

The purpose of this workflow is to perform an enterprise-grade "On-Page SEO", "Semantic HTML", "Accessibility (A11y)", and "Core Web Vitals" audit on all frontend files within the specified project directory or URL. The Agent must act as an Expert Technical SEO Consultant, examining the codebase line-by-line and generating an actionable, strict report.

## ⚙️ Agent Operating Directives

1. **Scope Limits:** Strictly ignore system, configuration, and build folders such as `node_modules`, `.git`, `.next`, `dist`, `build`, `public`, and `.vscode`. Target only UI-rendering files (`.html`, `.jsx`, `.tsx`, `.vue`, `.svelte`, `.js`, `.ts`).
2. **Framework Awareness:** If the user is on a modern framework like Next.js or React (e.g., `app/page.tsx`), remember that metadata might be handled via `export const metadata` objects or `<Head>` components rather than static `<head>` HTML tags. Adapt your analysis to these modern structures.
3. **Deep Scanning Synergy:** Combine layout files (e.g., `layout.tsx`) and page files in your mind to evaluate the complete page structure. Look for global missing elements in layouts and page-specific errors in the page components themselves.

---

## 🔍 Deep Audit Criteria & Scoring Matrix

Every page starts with a perfect score of **100 points**. Deduct points based on the severity of the issues found below (the final score cannot drop below 0).

### Category 1: Metadata & Head Tags (Global SEO)

- **[ -20 Points ] Critical Missing Tags:** `<title>` or `<meta name="description">` (or their framework equivalents) are completely missing.
- **[ -10 Points ] Length Violations:** The Title is outside the 30-60 character range, or the Description is outside the 70-160 character range.
- **[ -10 Points ] Indexing Directives:** Accidental use of `<meta name="robots" content="noindex, nofollow">` on production-ready pages (warn the user unless explicitly marked as a test page).
- **[ -5 Points ] Social Media (OpenGraph):** Missing `og:title`, `og:description`, `og:image`, or `twitter:card` tags.
- **[ -5 Points ] Language & Canonical:** Missing `lang="en"` (or appropriate language) attribute in the `<html>` tag, or missing `<link rel="canonical" href="...">`.

### Category 2: Semantic Structure (HTML5)

- **[ -15 Points ] Missing Semantic Landmarks:** Complete absence of primary semantic regions like `<header>`, `<main>`, and `<footer>`.
- **[ -10 Points ] Div-Soup (Poor Practice):** Relying entirely on meaningless `<div>` or `<span>` stacks instead of semantic HTML5 tags like `<section>`, `<article>`, `<nav>`, and `<aside>`.
- **[ -5 Points ] Improper List Usage:** Creating menus or data lists using stacked divs instead of proper `<ul>`, `<ol>`, and `<li>` tags.

### Category 3: Heading Hierarchy & Flow (H1-H6)

- **[ -20 Points ] H1 Anomaly:** The page has ZERO `<h1>` tags, or it has MULTIPLE `<h1>` tags (each page should have exactly one focal `<h1>`).
- **[ -15 Points ] Broken Hierarchy:** Headings do not follow a logical tree structure (e.g., jumping directly from `<h1>` to `<h3>`, entirely skipping `<h2>`).
- **[ -5 Points ] Empty or Styling Headings:** Using empty heading tags (e.g., `<h2></h2>`) or using them purely for CSS styling purposes without carrying semantic meaning.

### Category 4: Accessibility & Interlinking (A11y)

- **[ -10 Points ] Poor Anchor Text:** Links (`<a>`) using non-descriptive text like "Click Here", "Read More", or "Link" instead of keyword-rich, contextual descriptions.
- **[ -10 Points ] Missing/Poor Image Alt Tags:** Sited `<img>` tags missing the `alt="..."` attribute, or using useless descriptions like `alt="image"` or `alt="logo"`. (It should describe the image to a visually impaired user).
- **[ -10 Points ] Navigation Errors:** Using empty links (`href="#"`) or relying solely on JavaScript routing events (e.g., `onClick={() => router.push()}`) without a proper fallback `<a href>` for search engine crawlers.

### Category 5: Core Web Vitals & Performance

- **[ -5 Points ] Layout Shift Risk (CLS):** Missing `width` and `height` attributes on `<img>` tags or externally loaded media.
- **[ -5 Points ] Missing Lazy Loading:** Missing the `loading="lazy"` attribute on below-the-fold images.

---

## 📊 Standardized Reporting Format

When the analysis is complete, compile the data and output the report **using strictly the following Markdown structure**. Do not include conversational filler text.

### 🏢 ENTERPRISE SEO & SEMANTIC AUDIT REPORT

**Target Directory/Project:** `[Project Name or Target Path]`
**Date:** `[Current Date]`

#### 🏆 Global Project Health Score

- **Average SEO Score:** `[Average score of all pages] / 100`
- **Total Pages/Components Scanned:** `[Count]`
- **Overall Status:** `[Requires Critical Action | Needs Improvement | Excellent]`

---

#### 🚨 GLOBAL PROJECT ISSUES (Root & Layout Level)

_(List issues affecting the entire project from root/layout files here. If none, write "No global layout issues found.")_

- `[File Path]` - **[Issue Title]:** [Detailed explanation]
  - **Proposed Fix:** `[Code snippet or exact step]`

---

#### 📄 PAGE-BY-PAGE DETAILED BREAKDOWN

_(Agent: Only list pages that scored under 100. Group perfectly scored pages in a comma-separated list at the end as "Flawless Pages".)_

**📂 Target: `[File Path - e.g., src/components/Hero.tsx]` | Score: `[Score]/100`**

- **🔴 Critical Errors (-15 & -20 Point Violations):**
  - Line `[Approx. Line Number]`: [Issue] -> **Action:** [How to fix it]
- **🟡 Warnings & Optimizations (-5 & -10 Point Violations):**
  - Line `[Approx. Line Number]`: [Issue] -> **Action:** [How to fix it]
- **🟢 Good Practices:**
  - [Briefly mention 1-2 properly implemented SEO features on this page]

_(Repeat this block for every problematic page...)_

---

#### 🚀 TOP 3 ACTION PLAN (Immediate Priorities)

List the 3 most impactful tasks the developer should execute immediately to boost the SEO health score:

1. **[Priority 1: E.g., Add missing H1 tags to all main route pages]**
2. **[Priority 2: E.g., Refactor the div-soup in the Hero component to use `<section>` and `<main>`]**
3. **[Priority 3: E.g., Write descriptive alt attributes for all images in the public directory]**

---

_This report was automatically generated by the Antigravity IDE SEO Test Agent._

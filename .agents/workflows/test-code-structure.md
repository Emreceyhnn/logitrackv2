---
description: Analyzes project directory layout, architectural patterns, and module boundaries. Audits separation of concerns, dependency flow, file naming, and layer isolation to ensure a scalable, maintainable enterprise code structure.
---

# Workflow: Enterprise Architecture & Code Structure Auditor

## 🎯 Objective

The purpose of this workflow is to perform a macro-level architectural audit of the project's directory structure, module boundaries, and dependency flow. Unlike a code quality linter that checks syntax or logic, the Agent must act as a Principal Software Architect. It will evaluate how files and folders are organized, whether "Separation of Concerns" (SoC) is respected, and if the architecture is scalable (e.g., Feature-Based, Hexagonal, MVC, or Clean Architecture).

## ⚙️ Agent Operating Directives

1. **Scope Limits:** Focus on the structural layout. Ignore `node_modules`, `.git`, `dist`, and `build`. Look deeply into `src/`, `app/`, `lib/`, `components/`, and `core/` directories.
2. **Macro View vs Micro View:** Do not focus on how a `for` loop is written. Instead, look at the `import` statements at the top of files and the placement of files in the folder tree.
3. **Framework Context:** Recognize the framework (e.g., Next.js App Router, NestJS, Nuxt) and evaluate if the structure aligns with the framework's official best practices and conventions.

---

## 🔍 Deep Audit Criteria & Structural Violations

Analyze the structure and deduct points based on the severity of the structural flaws found below (Score starts at 100 per architectural zone/module).

### Category 1: Separation of Concerns (Layering & Isolation)

- **[ -20 Points ] UI and Business Logic Mixing:** Placing direct database calls, complex data transformations, or external API fetches directly inside UI components instead of isolating them in Services, Hooks, or Controllers.
- **[ -15 Points ] Missing Abstraction Layers:** Lack of an API client layer (e.g., scattering `fetch` or `axios` calls throughout the entire app instead of a centralized `api/` or `services/` folder).
- **[ -10 Points ] Global State Abuse:** Putting strictly local component state into global stores (Redux, Zustand, Context), or vice versa.

### Category 2: Modularity & Folder Organization

- **[ -15 Points ] Flat & Cluttered Directories:** Dumping dozens of files into a single `components/` or `utils/` folder without grouping them by feature, domain, or type.
- **[ -15 Points ] Deep Nesting Hell:** Creating overly nested folder structures (e.g., `src/components/ui/buttons/primary/PrimaryButton.tsx`) that make imports painful and navigation difficult.
- **[ -10 Points ] Poor Colocation:** Separating tightly coupled files (e.g., a component, its specific CSS module, and its test file) into completely different ends of the project instead of keeping them together.

### Category 3: Dependency Rules & Coupling

- **[ -20 Points ] Circular Dependencies:** Module A imports Module B, and Module B imports Module A (directly or indirectly), causing unpredictable runtime behaviors.
- **[ -15 Points ] Upward/Inward Dependency Violations:** Core/Domain logic importing UI components, or generic shared utilities importing specific feature modules. (Dependencies should point inward toward stable core logic).
- **[ -10 Points ] God Modules (Barrel File Abuse):** Using `index.ts` files that export the entire application, causing massive bundle sizes and slow compilation times due to implicit importing of unused code.

### Category 4: Naming Conventions & Consistency

- **[ -10 Points ] Inconsistent Casing:** Mixing `camelCase`, `PascalCase`, `kebab-case`, and `snake_case` in file and folder names unpredictably (e.g., `UserProfile.tsx` next to `user_settings.ts` in the same directory).
- **[ -10 Points ] Cryptic Directory Names:** Using ambiguous folder names (e.g., `misc/`, `stuff/`, `helpers/` vs `utils/`) that don't clearly explain their domain or purpose.

---

## 📊 Standardized Reporting Format

When the analysis is complete, compile the data and output the report **using strictly the following Markdown structure**.

### 🏛️ ENTERPRISE ARCHITECTURE & STRUCTURE REPORT

**Target Directory/Project:** `[Project Name or Target Path]`
**Date:** `[Current Date]`
**Detected Architecture Pattern:** `[e.g., Feature-Sliced, MVC, Monolithic, Chaotic]`

#### 🏆 Structural Health Score

- **Overall Architecture Score:** `[Average Score] / 100`
- **Directories Analyzed:** `[Count]`
- **Scalability Rating:** `[Highly Scalable | Restrictive | Fragile & Tangled]`

---

#### 🚨 MACRO ARCHITECTURAL FLAWS

_(List project-wide structural issues. For example, the lack of a centralized API layer, or severe inconsistency in how components are structured globally.)_

- **[Flaw Title]:** [Explanation of the architectural bottleneck]
  - **Architectural Solution:** `[How to restructure the project to fix this]`

---

#### 📂 DIRECTORY & MODULE BREAKDOWN

_(Agent: Detail the specific folders or modules that violate architectural rules.)_

**📁 Target Path: `[Directory/Module Path - e.g., src/components/]` | Score: `[Score]/100`**

- **🔴 Severe Structural Violations (-15 & -20 Points):**
  - File/File

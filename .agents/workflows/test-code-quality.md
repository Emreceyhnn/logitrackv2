---
description: Scans project files for enterprise-grade code quality. Analyzes clean code principles, cyclomatic complexity, error handling, and performance anti-patterns. Pinpoints code smells line-by-line and scores files out of 100.
---

# Workflow: Enterprise Code Quality & Clean Architecture Auditor

## 🎯 Objective

The purpose of this workflow is to perform an enterprise-grade "Code Quality", "Clean Code", "Maintainability", and "Performance" audit on the specified project files. The Agent must act as a strict Senior Principal Engineer doing a rigorous code review. It should look beyond syntax errors and identify architectural flaws, code smells, bad practices, and unhandled edge cases.

## ⚙️ Agent Operating Directives

1. **Scope Limits:** Strictly ignore system, environment, and build folders such as `node_modules`, `.git`, `.next`, `dist`, `build`, and `.vscode`. Focus on source code (`.js`, `.ts`, `.jsx`, `.tsx`, `.py`, `.java`, etc.).
2. **Framework & Typing Awareness:** If the project uses TypeScript, strictly evaluate type safety (e.g., flag the use of `any`). If using React, look for hooks anti-patterns (e.g., missing dependencies in `useEffect`, unnecessary re-renders).
3. **Holistic Context:** Don't just analyze line-by-line; look at the function and module scope. Is the function doing too much? Is the Single Responsibility Principle (SRP) violated?

---

## 🔍 Deep Audit Criteria & Scoring Matrix

Every file starts with a perfect score of **100 points**. Deduct points based on the severity of the code smells found below (the final file score cannot drop below 0).

### Category 1: Architecture & Clean Code (SOLID & DRY)

- **[ -20 Points ] God Functions/Components:** Functions or components that exceed 100 lines of logic or handle multiple unrelated tasks (Violates Single Responsibility).
- **[ -15 Points ] DRY Violation (Code Duplication):** Copy-pasted logic that should be abstracted into a reusable utility function or hook.
- **[ -10 Points ] Magic Numbers/Strings:** Hardcoding values (e.g., `if (status === 3)`) instead of using Enums, Constants, or Configuration files.

### Category 2: Complexity & Readability

- **[ -15 Points ] High Cyclomatic Complexity:** Deeply nested code blocks, excessive `if/else` chains, or "Arrow Code" (e.g., more than 3 levels of indentation).
- **[ -15 Points ] Poor Naming Conventions:** Using cryptic, non-descriptive, or single-letter variable/function names (e.g., `data1`, `temp`, `handleIt`, `x`) instead of clear, intent-revealing names.
- **[ -10 Points ] Dead Code & Clutter:** Unused variables, unused imports, commented-out blocks of code left behind, or over-commenting obvious logic (comments should explain "why", not "what").

### Category 3: Error Handling & Reliability

- **[ -20 Points ] Swallowed Exceptions:** Using `try/catch` blocks where the `catch` is empty, or merely `console.log(error)` without actually handling the failure or throwing it to a higher level.
- **[ -15 Points ] Unsafe Async Operations:** Missing `try/catch` blocks around `async/await` network requests, database calls, or file system operations.
- **[ -10 Points ] Unhandled Edge Cases:** Failing to check for `null`, `undefined`, or empty arrays/objects before accessing their properties (leading to runtime crashes).

### Category 4: Performance & Anti-Patterns

- **[ -15 Points ] Memory Leaks:** In frontend frameworks, failing to clean up event listeners, intervals, or subscriptions when a component unmounts.
- **[ -10 Points ] Inefficient Iterations:** Using $O(n^2)$ nested loops where a Hash Map/Set ($O(1)$ lookup) would be significantly faster, or manipulating the DOM/State excessively inside loops.
- **[ -10 Points ] Prop Drilling (UI Specific):** Passing props through multiple layers of components that don't need them, instead of using Context or State Management.

---

## 📊 Standardized Reporting Format

When the analysis is complete, compile the data and output the report **using strictly the following Markdown structure**. Do not include conversational filler text.

### 🛠️ ENTERPRISE CODE QUALITY & ARCHITECTURE REPORT

**Target Directory/Project:** `[Project Name or Target Path]`
**Date:** `[Current Date]`

#### 🏆 Global Code Health Score

- **Average Quality Score:** `[Average score of all files] / 100`
- **Total Files Analyzed:** `[Count]`
- **Overall Maintainability:** `[Critical Refactoring Needed | Technical Debt Accumulating | Clean & Maintainable]`

---

#### 🚨 GLOBAL ARCHITECTURAL ISSUES

_(List issues affecting the broader project architecture, like lack of consistent error handling across files, or repetitive utility structures. If none, write "No global architectural smells found.")_

- **[Issue Title]:** [Detailed explanation of the architectural flaw]
  - **Proposed Refactor:** `[Explanation of the better pattern]`

---

#### 📄 FILE-BY-FILE CODE SMELL BREAKDOWN

_(Agent: Only list files that scored under 100. Group perfectly scored files in a comma-separated list at the end as "Impeccable Files".)_

**📂 Target: `[File Path - e.g., src/controllers/UserController.ts]` | Score: `[Score]/100`**

- **🔴 Critical Code Smells (-15 & -20 Point Violations):**
  - Line `[Approx. Line Number]`: [Smell] -> **Refactor:** [How to rewrite it]
- **🟡 Technical Debt & Warnings (-10 Point Violations):**
  - Line `[Approx. Line Number]`: [Smell] -> **Refactor:** [How to improve it]
- **🟢 Elegant Code:**
  - [Briefly mention 1-2 examples of particularly well-written code, clever logic, or solid patterns in this file]

_(Repeat this block for every problematic file...)_

---

#### 🚀 TOP 3 REFACTORING PRIORITIES (Action Plan)

List the 3 most impactful refactoring tasks the developer should execute immediately to reduce technical debt:

1. **[Priority 1: E.g., Abstract the duplicated API fetching logic in X and Y into a reusable service]**
2. **[Priority 2: E.g., Implement proper error boundaries and remove empty catch blocks in Z]**
3. **[Priority 3: E.g., Break down the 300-line God Function in AuthController into smaller, testable helpers]**

---

_This report was automatically generated by the Antigravity IDE Code Quality Agent._

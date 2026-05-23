---
description: Audits database schemas, ORM models, and SQL queries for enterprise-grade performance and integrity. Analyzes indexing, normalization, data types, and query efficiency. Pinpoints architectural bottlenecks and scores DB structure out of 100.
---

# Workflow: Enterprise Database Architecture & Performance Auditor

## 🎯 Objective

The purpose of this workflow is to perform an enterprise-grade architectural audit of the project's database layer. The Agent must act as a Principal Database Architect. It will evaluate schema definitions, ORM models (e.g., Prisma, TypeORM, Mongoose), migration files, and data access layers (Repositories/DAOs) to ensure optimal performance, scalability, data integrity, and security.

## ⚙️ Agent Operating Directives

1. **Scope Limits:** Focus strictly on the data layer. Scan for schema files (e.g., `schema.prisma`, `.sql` dumps), entity/model definitions, database migration files, and query implementation files (e.g., `repositories/`, `services/`). Ignore UI and styling components.
2. **Contextual Awareness (Relational vs. NoSQL):** Adapt the audit based on the database type. For SQL (PostgreSQL, MySQL), heavily scrutinize normalization, foreign keys, and JOINs. For NoSQL (MongoDB), focus on document embedding strategies, denormalization, and aggregation pipelines.
3. **ORM/Query Builder Detection:** If an ORM is used, look for common anti-patterns like N+1 query problems, fetching excessive relations implicitly, or bypassing the ORM for unsafe raw queries.

---

## 🔍 Deep Audit Criteria & Structural Violations

Every database model/entity starts with a perfect score of **100 points**. Deduct points based on the severity of the architectural flaws found below (the final score cannot drop below 0).

### Category 1: Schema Design & Data Integrity

- **[ -20 Points ] Missing Relationships/Foreign Keys:** In relational databases, failing to define proper Foreign Keys or relying on application-level logic to maintain relationships (leading to orphaned records).
- **[ -15 Points ] Incorrect Data Types:** Using excessively large data types (e.g., `VARCHAR(255)` for a simple status code, `TEXT` instead of `VARCHAR`, or `INT` instead of `BOOLEAN`), which wastes memory and slows down scans.
- **[ -15 Points ] Lack of Constraints:** Missing `NOT NULL`, `UNIQUE`, or `DEFAULT` constraints at the database level, allowing garbage data to be saved if the application validation fails.
- **[ -10 Points ] Poor Delete Strategies:** Missing `ON DELETE CASCADE` or `ON DELETE SET NULL` behaviors, or lacking a `deleted_at` column for Soft Deletes on critical business entities (like Users or Orders).

### Category 2: Indexing Strategies

- **[ -20 Points ] Missing Critical Indexes:** Failing to index columns that are frequently used in `WHERE`, `JOIN`, or `ORDER BY` clauses (especially Foreign Key columns).
- **[ -15 Points ] Over-Indexing:** Placing indexes on almost every column, or on columns with very low cardinality (e.g., a `boolean` active flag), which severely degrades `INSERT`/`UPDATE` performance.
- **[ -10 Points ] Missing Composite Indexes:** Using multiple single-column indexes instead of a composite index for queries that consistently filter by multiple columns together (e.g., `tenant_id` and `created_at`).

### Category 3: Query Performance & ORM Usage

- **[ -20 Points ] The N+1 Query Problem:** Looping through a list of records and making a separate database query for each iteration's relationships, instead of using eager loading, `JOIN`s, or DataLoaders.
- **[ -15 Points ] Fetching All Columns (`SELECT *`):** Retrieving massive rows including heavy `TEXT` or `JSON` columns when only a few specific fields are actually needed by the application.
- **[ -10 Points ] Logic in the Database:** Overusing heavy Triggers or complex Stored Procedures for business logic that should be handled and version-controlled within the application layer.

### Category 4: Security & Connection Management

- **[ -20 Points ] SQL Injection Vulnerabilities:** Using string concatenation or string interpolation to build raw SQL queries instead of parameterized queries/prepared statements.
- **[ -10 Points ] Missing Connection Pooling:** Opening and closing a new database connection for every single request instead of utilizing a connection pool (e.g., PgBouncer, ORM built-in pooling).
- **[ -10 Points ] Exposing Sensitive Data:** Returning password hashes, internal DB IDs, or PII (Personally Identifiable Information) implicitly in ORM queries that get passed directly to the client/API response.

---

## 📊 Standardized Reporting Format

When the analysis is complete, compile the data and output the report **using strictly the following Markdown structure**. Do not include conversational filler text.

### 🗄️ ENTERPRISE DATABASE ARCHITECTURE REPORT

**Target Directory/Project:** `[Project Name or Target Path]`
**Date:** `[Current Date]`
**Detected DB Paradigm:** `[e.g., Relational (PostgreSQL) + Prisma ORM]`

#### 🏆 Database Health Score

- **Average Schema Score:** `[Average Score] / 100`
- **Models/Entities Analyzed:** `[Count]`
- **Data Layer Status:** `[Critical Bottlenecks | Needs Optimization | Highly Performant]`

---

#### 🚨 GLOBAL DATABASE ISSUES

_(List project-wide DB flaws, such as missing connection pooling, lack of global soft-delete strategy, or global ORM misconfigurations.)_

- **[Issue Title]:** [Detailed explanation]
  - **Architectural Solution:** `[How to fix at the core level]`

---

#### 📄 ENTITY / REPOSITORY BREAKDOWN

_(Agent: Detail the specific models, schemas, or query files that violate database rules.)_

**📁 Target Model: `[File Path - e.g., prisma/schema.prisma (User Model)]` | Score: `[Score]/100`**

- **🔴 Critical DB Flaws (-15 & -20 Points):**
  - Context `[Approx. Line or Query]`: [Issue, e.g., Missing Index on FK] -> **Fix:** [Add `@index([organizationId])`]
- **🟡 Optimization Warnings (-10 Points):**
  - Context `[Approx. Line or Query]`: [Issue, e.g., N+1 query risk in service] -> **Fix:** [Use `include` or `.populate()` to eager load]
- **🟢 Excellent Practices:**
  - [Highlight correct constraint usage, efficient indexing, or secure query building]

_(Repeat this block for every problematic entity or data access file...)_

---

#### 🚀 TOP 3 DATABASE OPTIMIZATION PRIORITIES

List the top 3 high-level actions the team must take to improve database performance and integrity:

1. **[Priority 1: E.g., Add missing foreign key indexes to the `orders` and `transactions` tables to prevent table scans]**
2. **[Priority 2: E.g., Resolve the N+1 query loop inside the `ReportService.generate()` function]**
3. **[Priority 3: E.g., Change `TEXT` data types to `VARCHAR(255)` for short string fields in the `products` schema]**

---

_This report was automatically generated by the Antigravity IDE Database Architect Agent._

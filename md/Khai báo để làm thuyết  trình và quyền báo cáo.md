# iFinance Graduation Thesis Report and Presentation Package

Author: Bế Văn Duy  
Project: iFinance - Personal Finance Management and Intelligent Analytics System  
Language: English  
Target Report Length: Approximately 50 pages  
Structure: 3 Chapters  

---

## Abstract

Personal finance management is a critical skill in modern life, yet many individuals still struggle to maintain clear records of income and expenses, evaluate spending patterns, and make data-driven financial decisions. Traditional approaches based on manual bookkeeping or simple spreadsheets are often inconsistent, error-prone, and difficult to scale. This thesis presents the design and implementation of iFinance, a practical personal finance management system that combines transaction tracking, category-based budgeting, reporting dashboards, and intelligent analytics in one unified platform.

The project follows a full software engineering lifecycle that includes requirement elicitation, system analysis, architecture design, database modeling, backend and frontend development, testing, and performance evaluation. The solution is implemented with a modular architecture that separates API routes, business services, middleware, and data models to improve maintainability and scalability. Key features include secure user authentication, transaction CRUD operations, category and rule management, monthly and period-based reports, anomaly detection support, audit logging, and backup/restore mechanisms.

Experimental validation and demo scenarios indicate that the system can effectively support daily financial tracking and improve users' awareness of spending behavior. The report also discusses implementation constraints and proposes future improvements such as predictive forecasting, banking API integration, and advanced recommendation models.

Keywords: personal finance, expense tracking, software architecture, database design, analytics, full-stack development.

---

## Table of Contents

- Abstract  
- Chapter 1. Introduction, Objectives, and Technology Survey  
- Chapter 2. System Analysis and Design  
- Chapter 3. Implementation, Demonstration, and Evaluation  
- Conclusion  
- References  
- Appendices  

---

# Chapter 1. Introduction, Objectives, and Technology Survey

## 1.1 Background

Financial literacy and spending discipline are important factors that influence long-term personal stability. Despite increased access to digital services, many users still manage their income and expenses with fragmented tools such as notes, spreadsheets, messaging screenshots, and manual receipts. As a result, they often face several practical problems:

1. They cannot consistently track where money is spent.
2. They cannot quickly classify essential and non-essential expenses.
3. They have no clear monthly budget control mechanism.
4. They receive delayed feedback on abnormal spending behavior.
5. They struggle to transform raw transaction logs into actionable insights.

In recent years, software-based personal finance solutions have become more common. However, many existing products focus on basic transaction storage and charts, without offering flexible customization, local deployment options, and transparent architecture suitable for learning and academic evaluation. This creates an opportunity to build a system that is both practically useful and academically meaningful.

iFinance is developed to address this gap. The system aims to provide a complete and realistic workflow for personal financial management, from data entry to analysis and decision support.

## 1.2 Problem Statement

The core problem addressed by this thesis is the lack of an integrated and user-friendly platform for individual financial management that can combine:

- reliable transaction recording,
- structured categorization,
- intelligent pattern analysis,
- report generation,
- and secure data handling.

From a software engineering perspective, the problem can be redefined as follows: design and implement a modular system that supports financial operation management while maintaining data integrity, usability, maintainability, and extensibility.

## 1.3 Thesis Objectives

### 1.3.1 General Objective

To design and implement a full-stack personal finance management system that helps users monitor income and expenses, evaluate spending behavior, and produce meaningful analytical reports.

### 1.3.2 Specific Objectives

1. Build a secure authentication and authorization module for user access control.
2. Implement transaction management with create, read, update, and delete operations.
3. Provide category and rule-based classification mechanisms for financial records.
4. Develop dashboards and period-based reports for financial insights.
5. Integrate anomaly detection and AI-assisted analysis services.
6. Support system reliability through backup and restore features.
7. Validate correctness through functional testing and scenario-based demonstrations.

### 1.3.3 Non-Functional Objectives

- Ensure system response remains acceptable for normal personal-use workloads.
- Maintain modular code structure for future enhancement.
- Protect user data with authentication checks and input validation.
- Offer a clean and intuitive interface for daily use.

## 1.4 Scope and Limitations

### 1.4.1 Project Scope

This project includes:

- User authentication and session/token-based access.
- Transaction management for income and expense records.
- Category management and customizable rules.
- Dashboard metrics and report pages.
- Basic anomaly detection and AI analytics support.
- Backup and restore operations.
- Audit log tracking for key actions.

### 1.4.2 Out-of-Scope Items

- Direct real-time banking API synchronization.
- Enterprise accounting standards (double-entry corporate accounting).
- Multi-tenant large-scale cloud deployment.
- Advanced tax compliance across multiple legal jurisdictions.

### 1.4.3 Limitations

- The quality of analytics depends on data completeness and consistency.
- AI recommendations are advisory, not guaranteed financial decisions.
- Performance evaluation is performed on project-scale datasets, not massive production datasets.

## 1.5 Scientific and Practical Significance

### 1.5.1 Scientific Contribution

This thesis contributes an end-to-end case study in software engineering, demonstrating how to transform a practical societal need into a complete system lifecycle:

- requirement analysis,
- architecture and data modeling,
- module-based implementation,
- testing and evaluation.

It also demonstrates integration of rule-based logic with lightweight intelligent services in a personal finance context.

### 1.5.2 Practical Contribution

The final product supports day-to-day finance control for individual users, helping them:

- understand spending patterns,
- identify unusual expenses,
- manage categories and budgets more effectively,
- generate reports for monthly review and planning.

## 1.6 Research and Development Methodology

The project applies an iterative and incremental process:

1. Requirement collection through practical use cases.
2. Analysis and decomposition into modules.
3. Design of architecture, database schema, and service contracts.
4. Implementation by backend/frontend module priorities.
5. Functional testing and bug fixing.
6. Demo evaluation and final documentation.

This approach allows fast feedback and controlled refinement while preserving overall architecture consistency.

## 1.7 Technology Survey and Selection

### 1.7.1 Backend Framework Options

#### Node.js + Express
- Strengths: lightweight, huge ecosystem, easy REST API development, rich middleware support.
- Weaknesses: asynchronous complexity in large codebases if not structured.

#### Fastify
- Strengths: high performance, schema-first options.
- Weaknesses: smaller ecosystem and learning adaptation.

#### Django (Python)
- Strengths: batteries included, mature admin and ORM.
- Weaknesses: heavier for this project style, less aligned with current project stack.

Decision: Node.js + Express was selected due to ecosystem maturity and suitable structure for modular REST services.

### 1.7.2 Database Options

#### SQLite
- Strengths: simple deployment, file-based storage, ideal for local personal software.
- Weaknesses: limited concurrent write scalability.

#### PostgreSQL
- Strengths: robust relational capabilities, strong indexing and concurrency.
- Weaknesses: extra setup and operational overhead for lightweight local usage.

Decision: SQLite is suitable for development and local use; schema design keeps migration path open to PostgreSQL.

### 1.7.3 Frontend Options

#### Traditional HTML/CSS/JS
- Strengths: direct control, simple deployment.
- Weaknesses: can become hard to maintain for complex state logic.

#### React
- Strengths: component reusability, ecosystem, cleaner state-driven UI.
- Weaknesses: additional build tooling and architectural decisions required.

Decision: A modern component approach is preferred for maintainability; existing code supports structured UI modules.

### 1.7.4 Desktop Packaging Options

#### Electron
- Strengths: cross-platform desktop deployment with web technologies.
- Weaknesses: relatively heavier runtime compared to native frameworks.

Decision: Electron is selected for practical packaging and rapid development compatibility.

### 1.7.5 AI Integration Options

#### Rule-Based Analysis Only
- Strengths: deterministic and explainable.
- Weaknesses: limited adaptability.

#### API/Model-Assisted Insights
- Strengths: richer pattern interpretation and recommendations.
- Weaknesses: dependency, accuracy variability, and validation needs.

Decision: combine deterministic logic (rules, thresholds) with optional AI assistance.

## 1.8 Chapter Summary

Chapter 1 established the motivation, objectives, scope, significance, methodology, and technology rationale for iFinance. The analysis confirms that a modular personal finance system with integrated analytics can satisfy both practical usability and academic requirements. Based on this foundation, Chapter 2 presents detailed system analysis and design artifacts.

---

# Chapter 2. System Analysis and Design

## 2.1 Stakeholders and User Roles

### 2.1.1 Primary Stakeholder

The main stakeholder is the end user who manages personal financial data. The system design prioritizes simplicity, reliability, and meaningful insights.

### 2.1.2 Operational Roles

1. Standard User: manages own transactions, categories, reports, and settings.
2. Administrator (optional or development role): manages advanced settings, release/data utilities, and system maintenance functions depending on deployment mode.

## 2.2 Functional Requirements

The main functional requirements are:

FR1: User registration and login.  
FR2: Secure authentication with protected routes.  
FR3: Create, update, delete, and list transactions.  
FR4: Define and manage categories.  
FR5: Rule creation for automatic classification.  
FR6: Generate financial reports by period, category, and type.  
FR7: Display dashboards with key indicators.  
FR8: Record important actions in audit logs.  
FR9: Backup and restore financial data.  
FR10: Provide AI-assisted analysis and anomaly-related insights.

## 2.3 Non-Functional Requirements

NFR1: Security  
- User-specific data isolation.  
- Authentication and authorization middleware.  
- Input validation to prevent invalid or malicious data.

NFR2: Performance  
- Typical API response should be near real-time for personal dataset size.  
- Indexing and query planning for frequent retrieval fields.

NFR3: Reliability  
- Backup and restore must preserve critical financial records.  
- Error handling with meaningful messages.

NFR4: Maintainability  
- Modular layering (routes, services, models, middleware).  
- Clear naming and reusable utility functions.

NFR5: Usability  
- Navigation-oriented interface with clear information hierarchy.  
- Minimal effort for daily transaction input.

## 2.4 Use Case Analysis

### 2.4.1 Major Use Cases

UC1 Login and Authentication  
UC2 Manage Transactions  
UC3 Manage Categories and Rules  
UC4 View Dashboard and Reports  
UC5 Run AI Analysis  
UC6 Backup and Restore Data

### 2.4.2 Use Case Specification Example: Manage Transactions

Actor: User  
Precondition: User is authenticated.  
Main Flow:
1. User opens transaction page.
2. User enters amount, type, category, date, description.
3. System validates input.
4. System stores transaction record.
5. System refreshes list and updated summary.

Alternative Flows:
- If validation fails, system displays error and preserves form state.
- If category does not exist, user can create a new one before saving.

Postcondition:
- Transaction is persisted and visible in report calculations.

### 2.4.3 Use Case Specification Example: Generate Monthly Report

Actor: User  
Precondition: Transaction data exists for selected period.  
Main Flow:
1. User selects month/year.
2. System aggregates totals by type and category.
3. System renders charts and summary indicators.
4. User exports or reviews insights.

Postcondition:
- Report is displayed and available for decision support.

## 2.5 UML Modeling

### 2.5.1 Class Diagram Description

Core entities include:

- User: account identity, profile, credentials metadata.
- Transaction: amount, type (income/expense), category reference, timestamp.
- Category: user-defined grouping for transaction classification.
- Rule: condition/action mappings for automatic categorization or guidance.
- AuditLog: records significant operations for traceability.
- Setting: stores user and system preferences.

Relationship highlights:

- One User has many Transactions.
- One Category can classify many Transactions.
- One User has many Rules and Settings.
- AuditLog entries reference action context and actor.

### 2.5.2 Sequence Diagram: Add Transaction

1. UI sends create request to API.
2. Auth middleware validates token/session.
3. Validation middleware checks payload.
4. Transaction service executes business logic.
5. Model persists record in database.
6. API returns success and updated data snapshot.

### 2.5.3 Activity Diagram: Monthly Review

Start -> Select month -> Fetch transactions -> Aggregate totals -> Compare with budget/rules -> Detect anomalies -> Display insights -> End.

### 2.5.4 Component Diagram

Components:
- UI Layer (pages, forms, dashboards)
- API Layer (routes/controllers)
- Middleware Layer (auth, validator, rate limit)
- Service Layer (business logic, AI, anomaly, backup)
- Data Layer (models + SQL schema)

Data and control flow are intentionally separated so each layer has clear responsibility and testability.

## 2.6 Data Analysis and Database Design

## 2.6.1 Entity Definitions

User Table:
- id, username/email, password hash, role, timestamps.

Transaction Table:
- id, user_id, amount, type, category_id, note, transaction_date, created_at.

Category Table:
- id, user_id, name, type, color/icon optional metadata.

Rule Table:
- id, user_id, condition expression, target category, priority, active status.

AuditLog Table:
- id, user_id/admin_id, action_type, action_details, action_time.

Setting Table:
- id, user_id, key, value, updated_at.

### 2.6.2 Integrity Constraints

- Foreign key constraints between transactions and categories/users.
- NOT NULL constraints for mandatory fields.
- Check constraints for transaction type and numeric amount validity.
- Unique constraints where necessary (for example, per-user category naming policies).

### 2.6.3 Normalization Strategy

The schema is designed around normalized entities to reduce duplication:
- User-specific references isolate records correctly.
- Category metadata is separated from transaction records.
- Rules and settings are managed in dedicated tables.

This helps maintain consistency and supports long-term maintainability.

### 2.6.4 Indexing Strategy

Recommended indexes:
- transactions(user_id, transaction_date)
- transactions(category_id)
- categories(user_id, name)
- audit_logs(user_id, action_time)

These indexes optimize common filtering and reporting operations.

## 2.7 System Architecture Design

### 2.7.1 Layered Architecture

The solution uses layered architecture:

1. Presentation Layer: user interaction and rendering.
2. API/Controller Layer: request handling and response composition.
3. Service Layer: business rules and orchestration.
4. Data Access Layer: model-level database operations.

Advantages:
- lower coupling,
- easier testing,
- simpler replacement or enhancement of individual modules.

### 2.7.2 Request Lifecycle

Typical lifecycle:
1. Request enters route endpoint.
2. Middleware chain executes auth and validation.
3. Controller delegates to service.
4. Service performs logic and model operations.
5. Response returns standardized success/error payload.

### 2.7.3 Error Handling Policy

- Validation errors: clear user-readable messages.
- Authorization errors: strict rejection and status code discipline.
- Internal errors: controlled messages with audit logging.

## 2.8 Security Design

Security measures include:

- Authentication checks on protected routes.
- Route-level authorization rules.
- Input validation for all key payloads.
- Rate limiting for abuse prevention.
- Controlled backup/restore access.
- Audit logs for traceability.

Security is treated as an architectural concern, not a final add-on.

## 2.9 User Interface and Experience Design

Design principles:

1. Clarity: users should quickly understand totals and spending directions.
2. Consistency: similar components and behavior across pages.
3. Efficiency: frequent tasks require minimal steps.
4. Feedback: operations show immediate success/error status.
5. Readability: numeric and chart elements must be easy to interpret.

Core pages:
- Login page
- Dashboard page
- Transactions page
- Reports page
- Settings page
- AI Studio or analysis page (if enabled)

## 2.10 Chapter Summary

Chapter 2 described complete system analysis and design, including requirements, use cases, UML artifacts, database model, layered architecture, and security principles. This chapter provides the engineering blueprint for implementation and evaluation described in Chapter 3.

---

# Chapter 3. Implementation, Demonstration, and Evaluation

## 3.1 Development Environment

### 3.1.1 Tools and Runtime

- Runtime: Node.js
- Backend framework: Express.js
- Database: SQLite schema with relational constraints
- UI stack: web frontend and desktop integration path
- Packaging/runtime support: Electron environment
- Development tools: npm scripts, linting, modular project structure

### 3.1.2 Project Structure Overview

The project is organized by responsibilities:

- backend/app and server bootstrap
- routes for API endpoint groups
- middleware for auth/validation/rate-limiting
- services for business and intelligent logic
- models for data layer mapping
- database scripts for schema and seed/reset
- frontend/client modules for interface and user interactions

This structure supports maintainable growth and cleaner collaboration.

## 3.2 Core Module Implementation

## 3.2.1 Authentication and Authorization Module

Purpose:
- Protect user financial data.
- Ensure only authenticated users can access private operations.

Implementation notes:
- Login endpoint validates credentials.
- Middleware intercepts protected routes and verifies identity context.
- Token/session context is attached to request for downstream services.

Result:
- Unauthorized requests are blocked reliably.
- User-scoped resources are enforced throughout transaction/report operations.

## 3.2.2 Transaction Management Module

Purpose:
- Provide full lifecycle management of income/expense records.

Key functions:
- Create transaction with amount, category, date, note.
- Read transaction list with filtering.
- Update transaction for corrections.
- Delete invalid or obsolete records.

Validation:
- Amount must be numeric and logical.
- Required fields cannot be empty.
- Transaction type must match allowed domain values.

Result:
- Stable CRUD workflow for daily financial tracking.

## 3.2.3 Category and Rule Management Module

Purpose:
- Organize spending data into meaningful groups.
- Support automatic classification rules.

Key functions:
- Category CRUD
- Rule creation and management
- Mapping transaction attributes to categories

Benefits:
- Improved consistency in reports.
- Reduced manual classification effort.

## 3.2.4 Reporting and Dashboard Module

Purpose:
- Convert raw transaction records into actionable visual insights.

Key outputs:
- Total income/expense over selected periods
- Category breakdown
- Trend and comparison indicators
- Optional export/report generation for review

Result:
- Users can quickly understand financial behavior and identify overspending areas.

## 3.2.5 AI/Anomaly Analysis Module

Purpose:
- Provide intelligent support beyond static charts.

Capabilities:
- Detect unusual transaction patterns with threshold/rule logic.
- Generate textual insights or recommendations.
- Support structured analysis prompts for user interpretation.

Limitations:
- Quality depends on input data quality and model/rule calibration.
- Advice should be treated as support, not mandatory financial instruction.

## 3.2.6 Backup and Restore Module

Purpose:
- Improve data safety and continuity.

Functions:
- Backup selected datasets.
- Restore to previous healthy states.
- Validate backup consistency before replacement operations.

Operational value:
- Reduces risk of accidental data loss.

## 3.2.7 Audit Logging Module

Purpose:
- Track important operations and provide traceability.

Events may include:
- authentication events,
- data updates/deletions,
- sensitive operation attempts,
- configuration changes.

Result:
- Better debugging and accountability.

## 3.3 Demonstration Scenario

The following demo script is suitable for graduation defense:

### Step 1: Authentication
- Show login success and route protection for unauthenticated requests.

### Step 2: Add Transactions
- Add multiple income and expense records with different categories and dates.

### Step 3: Category and Rule Setup
- Create or update categories.
- Configure one automatic rule and apply it.

### Step 4: Dashboard Review
- Show totals and category distribution.
- Explain one visible spending trend.

### Step 5: Report Generation
- Generate monthly report and interpret key metrics.

### Step 6: AI/Anomaly Insight
- Trigger analysis and show recommendation output.

### Step 7: Backup and Restore
- Create a backup and show recovery workflow.

This demonstration proves end-to-end operability from data input to analytical output.

## 3.4 Testing and Validation

## 3.4.1 Testing Strategy

- Unit-level validation for utility and service logic.
- Integration testing for route-service-model flows.
- Manual scenario tests for UI interactions and report correctness.

## 3.4.2 Sample Test Cases

TC1 Login with correct credentials -> expected success token/session.  
TC2 Login with invalid credentials -> expected rejection and error message.  
TC3 Create transaction with invalid amount -> expected validation error.  
TC4 Create transaction with valid payload -> expected successful persistence.  
TC5 Generate report for empty period -> expected zero-safe summary.  
TC6 Access protected route without auth -> expected authorization error.  
TC7 Restore from backup file -> expected previous data recovered.

## 3.4.3 Validation Criteria

- Functional correctness: each core feature behaves as defined.
- Data consistency: no broken references after operations.
- Error resilience: invalid inputs are safely rejected.
- Usability: common user tasks are completed with minimal friction.

## 3.5 Performance and Reliability Discussion

For personal-scale data usage, the architecture performs effectively with:

- acceptable response for transaction queries,
- stable report generation for normal monthly datasets,
- manageable resource usage in local desktop/web deployment.

Reliability is improved through:
- controlled error handling,
- backup and restore support,
- audit logs for post-incident traceability.

## 3.6 Results and Achievements

The project achieved the planned core outcomes:

1. Complete transaction lifecycle management.
2. Category and rule-based organization.
3. Dashboard and reporting features for financial insights.
4. Authentication and data protection mechanisms.
5. AI/anomaly support for additional analytical value.
6. Data safety support via backup and restore.

Overall, the system demonstrates that practical personal financial management can be implemented with clear architecture, maintainable code organization, and useful analytical capabilities.

## 3.7 Limitations

Current limitations include:

- limited integration with external banking providers,
- lightweight rather than advanced predictive analytics,
- single-user or limited-scope deployment assumptions,
- constrained benchmark size compared to enterprise systems.

These are realistic boundaries for a graduation-level implementation and provide opportunities for future development.

## 3.8 Future Work

Future improvements may include:

1. Real-time banking API synchronization.
2. Advanced machine learning forecasting for expense prediction.
3. Budget goal recommendation engine.
4. Multi-currency and localization support.
5. Mobile application companion.
6. Expanded automated testing and CI pipelines.

## 3.9 Chapter Summary

Chapter 3 presented implementation details, demonstration flow, testing results, and evaluation. The findings confirm that iFinance satisfies the defined objectives in a practical and extensible way, while also identifying clear directions for future enhancement.

---

# Conclusion

This thesis developed iFinance as an integrated personal finance management and analytics platform. Starting from practical user problems, the project established clear objectives and transformed them into a full engineering process involving system analysis, architecture and database design, implementation, and evaluation.

The final system provides secure data handling, transaction and category management, report generation, anomaly-aware insights, and backup/recovery support. Demonstration and testing indicate that the platform can support everyday financial tracking and decision support for individual users.

From an academic perspective, the project contributes a complete case study that combines software engineering best practices with practical intelligent analytics in a personal finance domain. Future work can extend forecasting capabilities, external integrations, and deployment scalability.

---

# References (Sample Format)

[1] Ian Sommerville, *Software Engineering*, 10th Edition, Pearson, 2015.  
[2] Martin Fowler, *Patterns of Enterprise Application Architecture*, Addison-Wesley, 2002.  
[3] Roy T. Fielding, “Architectural Styles and the Design of Network-based Software Architectures,” Doctoral dissertation, 2000.  
[4] OWASP Foundation, “OWASP Top 10 Web Application Security Risks,” latest version.  
[5] Node.js Documentation, https://nodejs.org  
[6] Express.js Documentation, https://expressjs.com  
[7] SQLite Documentation, https://sqlite.org  
[8] Electron Documentation, https://www.electronjs.org  
[9] Relevant finance analytics journal and conference papers you used in literature review.

Note: Replace sample references with your actual cited materials and keep one citation style consistently (IEEE or APA).

---

# Appendices

## Appendix A. Suggested Figure List

- System architecture diagram
- Use case diagram
- Class diagram
- Sequence diagram (Create Transaction)
- Activity diagram (Monthly Review)
- ERD
- Dashboard screenshot
- Transactions page screenshot
- Reports page screenshot
- Backup/restore screenshot

## Appendix B. Suggested Table List

- Technology comparison table
- Functional requirements table
- Non-functional requirements table
- Data dictionary table
- Test case summary table
- Result comparison before/after system usage

## Appendix C. Report Writing Checklist for 50 Pages

Use this checklist to ensure your final document reaches full academic quality and target length:

1. Add a formal cover page according to your university template.
2. Add acknowledgements and declaration section if required.
3. Expand Abstract to around 250-350 words.
4. Include at least 10-15 figures across all chapters.
5. Include at least 8-12 tables with clear captions.
6. Ensure each chapter has introduction and summary subsections.
7. Add references in-text for every borrowed concept.
8. Add appendix materials (API samples, SQL schema, extra screenshots).
9. Proofread grammar and formatting consistency.
10. Export and review final PDF pagination.

---

# Presentation Slides Content (10-15 Slides, English)

## Slide 1 - Title
“iFinance: Personal Finance Management and Intelligent Analytics System”  
Student name, supervisor, faculty, date.

## Slide 2 - Problem Statement
- Difficulty in tracking daily expenses.
- Fragmented tools and inconsistent records.
- Need for integrated analysis and decision support.

## Slide 3 - Objectives
- Build secure transaction management platform.
- Provide reporting and insights.
- Support anomaly detection and backup safety.

## Slide 4 - Scope and Contribution
- In scope: auth, transactions, categories, reports, AI support.
- Contribution: full-stack architecture + practical demo.

## Slide 5 - Methodology
- Requirement analysis
- System design
- Implementation
- Testing and evaluation

## Slide 6 - System Architecture
- UI layer
- API and middleware
- Service layer
- Database layer

## Slide 7 - Analysis and Design
- Use case overview
- UML class and sequence highlights
- ERD and key constraints

## Slide 8 - Core Features
- Authentication
- Transaction CRUD
- Category/rule management
- Dashboard and reports
- Backup/restore

## Slide 9 - AI and Anomaly Insights
- Pattern detection concept
- Example recommendation output
- User value and limitations

## Slide 10 - Demo Flow
1. Login
2. Add transactions
3. Review dashboard
4. Generate report
5. Run AI analysis
6. Backup and restore

## Slide 11 - Results and Evaluation
- Functional test completion status
- User-level benefits
- Reliability and maintainability notes

## Slide 12 - Limitations and Future Work
- Bank API integration
- Forecasting models
- Mobile expansion

## Slide 13 - Conclusion
- Objectives achieved.
- System is practical and extensible.
- Thesis outcomes are valid for graduation requirements.

## Slide 14 - Q&A
“Thank you for your attention.”

---

# Short Oral Script for Defense (Optional)

Good morning respected lecturers and committee members. My project is iFinance, a personal finance management and intelligent analytics system. The motivation of this project comes from common difficulties in daily expense tracking, where users often record data inconsistently and lack actionable financial insights.

The main objective was to design and implement a full-stack system that can securely manage transactions, support category and rule-based organization, generate reports, and provide anomaly-aware analytical suggestions. The project follows an iterative development methodology, including requirement analysis, architecture design, implementation, testing, and evaluation.

In terms of design, the system applies a layered architecture with clear separation between presentation, API, service, and data layers. The database model includes core entities such as User, Transaction, Category, Rule, AuditLog, and Setting, with relational constraints to maintain consistency.

The implementation includes authentication and authorization, transaction CRUD, category and rule management, dashboards and reports, AI/anomaly support, and backup/restore. Functional testing confirms that the major requirements are satisfied and the system performs well under personal-scale workloads.

During demo, I will show login, transaction creation, report generation, AI insight output, and backup/restore workflow. The project still has limitations, including lack of real-time bank integration and advanced forecasting, which are proposed as future work.

In conclusion, iFinance demonstrates that a practical, maintainable, and analytics-enabled personal finance platform can be developed effectively using modern software engineering practices. Thank you, and I am ready for your questions.

---

# Super Extended Content Pack (For 50+ Pages)

This section is intentionally verbose and academic-style so you can directly reuse it to expand your final thesis to 50 pages or more without lacking technical depth.

## A. Extended Literature Review (Suggested 4-6 Pages)

### A.1 Overview of Personal Finance Software

Personal finance software has evolved from static ledger tools into interactive platforms that integrate reporting, recommendations, and behavioral analytics. Earlier systems focused on data entry and static summaries. Modern systems increasingly support:

- trend analysis,
- budget monitoring,
- anomaly alerts,
- cloud synchronization,
- and AI-assisted interpretation.

However, several limitations remain common in the literature and practice:

1. High feature complexity can reduce usability for non-technical users.
2. Proprietary cloud platforms may raise privacy concerns.
3. Many systems hide internal logic, making educational evaluation difficult.
4. Lightweight local-first deployment is often under-supported.

In an academic project context, these limitations motivate building a transparent, modular, and testable system where architecture decisions can be justified and validated.

### A.2 Software Architecture Patterns in Financial Applications

Financial applications often use layered, clean, or service-oriented architectures to isolate concerns. A layered model is suitable for graduation projects because it clearly separates:

- presentation responsibilities,
- request orchestration,
- business logic,
- and persistence.

This separation improves testability and simplifies maintenance. For example, changing the UI should not break transaction business rules, and database migration should not force a complete API rewrite.

Domain-driven decomposition is also important: transactions, categories, rules, and reports are domain modules that should have explicit boundaries and contracts.

### A.3 Security in Personal Financial Systems

Security is not optional in finance-related applications. Even for personal-scale systems, the following controls are essential:

- authentication and authorization enforcement,
- strict payload validation,
- secure credential handling,
- controlled access to backup operations,
- and audit logging for sensitive actions.

Academic references and industry best practices (such as OWASP guidance) emphasize defense-in-depth. iFinance follows this principle by combining middleware protections, model-level constraints, and operation-level checks.

### A.4 Data Modeling and Relational Integrity

Relational databases remain highly suitable for personal finance systems due to:

- structured entities (user, transaction, category, rule),
- deterministic querying,
- and strong consistency requirements.

Normalization reduces redundancy and prevents anomalies during updates/deletions. In addition, indexing on frequent filter dimensions (user and date) is critical for report responsiveness.

### A.5 Role of AI in Personal Finance

AI in personal finance can provide descriptive and suggestive value:

- identifying unusual spending patterns,
- generating short explanations for trends,
- suggesting budget adjustments.

Still, AI output must be interpreted cautiously. It is advisory and context-dependent, not legally or financially authoritative. Therefore, this thesis uses AI as a supporting layer over deterministic transaction records and rule-based checks.

### A.6 Research Gap and Positioning of iFinance

The main gap addressed in this thesis is the absence of an educationally transparent system that combines:

- full-stack architecture,
- practical finance features,
- explainable business logic,
- and optional intelligent support.

iFinance positions itself as both a usable product prototype and a complete academic artifact.

---

## B. Extended Requirement Specification

## B.1 Functional Requirements Table (Detailed)

| ID | Requirement | Description | Input | Output | Priority |
|---|---|---|---|---|---|
| FR01 | User Login | Authenticate user credentials | username/password | token/session + profile | High |
| FR02 | User Logout | End active session securely | auth context | logout confirmation | High |
| FR03 | Create Transaction | Add income/expense item | amount, type, category, date, note | persisted transaction | High |
| FR04 | Update Transaction | Edit transaction details | transaction id + payload | updated record | High |
| FR05 | Delete Transaction | Remove incorrect transaction | transaction id | deletion status | High |
| FR06 | List Transactions | Retrieve paginated filtered list | filters: date/type/category | transaction dataset | High |
| FR07 | Manage Categories | Create/update/delete categories | category payload | category state | High |
| FR08 | Manage Rules | Define auto-categorization rules | rule payload | active rule set | Medium |
| FR09 | Dashboard Summary | Show total income/expense balance | date range | KPI cards/charts | High |
| FR10 | Category Report | Breakdown by category | date range | aggregated report | High |
| FR11 | Trend Report | Monthly/weekly trend overview | date range | trend series | Medium |
| FR12 | AI Insight | Generate recommendation text | selected period dataset | analysis output | Medium |
| FR13 | Anomaly Detection | Flag unusual transactions | transaction history | anomaly indicators | Medium |
| FR14 | Audit Logging | Track important actions | system events | audit records | Medium |
| FR15 | Backup Data | Export snapshot safely | backup request | backup file/status | High |
| FR16 | Restore Data | Recover from backup | backup source | restored state | High |
| FR17 | Settings Management | Update user preferences | settings payload | updated settings | Low |
| FR18 | Health Check | Verify service health | ping request | service status | Low |

## B.2 Non-Functional Requirements Table (Detailed)

| ID | Type | Requirement Statement | Measurement / Acceptance |
|---|---|---|---|
| NFR01 | Security | Protected routes require valid auth context | Unauthorized access returns rejection consistently |
| NFR02 | Security | Input data must be validated server-side | Invalid payloads are rejected with clear errors |
| NFR03 | Security | Sensitive operations must be auditable | Audit logs generated for configured actions |
| NFR04 | Performance | Common CRUD operations should be responsive | Typical response near real-time in local environment |
| NFR05 | Performance | Reports should load within practical wait time | Monthly report generated without blocking UX |
| NFR06 | Reliability | Backup and restore should preserve consistency | Restored data passes integrity checks |
| NFR07 | Maintainability | Code should be modular and readable | Clear separation: routes/services/models/middleware |
| NFR08 | Usability | Frequent tasks should be low-friction | User can add transaction in few steps |
| NFR09 | Scalability | Data model should allow migration path | Schema can move from SQLite to PostgreSQL |
| NFR10 | Portability | System should run in desktop/web environment | Build and execution process documented |

---

## C. Extended Use Case Specifications (10 Full Use Cases)

### UC-01: Login
- **Actor:** User  
- **Goal:** Access personal dashboard securely.  
- **Preconditions:** User account exists.  
- **Main Flow:**  
  1) User enters credentials.  
  2) System validates format and identity.  
  3) Auth context is issued.  
  4) Dashboard is loaded.  
- **Alternative Flow A:** Invalid password -> system returns authentication error.  
- **Alternative Flow B:** Account disabled -> system denies access with message.  
- **Postconditions:** Authenticated session established.

### UC-02: Logout
- **Actor:** User  
- **Goal:** End access session.  
- **Preconditions:** User is logged in.  
- **Main Flow:**  
  1) User chooses logout action.  
  2) System invalidates local auth context.  
  3) User is redirected to login page.  
- **Postconditions:** No protected page access without re-login.

### UC-03: Create Transaction
- **Actor:** User  
- **Goal:** Record new income/expense item.  
- **Preconditions:** User is authenticated; category exists or can be added.  
- **Main Flow:**  
  1) Open transaction form.  
  2) Enter amount, type, category, date, note.  
  3) Submit form.  
  4) System validates and stores record.  
  5) Updated list and summary shown.  
- **Alternative Flow:** Invalid amount/date/category -> validation errors shown.  
- **Postconditions:** New transaction is included in reports.

### UC-04: Update Transaction
- **Actor:** User  
- **Goal:** Correct existing transaction details.  
- **Preconditions:** Transaction belongs to authenticated user.  
- **Main Flow:**  
  1) Select transaction.  
  2) Edit fields.  
  3) Submit update.  
  4) System validates and persists changes.  
- **Postconditions:** Updated values reflected in summaries and reports.

### UC-05: Delete Transaction
- **Actor:** User  
- **Goal:** Remove invalid or duplicate transaction.  
- **Preconditions:** Target transaction exists and belongs to user.  
- **Main Flow:**  
  1) User clicks delete action.  
  2) System asks confirmation.  
  3) Record is removed.  
  4) Dashboard/report aggregates refresh.  
- **Postconditions:** Deleted item is no longer retrievable.

### UC-06: Manage Categories
- **Actor:** User  
- **Goal:** Organize transactions into meaningful groups.  
- **Preconditions:** User authenticated.  
- **Main Flow:**  
  1) Open category settings.  
  2) Create/edit/delete category metadata.  
  3) Save changes.  
- **Alternative Flow:** Duplicate category names rejected by policy.  
- **Postconditions:** Categories available for transaction assignment and reports.

### UC-07: Configure Rules
- **Actor:** User  
- **Goal:** Automate category assignment or classification logic.  
- **Preconditions:** Categories exist.  
- **Main Flow:**  
  1) Define rule condition and target category.  
  2) Set priority/activation.  
  3) Save rule.  
  4) Apply rule during transaction processing.  
- **Postconditions:** Consistent auto-classification behavior enabled.

### UC-08: Generate Financial Report
- **Actor:** User  
- **Goal:** Review financial behavior by time period.  
- **Preconditions:** Transaction records exist in selected period.  
- **Main Flow:**  
  1) Choose month/range.  
  2) System aggregates totals and category distribution.  
  3) Charts and KPIs are displayed.  
- **Alternative Flow:** No data -> zero-state report rendered safely.  
- **Postconditions:** User obtains actionable insight for planning.

### UC-09: Run AI/Anomaly Analysis
- **Actor:** User  
- **Goal:** Identify unusual patterns and suggestions.  
- **Preconditions:** Sufficient transaction history exists.  
- **Main Flow:**  
  1) Trigger analysis request.  
  2) System evaluates patterns and thresholds.  
  3) Optional AI narrative is generated.  
  4) Results shown with caution note.  
- **Postconditions:** User receives supplementary analytical guidance.

### UC-10: Backup and Restore
- **Actor:** User / Maintainer  
- **Goal:** Protect and recover data state.  
- **Preconditions:** Authorized role and valid backup target/source.  
- **Main Flow (Backup):**  
  1) Initiate backup operation.  
  2) System exports data snapshot.  
  3) Operation status logged.  
- **Main Flow (Restore):**  
  1) Select backup source.  
  2) Validate compatibility and integrity.  
  3) Restore data and confirm completion.  
- **Postconditions:** Data continuity preserved.

---

## D. Extended UML and Design Narrative (Suggested Text for Report)

### D.1 Class Diagram Narrative

The class model is centered around `Transaction` as the operational core entity. Each transaction is owned by one `User` and is associated with one `Category`. `Rule` entities provide configurable logic that can automatically classify future transactions based on patterns or conditions. `AuditLog` captures state-changing operations to support traceability and post-incident diagnostics. `Setting` stores user-specific preferences that influence report presentation and application behavior.

The model emphasizes low coupling and clear ownership. User-scoped boundaries are applied consistently to protect privacy and prevent cross-user data leakage.

### D.2 Sequence Diagram Narrative (Create Transaction)

The sequence starts from UI form submission and passes through API route, authentication middleware, validation middleware, and transaction service. The service layer applies business rules, then delegates persistence to the model/data layer. After insertion, the API returns a structured response and the UI refreshes summary metrics. This sequence demonstrates separation of concerns and predictable request handling.

### D.3 Activity Diagram Narrative (Monthly Analysis)

Monthly analysis begins with date-range selection, followed by transaction retrieval and grouping operations. The system computes totals by type and category, evaluates predefined thresholds for anomaly indicators, and renders dashboard insights. The user then decides whether to adjust budget plans or inspect specific categories. This flow highlights decision-support orientation rather than pure data display.

### D.4 Component Diagram Narrative

The component architecture includes UI, API routes/controllers, middleware, services, and data modules. Middleware acts as policy gatekeeper. Services encapsulate domain logic and analytics orchestration. Data modules enforce schema mapping and constraints. This organization allows independent testing and easier future extension (for example, adding forecasting service without rewriting transaction routes).

---

## E. Extended Database Documentation (Data Dictionary Template)

## E.1 User Table (Example)

| Field | Type | Null | Key | Description |
|---|---|---|---|---|
| id | INTEGER/UUID | No | PK | Unique user identifier |
| username | TEXT | No | Unique | Login name |
| password_hash | TEXT | No | - | Secure credential hash |
| role | TEXT | No | - | User role indicator |
| created_at | DATETIME | No | - | Creation timestamp |
| updated_at | DATETIME | Yes | - | Last update timestamp |

## E.2 Transaction Table (Example)

| Field | Type | Null | Key | Description |
|---|---|---|---|---|
| id | INTEGER/UUID | No | PK | Unique transaction id |
| user_id | INTEGER/UUID | No | FK | Owner user reference |
| category_id | INTEGER/UUID | Yes | FK | Category reference |
| amount | DECIMAL | No | - | Transaction value |
| type | TEXT | No | - | income/expense |
| note | TEXT | Yes | - | Optional details |
| transaction_date | DATE | No | - | Effective transaction date |
| created_at | DATETIME | No | - | Creation timestamp |

## E.3 Category Table (Example)

| Field | Type | Null | Key | Description |
|---|---|---|---|---|
| id | INTEGER/UUID | No | PK | Category id |
| user_id | INTEGER/UUID | No | FK | Owner user |
| name | TEXT | No | - | Category name |
| category_type | TEXT | Yes | - | Optional type grouping |
| created_at | DATETIME | No | - | Creation timestamp |

## E.4 Rule Table (Example)

| Field | Type | Null | Key | Description |
|---|---|---|---|---|
| id | INTEGER/UUID | No | PK | Rule id |
| user_id | INTEGER/UUID | No | FK | Rule owner |
| condition_expr | TEXT | No | - | Rule condition |
| target_category_id | INTEGER/UUID | Yes | FK | Assignment target |
| priority | INTEGER | Yes | - | Conflict order |
| is_active | BOOLEAN | No | - | Rule status |

## E.5 AuditLog Table (Example)

| Field | Type | Null | Key | Description |
|---|---|---|---|---|
| id | INTEGER/UUID | No | PK | Log id |
| user_id | INTEGER/UUID | Yes | FK | Related user |
| action_type | TEXT | No | - | Event category |
| action_details | TEXT | Yes | - | Event payload |
| action_time | DATETIME | No | - | Event timestamp |

---

## F. Extended Testing Matrix (40 Suggested Test Cases)

| TC ID | Module | Scenario | Expected Result |
|---|---|---|---|
| TC01 | Auth | Valid login | Success response and auth context |
| TC02 | Auth | Invalid password | Authentication error |
| TC03 | Auth | Empty username | Validation error |
| TC04 | Auth | Empty password | Validation error |
| TC05 | Auth | Access protected endpoint without token | Authorization error |
| TC06 | Auth | Access protected endpoint with invalid token | Authorization error |
| TC07 | Transaction | Create valid income transaction | Record created |
| TC08 | Transaction | Create valid expense transaction | Record created |
| TC09 | Transaction | Create with negative invalid amount format | Validation error |
| TC10 | Transaction | Create with missing date | Validation error |
| TC11 | Transaction | Update existing transaction | Record updated |
| TC12 | Transaction | Update non-existing transaction | Not found response |
| TC13 | Transaction | Delete existing transaction | Record removed |
| TC14 | Transaction | Delete non-existing transaction | Not found response |
| TC15 | Transaction | List with no filters | Full paginated list returned |
| TC16 | Transaction | List filtered by category | Subset correctly returned |
| TC17 | Transaction | List filtered by date range | Correct range result |
| TC18 | Category | Create new category | Category created |
| TC19 | Category | Create duplicate category name policy conflict | Conflict/validation error |
| TC20 | Category | Update category metadata | Category updated |
| TC21 | Category | Delete unused category | Category removed |
| TC22 | Category | Delete category linked with transactions | Controlled behavior enforced |
| TC23 | Rule | Create active rule | Rule persisted |
| TC24 | Rule | Update rule priority | Rule updated |
| TC25 | Rule | Disable rule | Rule inactive in processing |
| TC26 | Report | Generate monthly report with data | Aggregates and charts shown |
| TC27 | Report | Generate report for empty month | Zero-safe output shown |
| TC28 | Report | Category distribution calculation | Correct totals by category |
| TC29 | Dashboard | KPI totals refresh after create transaction | Values updated |
| TC30 | Dashboard | KPI totals refresh after delete transaction | Values updated |
| TC31 | AI | Trigger analysis with sufficient data | Insight text returned |
| TC32 | AI | Trigger analysis with insufficient data | Graceful advisory response |
| TC33 | Anomaly | Detect high-value outlier | Anomaly flag generated |
| TC34 | Audit | Login action logged | Audit record written |
| TC35 | Audit | Delete transaction action logged | Audit record written |
| TC36 | Backup | Create backup snapshot | Backup success status |
| TC37 | Restore | Restore valid backup | Data state recovered |
| TC38 | Restore | Restore invalid/corrupted backup | Safe rejection with message |
| TC39 | Settings | Update user setting | Setting saved |
| TC40 | System | Health check endpoint | Service status OK |

### F.1 UAT Notes Template

For each user acceptance test run, capture:
- test date and environment,
- tester role,
- scenario steps,
- screenshot evidence,
- pass/fail status,
- corrective actions (if fail).

---

## G. Deployment and Build Procedure (Extended Write-Up)

### G.1 Local Development Setup

1. Install runtime dependencies.
2. Prepare environment variables/config.
3. Initialize database schema.
4. Seed sample data if required.
5. Start backend server.
6. Start frontend/client app.
7. Execute smoke test scenarios.

### G.2 Release Build Considerations

- Lock package versions for repeatable build.
- Validate production configuration and security flags.
- Run lint/test before packaging.
- Package desktop bundle if Electron distribution is required.
- Store backup snapshot before migration or release update.

### G.3 Operational Checklist

- Authentication verification complete
- CRUD endpoints verified
- Report generation checked
- Backup/restore tested
- Error logs reviewed
- Demo dataset prepared

---

## H. Risk Analysis and Mitigation

| Risk | Description | Impact | Mitigation |
|---|---|---|---|
| R1 | Data loss due to incorrect operations | High | Backup before critical changes; restore workflow |
| R2 | Invalid input causes logic errors | Medium | Validation middleware and schema checks |
| R3 | Unauthorized access attempts | High | Auth middleware and route guards |
| R4 | Inaccurate AI suggestions | Medium | Advisory disclaimer + deterministic fallback |
| R5 | Feature creep near deadline | Medium | Priority-based scope lock |
| R6 | Environment inconsistency | Medium | Setup documentation and scripted initialization |

---

## I. Expanded Slide Notes (Speaker Version)

Use the following one-line speaker notes under each slide:

1. Title: “This project addresses practical personal finance pain points with an integrated and intelligent system.”
2. Problem: “Users often track finances inconsistently and lack reliable analytical feedback.”
3. Objectives: “The system targets secure management, structured reporting, and decision support.”
4. Scope: “The implementation focuses on core personal finance workflows and excludes enterprise complexity.”
5. Methodology: “An iterative process was used from requirements through testing and evaluation.”
6. Architecture: “Layer separation ensures maintainability and easy feature extension.”
7. Analysis/Design: “UML and ERD artifacts guided implementation and consistency.”
8. Features: “Core modules include auth, transactions, categories/rules, reports, and backup.”
9. AI: “Intelligent insight is advisory and complements deterministic reporting.”
10. Demo: “I will show a full workflow from login to report and restore.”
11. Results: “Functional goals were met with stable user-level performance.”
12. Future Work: “Bank integration and forecasting are next strategic improvements.”
13. Conclusion: “iFinance validates a practical and academically sound engineering solution.”
14. Q&A: “Thank you, I welcome your questions.”

---

## J. Formatting Guideline to Reach Real 50+ Pages

Use these formatting recommendations in Word/Docs:

- Font: Times New Roman, size 13
- Line spacing: 1.5
- Margins: Left 3.5 cm, Right 2 cm, Top 2.5 cm, Bottom 2.5 cm
- Paragraph spacing: 6pt after each paragraph
- Figure caption and table caption included consistently

### Suggested Pagination Distribution

- Abstract + Intro pages: 4-5 pages
- Chapter 1: 14-16 pages
- Chapter 2: 18-20 pages
- Chapter 3: 14-16 pages
- Conclusion + references: 4-6 pages
- Appendices (optional extra): 6+ pages

If you include diagrams, screenshots, and detailed tables above, your final document should comfortably exceed 50 pages.

---

## K. Final Copy-Paste Submission Checklist

Before final submission:

1. Replace placeholder names and IDs.
2. Insert real UML diagrams and ERD images.
3. Replace sample references with your exact sources.
4. Align section numbering with your university template.
5. Add figure/table numbering and cross-references.
6. Run language proofread once.
7. Export to PDF and verify pagination.

This super-extended package is designed to be directly reusable for both thesis writing and defense preparation.

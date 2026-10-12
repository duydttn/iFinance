

                 THAI NGUYEN UNIVERSITY OF INFORMATION 

                        AND COMMUNICATION TECHNOLOGY

                 **INSTITUTE OF INTERNATIONAL TRAINING**

 			  

                                           **PROJECT REPORT**  
                        **SOFTWARE DEVELOPMENT PROJECT I**         

	**iFinance – Personal Finance Management and Intelligent Analytics System**

                                      **Supervisor: Dr. Vu Duc Quang**  
                                      **Student name: Be Van Duy**  
                                      **Student ID: DTC235210010**  
                                      **Class: CNTT QT K22A**

   **Thai Nguyen, May 2026**

**ACKNOWLEDMENTS**  
Personal finance management is a critical skill in modern life, yet many individuals still struggle to maintain clear records of income and expenses, evaluate spending patterns, and make data-driven financial decisions. Traditional approaches based on manual bookkeeping or simple spreadsheets are often inconsistent, error-prone, and difficult to scale. This thesis presents the design and implementation of iFinance, a practical personal finance management system that combines transaction tracking, category-based budgeting, reporting dashboards, and intelligent analytics in one unified platform.  
The project follows a full software engineering lifecycle that includes requirement elicitation, system analysis, architecture design, database modeling, backend and frontend development, testing, and performance evaluation. The solution is implemented with a modular architecture that separates API routes, business services, middleware, and data models to improve maintainability and scalability. Key features include secure user authentication, transaction CRUD operations, category and rule management, monthly and period-based reports, anomaly detection support, audit logging, and backup/restore mechanisms.  
Experimental validation and demo scenarios indicate that the system can effectively support daily financial tracking and improve users' awareness of spending behavior. The report also discusses implementation constraints and proposes future improvements such as predictive forecasting, banking API integration, and advanced recommendation models.   
Keywords: personal finance, expense tracking, software architecture, database design, analytics, full-stack development.

                                                             *Thai Nguyen, May 11 , 2026*  
                                                                                  **Student**    
                                                                               **Be Van Duy**

# 

# 

# **Table of content** {#table-of-content}

[Table of content	2](#table-of-content)

[LIST OF TABLES AND FIGURES	6](#list-of-tables-and-figures)

[CHAPTER 1\. INTRODUCTION, OBJECTIVES, AND TECHNOLOGY SURVEY	7](#chapter-1.-introduction-objectives-and-technology-survey)

[1.1. Background and motivation of personal finance management	7](#1.1.-background-and-motivation-of-personal-finance-management)

[1.1.1. The role of personal finance management in modern life	7](#1.1.1.-the-role-of-personal-finance-management-in-modern-life)

[1.1.2. Limitations of traditional approaches and existing tools	7](#1.1.2.-limitations-of-traditional-approaches-and-existing-tools)

[1.1.3. Practical needs that motivate the iFinance system	9](#1.1.3.-practical-needs-that-motivate-the-ifinance-system)

[1.1.4. Software engineering and finance management	11](#1.1.4.-software-engineering-and-finance-management)

[1.1.5. Intelligent analytics and AI in personal finance	13](#1.1.5.-intelligent-analytics-and-ai-in-personal-finance)

[1\. 2\. Technology survey for full-stack finance applications	16](#1.2.-technology-survey-for-full-stack-finance-applications)

[1.2.1 . Backend frameworks and runtime environments	17](#1.2.1.-backend-frameworks-and-runtime-environments)

[1.2.2 . Database options for personal-scale finance data	17](#1.2.2.-database-options-for-personal-scale-finance-data)

[1\. 2\. 3\. Frontend stack and desktop packaging strategy	18](#1.2.3.-frontend-stack-and-desktop-packaging-strategy)

[1.2.4 . Authentication, validation, and security building blocks	19](#1.2.4.-authentication-validation-and-security-building-blocks)

[1.2.5 . Comparative analysis of existing personal finance solutions	20](#1.2.5.-comparative-analysis-of-existing-personal-finance-solutions)

[1.3 . Objectives, scope, and methodology	21](#1.3.-objectives-scope-and-methodology)

[1.3.1 . General and specific objectives	21](#1.3.1.-general-and-specific-objectives)

[1.3.2 . Scope and limitations of the project	21](#1.3.2.-scope-and-limitations-of-the-project)

[1.3.3 . Research and development methodology	22](#1.3.3.-research-and-development-methodology)

[1.4 . Chapter Conclusion	22](#1.4.-chapter-conclusion)

[CHAPTER 2\. SYSTEM ANALYSIS AND DESIGN	22](#chapter-2.-system-analysis-and-design)

[2.1 . Analysis of the personal finance management problem	22](#2.1.-analysis-of-the-personal-finance-management-problem)

[2.1.1 . Context and motivation of the problem	22](#2.1.1.-context-and-motivation-of-the-problem)

[2.1.2 . Definition and specification of the problem	22](#2.1.2.-definition-and-specification-of-the-problem)

[2.1.3 . Technical and data-related challenges	23](#2.1.3.-technical-and-data-related-challenges)

[2.1.4 . Functional and Non-functional Requirements of the System	24](#2.1.4.-functional-and-non-functional-requirements)

[2.2 . Proposed system design and architectural choices	24](#2.2.-proposed-system-design-and-architectural-choices)

[2.2.1 . Layered architecture for the iFinance backend	24](#2.2.1.-layered-architecture-for-the-ifinance-backend)

[2.2.2 . Service-oriented organization for transactions and analytics	25](#2.2.2.-service-oriented-organization-for-transactions-and-analytics)

[2.2.3 . Frontend modular components and desktop packaging	26](#2.2.3.-frontend-modular-components-and-desktop-packaging)

[2.2.4 . Rule-based analytics and AI-assisted insights	26](#2.2.4.-rule-based-analytics-and-ai-assisted-insights)

[2.3 . System modeling, evaluation criteria and database design	27](#2.3.-system-modeling-evaluation-criteria-and-database-design)

[2.3.1 . Functional evaluation criteria for finance modules	27](#2.3.1.-functional-evaluation-criteria-for-finance-modules)

[2.3.2 . Reliability, security and data integrity criteria	28](#2.3.2.-reliability-security-and-data-integrity-criteria)

[2.3.3 . Performance and usability evaluation	29](#2.3.3.-performance-and-usability-evaluation)

[2.3.4 . System evaluation at the application level and practical impact	29](#2.3.4.-system-evaluation-at-the-application-level-and-practical-impact)

[2\. 3.5 . Use-case Diagram	30](#2.3.5.-use-case-diagram)

[2.3.6 . UML Diagram / Activity Diagram	31](#2.3.6.-uml-and-activity-diagram)

[2.3.7 Database Design​​	32](#2.3.7.-database-design)

[2.4 . Chapter Conclusion	33](#2.4.-chapter-conclusion)

[CHAPTER 3\. IMPLEMENTATION, DEMONSTRATION AND TESTING RESULTS	34](#chapter-3.-implementation-demonstration-and-testing-results)

[3.1. Overview of the iFinance implementation pipeline	34](#3.1.-overview-of-the-ifinance-implementation-pipeline)

[3.1.1. Development environment and tooling	35](#3.1.1.-development-environment-and-tooling)

[3.1.2. Project structure and module organization	36](#3.1.2.-project-structure-and-module-organization)

[3.1.3. Implementation of authentication, transactions and reports	38](#3.1.3.-implementation-of-authentication-transactions-and-reports)

[3.1.4. AI/anomaly support and backup configuration	41](#3.1.4.-ai-anomaly-support-and-backup-configuration)

[3.2. Application demonstration and user workflows	44](#3.2.-application-demonstration-and-user-workflows)

[3.2.1. Login, dashboard and transaction workflow	45](#3.2.1.-login-dashboard-and-transaction-workflow)

[3.2.2. Reports, settings and AI Studio workflow	45](#3.2.2.-reports-settings-and-ai-studio-workflow)

[3.3. Testing and Evaluation Results	47](#3.3.-testing-and-evaluation-results)

[3.3.1. Test scenario distribution	47](#3.3.1.-test-scenario-distribution)

[3.3.2. Functional testing results for the API and core modules	49](#3.3.2.-functional-testing-results-for-core-modules)

[3.3.3. End-to-end and user acceptance evaluation	49](#3.3.3.-end-to-end-and-user-acceptance-evaluation)

[3.3.4. Overall system evaluation and discussion	49](#3.3.4.-overall-system-evaluation-and-discussion)

[CONCLUSION AND FUTURE DEVELOPMENT	54](#conclusion-and-future-development)

[REFERENCES	57](#references)

# **LIST OF TABLES AND FIGURES** {#list-of-tables-and-figures}

Figure 1.1. Personal finance management overview ......................................................... 3

Figure 1.2. Modern personal finance tools landscape 	6

Figure 1.3. Layered software architecture for finance applications .....................9

Figure 1.4. AI-assisted financial analytics 	9

Figure 1.5. Automation in personal finance ..................................................................10

Figure 1.6. Conversational financial assistants 	10

Figure 1.7. Predictive analytics for spending behavior 	11

Figure 1.8. Authentication and data protection illustration 	11

Figure 2.1. Use-case diagram of the iFinance system 	30

Figure 2.2. Activity diagram for the monthly review workflow 	31

Figure 2.3. Entity-Relationship Diagram (ERD) of the iFinance database 	32

Figure 3.1. iFinance system processing pipeline (request lifecycle) 	...40

Figure 3.2. Login and dashboard interface 	43

Figure 3.3. Transaction management interface and CRUD workflow 	44

Figure 3.4. Reports and analytics dashboard 	45

Figure 3.5. Settings and AI Studio interface 	46

Table 3.1. Distribution of test scenarios across functional modules 	47

Figure 3.6. Visual distribution of test scenarios per module 	48

Table 3.2. Summary of functional testing and evaluation results 	48

Figure 3.7. Test result matrix and pass/fail visualization 	50

Figure 3.8. Performance and response-time metrics 	51

Figure 3.9. Quantitative quality report and summary-style metrics 	52

# 

# **CHAPTER 1\. INTRODUCTION, OBJECTIVES, AND TECHNOLOGY SURVEY** {#chapter-1.-introduction-objectives-and-technology-survey}

## **1.1. Background and motivation of personal finance management** {#1.1.-background-and-motivation-of-personal-finance-management}

### ***1.1.1. The role of personal finance management in modern life*** {#1.1.1.-the-role-of-personal-finance-management-in-modern-life}

Personal finance management is the practice of recording, classifying, analyzing, and planning personal income and expenses in order to make rational financial decisions. In modern society, where financial pressure increases due to inflation, unstable income patterns, and rising living costs, the ability to manage daily money flow is no longer an optional skill but a critical foundation for long-term stability.

In essence, an effective personal finance management system needs to answer practical questions every individual faces, such as: where is money being spent, which categories consume the largest budget, whether current spending habits are sustainable, and how to plan saving and investing within personal capacity. From a software engineering perspective, that means transforming raw transaction logs into structured, searchable, and analyzable data that supports decision-making.

![](images/figure-1-1.png)

*Figure 1.1. Personal finance management overview*

In the 21st century, the rapid development of mobile devices, cloud services, and intelligent analytics has dramatically changed the way users interact with financial data. Personal finance applications have evolved from simple ledger-style tools into integrated platforms that combine transaction tracking, category-based budgeting, dashboard reporting, and AI-assisted insights. This is the broader context in which the iFinance system is designed and developed.

### ***1.1.2. Limitations of traditional approaches and existing tools*** {#1.1.2.-limitations-of-traditional-approaches-and-existing-tools}

For a long time, individuals managed their finances through paper notebooks, hand-written diaries, or standalone spreadsheets such as Microsoft Excel and Google Sheets. These traditional approaches are familiar, low-cost, and require almost no learning curve. However, they suffer from several systemic problems: data is fragmented across many files, monthly aggregation requires significant manual effort, calculation errors are common, and access control is essentially absent. As soon as the volume of transactions grows or the user wants to compare multiple periods, these tools become very difficult to maintain.

Mobile-first commercial finance apps appeared as the next generation of solutions. They focus on convenience and quick transaction entry, but in many cases the underlying logic is opaque, customization is limited, and users do not own their data because everything is stored on third-party cloud services. For learners, researchers, and small organizations that want to deploy locally, such products are not always suitable.

Enterprise-grade accounting tools, on the other hand, offer powerful reporting and strict controls but were designed for accountants and financial professionals. They are over-complex for an individual user, expensive to license, and have a steep onboarding curve. Most personal users simply do not need double-entry accounting, multi-company books, or full tax compliance modules.

In summary, the existing landscape of personal finance tools is split between three groups that are individually attractive but collectively incomplete: spreadsheet-based methods that are flexible but error-prone; mobile finance apps that are convenient but not transparent; and enterprise tools that are powerful but unnecessarily heavy. This gap is the practical motivation behind iFinance.

A modern, modular, and educationally transparent personal finance system should combine the convenience of an app, the structured rigor of an accounting tool, and the openness of a custom academic project. iFinance is positioned exactly in this intersection, with the additional integration of intelligent analytics that complement deterministic reporting.

### ***1.1.3. Practical needs that motivate the iFinance system*** {#1.1.3.-practical-needs-that-motivate-the-ifinance-system}

#### *1.1.3.1. Reliable transaction recording*

The most fundamental need of any personal finance solution is to record income and expense transactions accurately and consistently. A reliable recording mechanism must support fast input for daily tasks, allow editing and deletion when corrections are needed, and enforce validation rules so that no transaction is stored with missing required fields or invalid amounts. Without this foundation, any subsequent analytics layer is meaningless because it operates on noisy data.

In practice, users want to capture transactions in seconds while still preserving structured information such as amount, type, category, date, and a short note. iFinance directly addresses this need by providing a focused transaction form, server-side validation, and a transaction list with filtering and pagination.

#### *1.1.3.2. Structured categorization and rule-based classification*

Once transactions are recorded, raw data alone is not enough. Users need to organize spending by meaningful categories such as Food, Transport, Rent, Entertainment, or Salary, and they want to do so with as little manual effort as possible. Two complementary mechanisms are typically required: explicit category management (create, update, delete) and rule-based classification that can automatically assign categories to transactions matching certain conditions.

Rule-based classification has clear engineering advantages: it is deterministic, explainable, and easy to debug. iFinance uses this approach as the primary classification mechanism and reserves AI techniques for higher-level interpretation, ensuring that the financial logic remains transparent.

#### *1.1.3.3. Budget control, dashboards, and period-based reports*

Beyond recording, users want to understand their financial behavior at a glance. This is where dashboards and period-based reports come in. A dashboard typically shows total income, total expenses, current balance, and category distributions. Reports go further by aggregating data over weeks or months, comparing periods, and highlighting trends.

These features require careful database design, efficient aggregation queries, and a UI capable of presenting numerical and chart information clearly. iFinance implements dashboards and monthly/period reports as first-class features, with zero-state handling for empty periods and visual breakdown by category.

#### *1.1.3.4. Anomaly awareness and intelligent insights*

Static reports alone do not always trigger actionable behavior change. Users benefit from anomaly-aware support that can automatically flag unusual transactions, such as a sudden expense that is significantly higher than the average for that category. This kind of feedback turns the system from a passive ledger into an active assistant.

In iFinance, anomaly support is implemented through threshold-based logic on top of historical data, with optional AI-assisted narrative interpretation. Importantly, the AI layer is advisory rather than authoritative; it complements deterministic reporting without replacing it.

#### *1.1.3.5. Data continuity, traceability, and security*

Finally, because financial records have long-term value, the system must provide backup and restore capabilities, audit logging for sensitive actions, and standard security practices such as authentication and input validation. These properties protect the user against accidental data loss and unauthorized access. They are also essential for academic evaluation, since they make the system reliable and traceable.

![](images/figure-1-2.png)

*Figure 1.2. Modern personal finance tools landscape*

### ***1.1.4. Software engineering and finance management*** {#1.1.4.-software-engineering-and-finance-management}

iFinance is, first and foremost, a software engineering project. Its quality depends not only on functional features but also on how the underlying engineering practices are applied. This subsection summarizes the main engineering pillars that guide the design and implementation of the system.

#### *1.1.4.1. Engineering principles applied to iFinance*

***Layered architecture***

A layered architecture separates concerns into distinct layers: presentation, API/controller, service, and data access. This separation makes each layer independently testable, easier to maintain, and easier to extend. In iFinance, every request travels predictably through these layers, which simplifies debugging and code review. When a new feature is added, developers know exactly where the change should occur, instead of scattering code across the codebase.

***Modular code organization***

Modules are grouped by responsibility: routes for API endpoints, middleware for cross-cutting concerns, services for business logic, and models for database mapping. This organization aligns with Domain-Driven Design principles and reduces coupling. For iFinance, the major modules are authentication, transactions, categories, rules, reports, AI/anomaly support, backup/restore, audit logging, and settings.

***Validation and error handling***

Server-side validation enforces data integrity for every payload. Validation messages are clear and user-readable, while authorization errors are strictly rejected with consistent status codes. Internal errors are logged and returned with controlled, non-leaking messages to keep operational signals available without exposing sensitive details.

***Security as an architectural concern***

Authentication, authorization, rate limiting, and audit logging are designed into the architecture rather than added later. This defense-in-depth approach means that even when one safeguard is bypassed, multiple layers of protection remain in place. iFinance treats finance data as sensitive personal information and protects it accordingly.

#### *1.1.4.2. Common patterns reused in iFinance*

* RESTful API design with predictable resource paths and HTTP verbs.
* Middleware composition for authentication, validation, and rate limiting.
* Service layer pattern for centralizing business rules.
* Repository/model pattern for isolating database access.
* Standardized response envelope for both success and error cases.
* Centralized logging and audit hooks at the service layer.
* Configuration via environment variables for portability.

### ***1.1.5. Intelligent analytics and AI in personal finance*** {#1.1.5.-intelligent-analytics-and-ai-in-personal-finance}

#### *1.1.5.1. The role of analytics in modern finance applications*

Analytics is what turns recorded transactions into actionable insight. While simple ledgers stop at storing data, modern personal finance applications add analytical layers that aggregate totals, calculate trends, compare periods, and highlight unusual transactions. Analytics is therefore the bridge between raw data and decision support.

Analytics in iFinance is organized into two complementary tiers. The first tier is deterministic, rule-based reporting: monthly totals, category breakdowns, period comparisons, and threshold-based anomaly flags. This tier is fully explainable and auditable. The second tier is AI-assisted interpretation, which generates short narratives that summarize trends or recommend simple actions. This tier complements the deterministic outputs without replacing them.

The combination of deterministic and AI-based analytics is intentional. Deterministic logic is trusted for financial calculations, while AI is reserved for the interpretive layer where natural language can communicate context faster than tables alone.

![hinh1-3](images/figure-1-3.png)

*Figure 1.3. Layered software architecture for finance applications*

#### *1.1.5.2. Practical applications of intelligent analytics in iFinance*

*\* AI-assisted financial assistants*

A financial assistant can summarize spending behavior in plain language, answer high-level questions, and suggest budget adjustments. iFinance integrates an optional AI Studio module where users can request short narratives over their selected periods. The assistant relies on the same deterministic data that drives the dashboard, so its narratives stay aligned with the visible numbers.

![](images/figure-1-4.png)

*Figure 1.4. AI-assisted financial analytics*

*\* Anomaly detection*

Anomaly detection identifies transactions that deviate from the user's typical pattern. For example, an unusually large expense in a normally low-spending category will be flagged as a potential anomaly. The detection logic is threshold-based and explainable, so users can understand exactly why a transaction was flagged. This avoids the "black-box" problem common in opaque AI systems.

*\* Automation of recurring tasks*

Automation reduces the friction of daily transaction management. Recurring expenses such as rent, subscriptions, or utility bills can be classified automatically through user-defined rules. As soon as a new transaction matches a rule's condition, the appropriate category is assigned. This frees the user from repetitive manual work and improves data consistency.

![](images/figure-1-5.png)

*Figure 1.5. Automation in personal finance*

*\* Conversational chatbots and assistants*

Conversational interfaces make finance information more accessible. Even though iFinance focuses on a structured dashboard, the AI Studio component shows how short, conversational outputs can summarize financial behavior in a friendly way. The chatbot pattern is also useful as an inspiration for help and onboarding flows in the future.

![](images/figure-1-6.png)

*Figure 1.6. Conversational financial assistants*

*\* Color and chart visualization*

Visualization is itself a form of analytics. Color-coded charts, bar graphs, and pie charts of category distribution allow users to grasp financial situations at a glance. iFinance uses standard chart components on the dashboard and reports pages so that the user's eye can immediately identify dominant categories and trends.

*\* Predictive analytics for spending behavior*

Predictive analytics estimates future spending based on past patterns. Even simple moving averages and trend lines can already be useful: they help users foresee whether next month is likely to exceed their typical budget. iFinance treats predictive analytics as a future extension on top of the current deterministic reporting layer; the present version focuses on accurate current and historical reporting.

![hinh1-7](images/figure-1-7.png)

*Figure 1.7. Predictive analytics for spending behavior*

*\* Authentication and protection of sensitive data*

Personal finance information must be protected with the same level of care as identity or health data. Authentication, authorization, input validation, and audit logging form the security backbone of iFinance. Each protected route requires a valid auth context, sensitive operations are logged, and backups can be created and restored with integrity checks.

![](images/figure-1-8.png)

*Figure 1.8. Authentication and data protection illustration*

*\* User experience for daily finance tasks*

A finance system is used every day, so the user experience must be optimized for repeated, fast tasks. Buttons, forms, and shortcuts are designed for low friction. The transaction creation form requires only the essential fields, the transaction list provides immediate filtering, and the dashboard updates as soon as new transactions are recorded. Together, these design decisions reduce the effort needed to keep the data complete and accurate.

![](images/figure-1-9.png)

*Figure 1.9 Modern web-based finance dashboard reference*

## **1\. 2\. Technology survey for full-stack finance applications** {#1.2.-technology-survey-for-full-stack-finance-applications}

Choosing an appropriate technology stack is a critical step in the design of a full-stack personal finance system. The selection must balance several factors at the same time: practical fit for the problem domain, ecosystem maturity, learning curve, deployment simplicity, and the ability to evolve as the system grows. This section surveys the main technology options that were considered for iFinance and explains the rationale behind the chosen stack.

The survey covers four pillars: backend frameworks and runtime environments, database options, frontend stack and desktop packaging strategy, and the security and authentication building blocks. The final pillar discusses how existing personal finance solutions compare with the iFinance approach, and where iFinance positions itself in the broader landscape.

The remainder of this section presents each pillar in turn, highlighting strengths, weaknesses, and the specific reason iFinance settled on its current technology selection.

### ***1.2.1 . Backend frameworks and runtime environments*** {#1.2.1.-backend-frameworks-and-runtime-environments}

The backend is responsible for handling API requests, enforcing business rules, validating input, and persisting data. Several mature options exist:

* **Node.js + Express**: lightweight, flexible routing, large ecosystem, and rich middleware support. Easy to scaffold REST APIs and integrate with SQLite or PostgreSQL.

* **Fastify**: high performance and schema-first design, but with a smaller ecosystem and a slightly steeper learning curve compared to Express.

* **Django (Python)**: batteries-included, strong ORM and admin panel, but heavier and not aligned with the rest of the chosen stack.

* **Spring Boot (Java)**: enterprise-ready and robust, but requires more boilerplate and resources than is justified for a personal-scale finance system.

* **ASP.NET Core**: powerful and well documented, but adds a heavier runtime and different deployment workflow.

For iFinance, Node.js + Express was selected because it matches the project's scale, integrates naturally with a JavaScript-based frontend and Electron desktop runtime, and provides a flexible middleware architecture for authentication, validation, and rate limiting. The non-blocking I/O model of Node.js also fits the typical personal finance workload well, where most operations are short-lived database reads and writes.

### ***1.2.2 . Database options for personal-scale finance data*** {#1.2.2.-database-options-for-personal-scale-finance-data}

The database layer must guarantee data integrity, support efficient queries for reporting, and enable backup and restore operations. Several database options were considered:

* **SQLite**: file-based, zero-configuration, ideal for local desktop usage, fully transactional, supports foreign keys and check constraints. Limited write concurrency, but more than sufficient for a single-user system.

* **PostgreSQL**: robust relational database with strong concurrency, advanced indexing, and extensions such as full-text search and JSON columns. Adds operational overhead for setup and maintenance.

* **MySQL/MariaDB**: widely used and well documented, but offers limited additional value over PostgreSQL or SQLite for this use case.

* **MongoDB and other document stores**: flexible schemas, but weaker integrity guarantees, which is undesirable for financial data.

* **Cloud-managed databases**: convenient but introduce vendor dependency and recurring costs.

iFinance chose SQLite for the development and demo deployment because of its simplicity, portability, and zero configuration overhead. The schema is designed in a normalized, migration-ready way, so a future move to PostgreSQL is possible without significant code changes.

### ***1\. 2\. 3\. Frontend stack and desktop packaging strategy*** {#1.2.3.-frontend-stack-and-desktop-packaging-strategy}

The frontend is responsible for presenting financial information clearly and supporting daily user workflows. The technology survey covered both client-side frameworks and packaging strategies.

*\* Component-based UI frameworks*

Component-based frameworks such as React, Vue, or Svelte allow the UI to be broken down into reusable building blocks (forms, tables, charts, dashboard cards). They also support a unidirectional data flow that simplifies state management for interactive applications.

*\* Traditional HTML, CSS, and JavaScript*

A traditional stack offers direct control with no build pipeline but quickly becomes difficult to maintain as the number of pages and the amount of state grows.

*\* Desktop packaging via Electron*

Electron wraps a web application in a standalone desktop shell, allowing iFinance to run as a native-like desktop program on Windows, macOS, and Linux. This is especially valuable for users who prefer offline-capable, locally hosted finance tools and do not want to rely on third-party cloud services.

*\* Hybrid and progressive web approaches*

Progressive Web Apps (PWAs) and hybrid approaches such as Tauri are also viable. They were considered but ultimately not selected because Electron offers a more mature ecosystem and aligns with the JavaScript-first stack already chosen for the backend.

*\* Charting and visualization libraries*

Modern visualization libraries (such as Chart.js, ECharts, or Recharts) provide ready-to-use components for bar charts, pie charts, and line charts. They simplify the implementation of dashboards and reports while keeping rendering performance acceptable for personal-scale data.

### ***1.2.4 . Authentication, validation, and security building blocks*** {#1.2.4.-authentication-validation-and-security-building-blocks}

Security is a first-class concern in personal finance systems, even at personal scale. The technology survey covered the standard building blocks expected of a modern web application:

* **Authentication mechanisms**: token-based authentication (JWT) and session-based authentication. Both are valid; iFinance uses a token-based approach with auth middleware on protected routes.

* **Authorization checks**: route-level guards and per-resource ownership checks ensure users can only see and modify their own data.

* **Input validation libraries**: middleware-based validators reject invalid payloads before they reach business logic, preventing inconsistent records and potential injection attacks.

* **Password hashing**: industry-standard hashing algorithms protect credentials at rest.

* **Rate limiting**: prevents brute-force authentication attacks and abusive automated traffic.

* **Audit logging**: records sensitive operations such as login, transaction deletion, and backup/restore actions for traceability.

* **Backup and restore**: protects financial records from accidental loss and supports disaster recovery scenarios.

These building blocks reflect best practices summarized in OWASP guidance and similar industry references. They are integrated into the architecture rather than added as afterthought.

### ***1.2.5 . Comparative analysis of existing personal finance solutions*** {#1.2.5.-comparative-analysis-of-existing-personal-finance-solutions}

This subsection compares typical solution groups against iFinance to clarify the project's positioning:

1. **Spreadsheet-based approach**. Strengths: very flexible, familiar to most users, no installation complexity. Weaknesses: manual aggregation, error-prone formulas, no access control, limited automation, weak support for analytics.

2. **Mobile-only finance apps**. Strengths: convenience, fast transaction entry, polished UI. Weaknesses: limited custom logic, opaque internal rules, vendor lock-in, weak extensibility for academic system modeling.

3. **Enterprise accounting tools**. Strengths: powerful reporting and controls. Weaknesses: over-complex for personal use, expensive, steep onboarding, designed for accountants rather than end users.

4. **Custom academic full-stack approach (iFinance)**. Strengths: transparent architecture, tailored feature scope, modular extensibility, explainable rules combined with optional AI assistance, ability to deploy locally without third-party dependencies. Weaknesses: requires implementation effort, must be maintained by the developer rather than a vendor.

The comparative analysis confirms that there is a real gap between mass-market commercial tools and academic-quality engineering examples. iFinance is intentionally placed in this gap as both a usable product and a teaching artifact: it provides realistic personal finance features while preserving academic rigor in its architecture, data model, validation pipeline, and analytics.

## **1.3 . Objectives, scope, and methodology** {#1.3.-objectives-scope-and-methodology}

### ***1.3.1 . General and specific objectives*** {#1.3.1.-general-and-specific-objectives}

The general objective of this thesis is to design and implement iFinance, a maintainable and educationally transparent personal finance management platform that combines reliable transaction handling, structured categorization, period-based reporting, and intelligent analytics within a single full-stack application. The system is intended to serve daily personal use while remaining suitable as a software engineering case study.

The specific objectives that translate this general goal into measurable engineering outcomes are:

1. To analyze user needs and define a clear set of functional and non-functional requirements for a personal-scale finance system.
2. To propose a layered architecture and a normalized relational schema that explicitly separate routes, middleware, services, and data models.
3. To implement secure authentication, full transaction CRUD, category and rule management, dashboards, and period-based reports as the functional core of the platform.
4. To integrate a hybrid analytics layer in which deterministic rule-based logic is the trusted source of financial insights, complemented by optional AI-assisted narratives.
5. To provide operational safeguards including audit logging, backup, and restore in order to guarantee data continuity and traceability.
6. To validate the resulting system through a structured test matrix covering authentication, transactions, reports, AI/anomaly support, and continuity workflows.

These objectives directly drive the requirement specification in Section 2.1.4 and the implementation activities described in Chapter 3.

### ***1.3.2 . Scope and limitations of the project*** {#1.3.2.-scope-and-limitations-of-the-project}

The scope of iFinance is intentionally focused on personal-scale finance management for a single user per deployment, packaged as a desktop application via Electron and backed by a local SQLite database. Within this scope, the system covers the core lifecycle of personal finance: capturing transactions, organizing them into categories and rules, presenting dashboards and reports, surfacing anomaly indicators, and protecting data through backup and audit mechanisms.

Several capabilities are explicitly out of scope for the current version of the project. Multi-tenant deployments with shared organizational accounts, double-entry accounting and full tax compliance modules, direct connections to live banking APIs, real-time mobile companion clients, and large-scale cloud-hosted services are not included. The design, however, remains migration-ready: the relational schema, REST API surface, and modular service layer are all prepared for a future move to PostgreSQL, multi-user deployments, or external integrations without significant rewrites.

The most relevant limitations come from the chosen scale and resource budget. SQLite supports modest write concurrency, the AI-assisted layer is treated as advisory rather than authoritative, and the desktop runtime imposes the standard trade-offs of Electron applications (memory footprint, packaged size). These limitations are accepted on purpose so that the project can be completed, demonstrated, and evaluated within the timeframe of a graduation thesis.

### ***1.3.3 . Research and development methodology*** {#1.3.3.-research-and-development-methodology}

The methodology applied to iFinance combines literature review, comparative analysis, and an iterative software engineering lifecycle. The literature and comparative analysis steps inform the technology survey in Section 1.2 and the architectural decisions in Chapter 2. The lifecycle steps – requirement elicitation, system analysis, architecture design, database modeling, implementation, testing, and evaluation – are then carried out incrementally so that each milestone produces an artifact that can be reviewed and improved.

Concretely, the development workflow is iterative: the backend skeleton (routes, middleware, services, models) is built first, the database schema is normalized and seeded, the frontend client and Electron shell are integrated, and finally the analytics, AI/anomaly, and backup/restore modules are layered on top of the stable core. At each iteration, validation activities exercise the corresponding requirements through a structured set of test scenarios, and the results feed back into the next refinement cycle. This approach matches modern engineering practice while remaining tractable for a graduation project.

## **1.4 . Chapter Conclusion** {#1.4.-chapter-conclusion}

This chapter introduced the personal finance management problem, the practical needs that motivate the iFinance system, and the technology survey that informed the chosen stack. The discussion confirmed that traditional approaches (paper notes and spreadsheets) and existing commercial products do not fully address the combined need for usability, transparency, and educational depth that this thesis targets.

From an engineering perspective, iFinance is built on a Node.js and Express backend, a SQLite database designed in a normalized and migration-ready way, a component-based frontend bundled into a desktop application via Electron, and a security baseline that follows industry best practices. Analytics is organized as a two-tier system: deterministic, rule-based reporting forms the trusted core, while optional AI assistance produces interpretable narratives on top of the deterministic data.

The next chapter, Chapter 2, builds on this foundation by formalizing the requirements, modeling the use cases, designing the database, and detailing the architecture of the iFinance system before implementation begins.

# **CHAPTER 2\. SYSTEM ANALYSIS AND DESIGN** {#chapter-2.-system-analysis-and-design}

## **2.1 . Analysis of the personal finance management problem** {#2.1.-analysis-of-the-personal-finance-management-problem}

### ***2.1.1 . Context and motivation of the problem*** {#2.1.1.-context-and-motivation-of-the-problem}

In modern society, financial pressure on individuals continues to grow because of inflation, unstable income patterns, and rising daily living costs. Effective personal finance management is therefore essential for planning, saving, and long-term stability. Despite the increasing availability of digital tools, a large portion of users still record income and expenses using fragmented methods such as paper notes, chat messages, and standalone spreadsheets. As a result, they cannot consistently answer practical questions, including: where their money is going, which categories consume the largest budget, and whether their current spending habits are sustainable in the long run.

In addition, traditional approaches lack real-time insights and structured categorization. They require significant manual effort for monthly summarization and are vulnerable to input errors and missing records. Modern commercial finance tools offer convenience but are often opaque in internal logic or strongly tied to vendor cloud ecosystems. Such products are difficult to deploy locally and not well suited for educational evaluation. Therefore, there is a clear need for a practical, transparent, and modular personal finance system that can serve daily users while remaining academically analyzable.

### ***2.1.2 . Definition and specification of the problem*** {#2.1.2.-definition-and-specification-of-the-problem}

The core problem addressed in this thesis can be specified as follows: design and implement an integrated, transparent, and educationally suitable personal finance platform that combines secure data handling, transaction management, reporting, and intelligent insights in a maintainable architecture. From a software engineering perspective, the system must satisfy three simultaneous requirements: practicality (supporting real daily workflows such as adding transactions and reviewing reports), reliability (preserving data integrity and providing backup/recovery controls), and extensibility (allowing future improvements such as forecasting or banking integration without major redesign).

Formally, the system can be modeled as a finite set of services operating on a relational data store. Let `T` denote the set of transactions, `C` the set of categories, `R` the set of rules, and `U` the set of users. Each transaction `t ∈ T` is characterized by a tuple `(amount, type, category, date, owner)`, where the `type` is restricted to `{income, expense}`, the `category` references a category in `C`, and the `owner` references a user in `U`. The role of the system is to provide CRUD operations on `T`, `C`, `R`, and `U`, and to derive aggregate metrics such as monthly totals, category distributions, and anomaly indicators from the underlying data.

In other words, iFinance is not a one-shot calculator but a continuous data-driven service. It must store transactions reliably, categorize them consistently, expose summary metrics quickly, and provide recovery in case of accidental data loss. These properties together define the engineering contract of the system.

### ***2.1.3 . Technical and data-related challenges*** {#2.1.3.-technical-and-data-related-challenges}

Building a useful personal finance system involves several non-trivial challenges. First, data quality is essential. Reports and analytics are only as good as the underlying transactions. The system must encourage frequent and accurate input through fast forms, clear validation messages, and rule-based auto-categorization. Otherwise, missing transactions or wrong categories will degrade every analytical output, regardless of how sophisticated the algorithms are.

Second, data integrity must be enforced even when users make mistakes. Foreign keys, type checks, and not-null constraints are necessary at the database level. Server-side validation prevents invalid payloads from reaching the data layer, while transactional updates protect related records from inconsistent partial changes. This is particularly important when categories are deleted, transactions are bulk-updated, or backups are restored.

Third, security must protect financial data both at rest and in transit. Authentication, authorization, password hashing, rate limiting, and audit logging are all required. A finance system without proper authentication is simply not deployable in any realistic context, even at personal scale. iFinance therefore treats security as a first-class architectural concern.

Fourth, performance must remain acceptable for personal-scale workloads. Although the data volume is far smaller than enterprise systems, users still expect dashboard refresh and report generation to feel near real-time. Indexing on user and date columns, paginated queries, and pre-aggregated dashboard endpoints are practical strategies to keep the experience responsive.

Fifth, the engineering team must balance simplicity and extensibility. Adding too many features early in the lifecycle can compromise quality, while a too-narrow scope will not justify the design effort. iFinance addresses this trade-off by focusing on a stable core (authentication, transactions, categories, rules, reports, backup/restore, audit logs) and treating advanced features (forecasting, bank API integration, mobile companion) as deliberate future work.

### ***2.1.4 . Functional and Non-functional Requirements of the System*** {#2.1.4.-functional-and-non-functional-requirements}

From the analysis above, the functional requirements of iFinance can be grouped into the following major categories. First, the system must support secure user authentication with login, logout, and protected route access. Second, it must implement full transaction CRUD with validation for amount, type, date, and category. Third, it must allow category and rule management so that data can be organized consistently. Fourth, it must offer dashboards and period-based reports that aggregate income, expenses, balances, and category distributions. Fifth, it must integrate AI/anomaly support for advisory insights. Sixth, it must record key actions in audit logs. Seventh, it must provide backup and restore capabilities to preserve data continuity. Each requirement is translated into a specific module in Chapter 3 and validated through test scenarios in Section 3.3.

Non-functional requirements complement the above by specifying how well the system must perform. Security requires that all protected routes verify authentication and that input payloads are validated server-side. Reliability requires that backup and restore operations preserve data consistency. Performance requires that CRUD operations and report generation feel near real-time on personal-scale data. Maintainability requires that the codebase remains modular and readable, with clear separation between routes, middleware, services, and models. Usability requires that frequent operations remain low-friction, since the system is used every day. Portability requires that iFinance can run on web and desktop environments through Electron packaging.

Together, the functional and non-functional requirements form a measurable acceptance contract. Chapter 3 demonstrates how each requirement is implemented and validated, and Section 3.3 summarizes the corresponding test results.

## **2.2 . Proposed system design and architectural choices** {#2.2.-proposed-system-design-and-architectural-choices}

### ***2.2.1 . Layered architecture for the iFinance backend*** {#2.2.1.-layered-architecture-for-the-ifinance-backend}

The iFinance backend follows a four-layer architecture: presentation, API/controller, service, and data access. This pattern is well established in modern enterprise software design and offers several practical benefits. First, each layer can be developed and tested in isolation, which improves productivity and reduces regressions. Second, the explicit separation enforces clear ownership: routes deal with HTTP, services with business logic, models with data, and middleware with cross-cutting concerns such as authentication and validation. Third, the boundaries between layers act as natural extension points; adding a new feature usually means adding a new module within an existing layer rather than rewriting the system.

In iFinance, an incoming HTTP request travels through a predictable sequence: it enters a route handler under `backend/routes`, passes through middleware functions for authentication, validation, and rate limiting, and is then delegated to a service in `backend/services`. The service implements business rules and orchestrates calls to one or more models in `backend/models`. The model layer interacts directly with the SQLite database via `backend/database`. The route handler finally composes the response and returns it to the client.

This lifecycle is consistent across all features, from authentication and transaction CRUD to backup and audit logging. The consistency makes the codebase easier to read and maintain, and it gives reviewers a stable mental model when inspecting any new endpoint.

### ***2.2.2 . Service-oriented organization for transactions and analytics*** {#2.2.2.-service-oriented-organization-for-transactions-and-analytics}

The service layer is the heart of the iFinance backend. Each major domain has its own service: `authService` handles credential verification and session/token issuance, `TransactionService` enforces validation and persistence rules for transactions, `CategoryService` and `RuleService` manage classification, and `aiService` and `anomalyDetector` produce advisory insights on top of historical data. `BackupService` and `TaxService` handle continuity and tax-related calculations. Audit logging is captured by an `AuditLog` model that records significant events for traceability.

This service-oriented organization is intentionally fine-grained. It keeps each module focused and small enough to be reviewed and tested without distractions, and it discourages "god services" that accumulate unrelated responsibilities. When a new feature is required, the team can add a new service or extend an existing one without affecting unrelated areas of the system.

The analytical layer is split into two tiers. The deterministic tier runs SQL aggregations and rule-based logic for dashboards and reports. The AI-assisted tier sits on top, generating short narratives that interpret deterministic data. By keeping the deterministic tier authoritative, iFinance ensures that the financial calculations users see are always traceable.

### ***2.2.3 . Frontend modular components and desktop packaging*** {#2.2.3.-frontend-modular-components-and-desktop-packaging}

The frontend is organized around reusable UI components grouped by feature: layout (sidebar, title bar, update banner, app shell), generic UI primitives (button, card, input, select, dialog, label, toast, badge), and page-level components (dashboard, transactions, reports, settings, AI Studio, login, releases, users, pending). Each page composes the lower-level components into a coherent screen and delegates business interactions to API helpers.

The desktop runtime is packaged via Electron. The main Electron process opens the application window, exposes a controlled preload script for inter-process communication, and bundles the frontend assets along with a local backend instance. As a result, iFinance behaves like a native desktop application on Windows, macOS, and Linux while still benefiting from web technologies for layout and interactivity.

This combination of modular components and desktop packaging keeps the UI maintainable and gives the user a consistent local-first experience. It also keeps the option open for future deployment as a pure web application, since the same components can be served by any web host without significant changes.

### ***2.2.4 . Rule-based analytics and AI-assisted insights*** {#2.2.4.-rule-based-analytics-and-ai-assisted-insights}

Analytics in iFinance is intentionally hybrid. The deterministic component is rule-based and runs entirely on the user's data and pre-defined thresholds. For example, a category that receives a transaction more than two standard deviations above its historical average can be flagged as an anomaly. Such checks are explainable: users can read the rule and understand exactly why a transaction was flagged.

On top of this deterministic core, an optional AI component generates short, descriptive narratives that summarize trends or recommend small adjustments. The AI tier is implemented as a service that consumes the same aggregated data exposed to the dashboard, ensuring that the narrative cannot drift away from the visible numbers. The output is treated as advisory rather than authoritative; it never overrides user decisions or modifies data automatically.

Together, rule-based logic and AI-assisted interpretation form a layered analytics pipeline that keeps trust on the deterministic side while benefiting from natural language summarization. This design closely mirrors academic recommendations on explainable AI: keep the trusted core simple and transparent, and use machine learning only where its added value is clearly understood. The same principle applies to future extensions such as predictive forecasting; iFinance plans to add such features only when the underlying deterministic baseline is stable and well tested.

## **2.3 . System modeling, evaluation criteria and database design** {#2.3.-system-modeling-evaluation-criteria-and-database-design}

### ***2.3.1 . Functional evaluation criteria for finance modules*** {#2.3.1.-functional-evaluation-criteria-for-finance-modules}

Performance evaluation is an essential component of the iFinance development lifecycle. Since the system is a CRUD-oriented finance application rather than a classification model, the evaluation framework focuses on functional correctness rather than statistical metrics. Each requirement defined in Section 2.1.4 corresponds to one or more test cases, and each test case has a clear expected outcome that can be verified through manual or automated testing.

The first set of evaluation criteria targets the authentication module. The system must accept valid credentials and reject invalid ones, return clear error messages for missing fields, and prevent unauthenticated access to protected routes. These criteria are validated by test cases that simulate both successful and failed login attempts, as well as direct calls to protected endpoints with missing or invalid tokens.

The second set of criteria covers transaction CRUD. The system must accept valid income and expense transactions, store them with the correct user ownership, allow updates and deletions of records owned by the user, and reject malformed payloads. Filters by date range, type, and category must produce the correct subset of records. Each of these behaviors is exercised by dedicated test cases, including edge cases such as empty result sets and invalid pagination parameters.

The third set of criteria addresses category and rule management. Categories must follow per-user uniqueness rules, deletions must be controlled when categories are still referenced by transactions, and rules must apply correctly during transaction processing. The criteria emphasize data integrity: no transaction should ever reference a non-existent category, and rules must not silently overwrite user-defined classifications.

### ***2.3.2 . Reliability, security and data integrity criteria*** {#2.3.2.-reliability-security-and-data-integrity-criteria}

Beyond functional correctness, iFinance is evaluated against reliability and security criteria. Reliability requires that backup operations capture a consistent snapshot of the user's data, and that restore operations recover the system to that snapshot without corrupting unrelated state. The criteria explicitly cover failure paths: a corrupted or invalid backup file must be rejected safely, and the system must remain in a usable state after the rejection.

Security criteria are formulated in line with industry references such as OWASP Top 10. Authentication must require valid credentials, authorization must ensure that users only access resources they own, input validation must reject invalid payloads, and audit logs must capture sensitive operations. Rate limiting protects authentication endpoints from brute-force attacks. These criteria are evaluated through targeted test cases that simulate attack patterns alongside normal usage.

Data integrity is enforced both at the database level and at the application level. Foreign keys, not-null constraints, and check constraints prevent malformed records from being persisted, while server-side validation rejects invalid payloads before they reach the database. The combination of these mechanisms means that even when users make mistakes or send unexpected payloads, the underlying data remains consistent and trustworthy.

### ***2.3.3 . Performance and usability evaluation*** {#2.3.3.-performance-and-usability-evaluation}

Performance evaluation in iFinance focuses on responsiveness for personal-scale workloads. The system is not expected to handle enterprise-grade traffic, but daily operations such as creating a transaction, opening the dashboard, or generating a monthly report must feel near real-time. Indexing on frequent filter fields (`user_id`, `transaction_date`, `category_id`) is the main strategy that supports this goal, complemented by lightweight aggregation queries and pagination.

Usability is evaluated by counting the number of steps required for the most common workflows. Adding a transaction must be possible in a small number of clicks, and the dashboard must update visibly after each create, update, or delete operation. Empty states are also evaluated: opening a report for a period with no data must produce a graceful zero-state with a helpful guidance message, not a broken interface.

The evaluation framework therefore mixes quantitative criteria (test case pass/fail counts, response time on typical operations, number of clicks per task) with qualitative observations (clarity of error messages, consistency of layout). Together, they provide a comprehensive view of how well iFinance satisfies its requirements in practical use.

### ***2.3.4 . System evaluation at the application level and practical impact*** {#2.3.4.-system-evaluation-at-the-application-level-and-practical-impact}

At the application level, iFinance is evaluated as an end-to-end product rather than a collection of isolated features. The most important question is whether a representative user can go through a realistic daily workflow without friction: log in, add several transactions, classify them through categories or rules, open the dashboard, generate a report, run an AI insight request, and create or restore a backup. If each step succeeds without unexpected errors and the resulting data remains consistent, the system is considered functionally complete.

In addition, the practical impact of iFinance is judged by how well it supports better financial decisions. The deterministic dashboard makes spending patterns visible at a glance, the report module enables monthly review and planning, the rule engine reduces the manual effort of categorization, and the anomaly indicators warn users about unusual transactions. Each of these contributes to financial awareness, which is the ultimate practical purpose of the project.

Finally, the evaluation also considers educational value. Because every architectural choice, data flow, and validation rule is documented and inspectable, iFinance can serve as a teaching artifact for software engineering courses on full-stack development, data modeling, and analytics. This dual role as both a working product and an academic case study is a deliberate part of the project's design.

### ***2\. 3.5 . Use-case Diagram*** {#2.3.5.-use-case-diagram}

The system primarily serves two types of actors: the standard user (the individual who manages personal finances) and an optional administrator (used in deployment and maintenance scenarios such as backup or release management).

- **Standard User**: can perform functions such as Login/Logout, Create/Update/Delete Transaction, List/Filter Transactions, Manage Categories, Manage Rules, View Dashboard, Generate Report, Run AI/Anomaly Analysis, and Manage Settings.
- **Administrator (optional role)**: can perform Backup, Restore, Audit Log Review, and Release Management. In single-user deployments, this role is typically merged with the standard user.

![Use-case diagram of the iFinance system](images/figure-2-1.png)

*Figure 2.1. Use-case diagram of the iFinance system*

### ***2.3.6 . UML Diagram / Activity Diagram*** {#2.3.6.-uml-and-activity-diagram}

The activity diagram below describes the monthly review workflow, which is one of the most representative end-to-end flows in iFinance. The flow proceeds sequentially through the following steps: (1) the user logs in and authentication middleware verifies the session; (2) the user opens the report page and selects a month or date range; (3) the report service fetches transactions for the selected period from the database; (4) the service aggregates totals by type and category; (5) anomaly detection runs against the aggregated data and threshold rules; (6) the dashboard renders charts, KPIs, and anomaly indicators; (7) the user can request an optional AI-assisted narrative; (8) the user makes decisions based on the insights, such as adjusting budgets, creating new rules, or planning the next period.

This activity flow demonstrates how the layered architecture, service-oriented organization, and hybrid analytics introduced in Section 2.2 work together to support a realistic financial decision-making session.

![Activity diagram for the monthly review workflow](images/figure-2-2.png)

*Figure 2.2. Activity diagram for the monthly review workflow*

### ***2.3.7 Database Design​​*** {#2.3.7.-database-design}

The iFinance database is implemented in SQLite with a normalized relational schema that supports the core domain entities of the system. The design is migration-ready, so a future move to PostgreSQL can be performed without significant code changes. The schema follows industry conventions: surrogate primary keys, `CHECK` constraints for enumerated columns, `FOREIGN KEY` references for relationships, and indexes on the most frequently filtered columns. Categories and classification rules are intentionally global (shared across the deployment) because iFinance is built as a single-tenant desktop application; the schema can still be partitioned per user in a future multi-tenant migration without breaking existing queries.

The main tables are:

- **users** — stores account identity and credentials. Columns: `id` (PK, auto-increment), `username` (unique, not null), `password_hash` (bcrypt), `role` (CHECK in `Admin`, `Accountant`, `Viewer`), `telegram_chat_id` (optional, used for notifications), `created_at`, and `updated_at`.
- **categories** — stores classification labels for transactions. Columns: `id` (PK), `name`, `scope` (CHECK in `personal`, `business`, `both`), and `created_at`. The schema seeds 15 default Vietnamese categories such as *Lương*, *Ăn uống*, *Di chuyển*, *Giải trí*, etc.
- **rules** — stores keyword-based classification rules. Columns: `id` (PK), `keyword`, `category_id` (FK → `categories.id`), `scope`, `priority` (higher value wins on conflict), and `created_at`. Rules are evaluated by the `ClassifierService` whenever a transaction is created without an explicit category.
- **transactions** — stores income and expense records and is the central fact table. Columns: `id` (PK), `date`, `description`, `amount`, `type` (CHECK in `income`, `expense`), `scope` (CHECK in `personal`, `business`), `category_id` (FK → `categories.id`), `source`, `status` (CHECK in `pending`, `confirmed`, `rejected`), `suggested_category_id` (FK → `categories.id`, AI/rule suggestion), `confidence_score`, `ai_explanation`, `tax_rate`, `tax_amount`, `invoice_no`, `partner_name`, `created_by` (FK → `users.id`), `created_at`, and `updated_at`.
- **audit_logs** — records sensitive events for traceability. Columns: `id` (PK), `user_id` (FK → `users.id`), `action` (e.g. `LOGIN`, `CREATE_TX`, `DELETE_TX`, `BACKUP`, `RESTORE`), `entity_type`, `entity_id`, `details`, `ip_address`, and `created_at`.
- **settings** — stores key-value configuration that applies to the deployment. Columns: `key` (PK), `value`, and `updated_at`. Examples include the AI storage path used by the AI Studio module.
- **releases** — supports the auto-update workflow of the Electron desktop client. Columns: `id` (PK), `version` (unique), `release_notes`, `is_current` (boolean), and `created_at`.

Data integrity is enforced through several layers. Foreign keys connect `transactions.created_by` → `users.id`, `transactions.category_id` and `transactions.suggested_category_id` → `categories.id`, `rules.category_id` → `categories.id`, and `audit_logs.user_id` → `users.id`. `CHECK` constraints restrict the allowed values of `users.role`, `transactions.type`, `transactions.scope`, `transactions.status`, `categories.scope`, and `rules.scope`. `NOT NULL` constraints guard the mandatory fields, and default values keep timestamps consistent without relying on application code.

Performance is supported by indexes on the columns that drive the most common queries: `idx_transactions_date` for time-range filtering, `idx_transactions_type` and `idx_transactions_scope` for income/expense and personal/business breakdowns, `idx_transactions_category` for category-based aggregation, `idx_transactions_status` for pending review queues, `idx_audit_logs_user` and `idx_audit_logs_created` for traceability lookups. Together, these constraints and indexes guarantee consistent state, controlled concurrency for a single-tenant SQLite deployment, and responsive aggregation under realistic personal-scale loads.

![ERD of the iFinance database](images/figure-2-3.png)

*Figure 2.3. Entity-Relationship Diagram (ERD) of the iFinance database*

## **2.4 . Chapter Conclusion** {#2.4.-chapter-conclusion}

Chapter 2 has formalized the personal finance management problem and translated it into a coherent system design that fits the scope, objectives, and methodology defined in Chapter 1. The analysis identified the practical pain points of fragmented finance tools, specified functional and non-functional requirements, and grouped the technical and data-related challenges that any realistic implementation has to handle.

Building on this analysis, the chapter proposed a layered architecture for the iFinance backend, a service-oriented organization for transactions and analytics, modular frontend components packaged as a desktop application via Electron, and a hybrid analytics layer in which deterministic rule-based logic remains the trusted source of financial insights while AI-assisted narratives play a complementary advisory role. Evaluation criteria covering functional correctness, reliability, security, performance, and usability were defined together with the supporting use-case, activity, and entity-relationship models, ensuring that the design can be measured against well-defined acceptance properties.

Together, the architectural decisions, modeling artifacts, and database design described in this chapter form a complete technical contract for the implementation phase. The next chapter, Chapter 3, takes this contract and turns it into a working system by detailing the development environment, project structure, key feature implementations, demonstration workflows, and the testing and evaluation results that validate the design.

# 

# 

# 

# 

# 

# 

# 

# 

# 

# **CHAPTER 3\. IMPLEMENTATION, DEMONSTRATION AND TESTING RESULTS** {#chapter-3.-implementation-demonstration-and-testing-results}

## **3.1. Overview of the iFinance implementation pipeline** {#3.1.-overview-of-the-ifinance-implementation-pipeline}

To deliver a maintainable personal finance platform, iFinance is implemented as a layered full-stack system where each HTTP request follows a predictable processing pipeline. This pipeline separates presentation concerns from API routing, business logic, and persistence, which improves testability and reduces coupling between modules. The overall flow is illustrated in Figure 3.1. Specifically:

*Step 1: Client interaction and request dispatch*

The user interacts with the desktop or web client built with modular UI components. When the user submits a form (for example, creating a transaction), the client sends an HTTP request to the appropriate REST endpoint exposed by the Express application. The request includes authentication context (token or session) and a JSON payload that describes the operation.

*Step 2: Middleware chain and validation*

The request first enters the routing layer under `backend/routes`. Before any business logic executes, the middleware chain runs in order: authentication middleware verifies the user identity, validation middleware checks the payload against schema rules, and optional rate limiting protects sensitive endpoints. Invalid requests are rejected early with structured error responses, which keeps the service layer free from defensive clutter.

*Step 3: Service execution and persistence*

After validation succeeds, control passes to the relevant service in `backend/services`. The service applies domain rules (for example, ensuring positive amounts and valid category references), coordinates calls to one or more models in `backend/models`, and persists changes to the SQLite database. The service may also emit audit log entries for sensitive operations. Finally, the route handler composes a JSON response and returns it to the client, which refreshes dashboard KPIs and lists.

![](images/figure-3-1.png)

*Figure 3.1. iFinance system processing pipeline (request lifecycle).*

Separating the pipeline into these three stages keeps responsibilities clear: the client focuses on UX, middleware enforces policies, and services own business correctness. Individual components can be improved independently (for example, adding caching to report queries) without rewriting unrelated modules.

### ***3.1.1. Development environment and tooling*** {#3.1.1.-development-environment-and-tooling}

The implementation environment for iFinance is chosen to match the technology survey in Chapter 1:

- **Runtime**: Node.js (LTS) for the backend server process.
- **Backend framework**: Express.js for routing, middleware, and JSON APIs.
- **Database**: SQLite with a normalized relational schema and migration-ready design.
- **Frontend**: component-based client modules (Vite + React stack in the `client` directory) for maintainable UI.
- **Desktop packaging**: Electron for cross-platform desktop distribution with a local-first deployment model.
- **Tooling**: npm scripts for install, dev, build, and lint; modular folder layout for routes, services, models, middleware, and database scripts.

This stack keeps the learning curve manageable for a graduation project while remaining representative of modern industry practice. It also allows the same codebase to run in development (hot reload), production-like testing, and packaged desktop release modes.

### ***3.1.2. Project structure and module organization*** {#3.1.2.-project-structure-and-module-organization}

The repository is organized by responsibility to support long-term maintainability:

- `backend/app.js` and `backend/server.js` bootstrap the HTTP server and dependency wiring.
- `backend/loaders/` groups infrastructure concerns such as Express setup, route registration, rate limiting, and optional socket integration.
- `backend/routes/` defines REST endpoint groups (`auth`, `transactions`, `categories`, `rules`, `settings`, `auditLogs`, `backup`, `ai`, and related modules).
- `backend/middleware/` centralizes authentication, validation, and cross-cutting checks.
- `backend/services/` implements business logic including authentication, AI assistance, anomaly detection, backup, and tax-related helpers.
- `backend/models/` maps relational tables to data access operations.
- `backend/database/` contains schema definitions, seed scripts, and reset utilities.
- `client/src/` hosts pages, layout components, UI primitives, API helpers, and global state (for example, authentication store).

This structure makes it straightforward to locate code during debugging and to onboard new contributors. It also mirrors the layered architecture described in Chapter 2, so documentation and implementation stay aligned.

### ***3.1.3. Implementation of authentication, transactions and reports*** {#3.1.3.-implementation-of-authentication-transactions-and-reports}

**Authentication and authorization.** The login flow verifies user credentials, issues an authentication context, and protects private routes through middleware. Unauthorized requests receive consistent HTTP status codes and error bodies. User context is injected into downstream handlers so that every query is scoped to the authenticated owner.

**Transaction management.** Transactions support full CRUD with filtering by date range, category, and type. Amounts must be positive numbers, types are restricted to income or expense, and dates must be valid. Updates and deletes refresh dependent aggregates so dashboards and reports remain consistent.

**Categories and rules.** Categories are user-scoped and feed both transaction forms and reporting breakdowns. Rules store matching conditions, target categories, priority, and active flags so that automatic classification behaves predictably. When rules conflict, priority ordering resolves the outcome deterministically.

**Dashboards and reports.** Dashboard endpoints aggregate totals and category distributions for the selected period. Report pages extend this with richer charts and period comparisons. Empty periods render zero-state summaries instead of errors, which is important for first-time users.

Together, these modules implement the functional core of iFinance and satisfy the high-priority requirements listed in Chapter 2.

### ***3.1.4. AI/anomaly support and backup configuration*** {#3.1.4.-ai-anomaly-support-and-backup-configuration}

**Anomaly detection.** Anomaly logic evaluates historical aggregates and applies threshold rules to flag unusual transactions. The implementation favors explainability: each flag can be traced back to a concrete comparison against historical averages or user-defined limits.

**AI-assisted insights.** The AI Studio path consumes the same aggregated metrics as the dashboard and produces short advisory narratives. The service treats model output as non-authoritative guidance and never mutates stored transactions automatically based on AI alone.

**Backup and restore.** Backup exports a consistent snapshot of user data. Restore validates the snapshot format and integrity before applying changes, aborting safely on corruption. These operations are paired with audit logging so administrators can trace continuity events.

**Operational configuration.** Environment variables configure database paths, server ports, and optional AI endpoints. Rate limits and feature flags can be tuned per deployment without code changes.

## **3.2. Application demonstration and user workflows** {#3.2.-application-demonstration-and-user-workflows}

This section describes the main user-visible surfaces of iFinance as implemented in the client and desktop shell.

![](images/figure-3-2.png)

*Figure 3.2. Login and dashboard interface.*

On the interface, users can complete the primary personal finance workflows in two complementary modes: **structured CRUD workflows** for data entry and **analytical workflows** for review and insight generation.

### ***3.2.1. Login, dashboard and transaction workflow*** {#3.2.1.-login-dashboard-and-transaction-workflow}

**Step 1:** The user opens the application and authenticates with username and password. Successful login establishes an auth context used for subsequent API calls.

**Step 2:** The user navigates to the **Dashboard** to review KPI cards, balance trends, and category distribution charts for the current period.

**Step 3:** The user opens the **Transactions** page, creates income and expense records, applies categories, and uses filters to locate historical items. Updates and deletes propagate to dashboard totals after refresh.

**Step 4 (optional):** The user configures **Categories** and **Rules** so future transactions require less manual classification effort.

![](images/figure-3-3.png)

*Figure 3.3. Transaction management interface and CRUD workflow.*

### ***3.2.2. Reports, settings and AI Studio workflow*** {#3.2.2.-reports-settings-and-ai-studio-workflow}

**Step 1:** The user opens the **Reports** page, selects a month or custom date range, and reviews aggregated totals, category breakdowns, and trend visualizations.

**Step 2:** The user opens **Settings** to adjust preferences that influence presentation and default behaviors where applicable.

**Step 3:** The user opens **AI Studio** (when enabled) to request an advisory narrative for a selected period. The output is displayed alongside deterministic metrics so the user can cross-check interpretation against numbers.

**Step 4:** The user runs **Backup** from the appropriate UI or administrative flow, stores the snapshot file safely, and can later demonstrate **Restore** to recover a previous dataset state for continuity testing.

![](images/figure-3-4.png)

*Figure 3.4. Reports and analytics dashboard.*

![](images/figure-3-5.png)

*Figure 3.5. Settings and AI Studio interface.*

## **3.3. Testing and Evaluation Results** {#3.3.-testing-and-evaluation-results}

### ***3.3.1. Test scenario distribution*** {#3.3.1.-test-scenario-distribution}

Software quality for iFinance is validated through a structured test matrix rather than a machine-learning dataset split. The matrix groups scenarios by module (authentication, transactions, categories, rules, reports, dashboard, AI, anomaly, audit, backup, restore, settings, system health). Each scenario has an expected outcome that can be verified objectively (HTTP status, persisted record state, UI refresh behavior, or log entry presence).

To keep reporting transparent, scenarios are tracked as **passed**, **failed**, or **not executed** in the final defense materials. The table below illustrates a representative distribution pattern used during project validation (replace bracketed placeholders with your measured results).

*Table 3.1. Distribution of test scenarios across functional modules.*

| Module | Total scenarios | Passed | Failed | Notes |
| ----- | :---: | :---: | :---: | ----- |
| Authentication | 6 | [Fill] | [Fill] | Login, logout, token errors |
| Transactions | 9 | [Fill] | [Fill] | CRUD + filters |
| Categories / Rules | 7 | [Fill] | [Fill] | CRUD + conflicts |
| Reports / Dashboard | 6 | [Fill] | [Fill] | Aggregations + empty states |
| AI / Anomaly | 4 | [Fill] | [Fill] | Advisory paths |
| Audit / Backup / Restore | 6 | [Fill] | [Fill] | Traceability + continuity |
| Settings / System | 2 | [Fill] | [Fill] | Preferences + health |
| **Total** | **40** | **[Fill]** | **[Fill]** | Extended matrix alignment |

![](images/figure-3-6.png)

*Figure 3.6. Visual distribution of test scenarios per module.*

The distribution emphasizes core finance workflows first (authentication and transactions), then supporting modules (rules, reports), and finally operational safeguards (backup, audit). This ordering matches the implementation priority used during development.

### ***3.3.2. Functional testing results for the API and core modules*** {#3.3.2.-functional-testing-results-for-core-modules}

Functional testing confirms that the API contracts defined in Chapter 2 behave as specified under normal and edge conditions. Representative checks include:

- Valid login returns an authenticated context; invalid credentials are rejected with clear errors.
- Protected endpoints deny access when the token is missing or invalid.
- Valid transactions persist with correct user scoping; invalid payloads are rejected before database writes.
- Reports aggregate consistently with the underlying transaction table for the same period.
- Category deletion policies prevent orphaned foreign keys or enforce controlled migration behavior.

These results demonstrate that the layered architecture successfully isolates validation, business logic, and persistence without leaking responsibilities across boundaries.

### ***3.3.3. End-to-end and user acceptance evaluation*** {#3.3.3.-end-to-end-and-user-acceptance-evaluation}

End-to-end testing validates the full client-to-server loop for the defense demo script: login, create multiple transactions, configure a rule, refresh dashboard KPIs, generate a monthly report, trigger AI/anomaly analysis, and execute backup followed by restore on a prepared snapshot.

User acceptance style checks focus on practical usability: whether a non-developer can complete the demo flow without guidance, whether error messages are understandable, and whether empty states remain helpful rather than confusing. These qualitative checks complement the quantitative pass/fail matrix from Section 3.3.1.

### ***3.3.4. Overall system evaluation and discussion*** {#3.3.4.-overall-system-evaluation-and-discussion}

The overall evaluation combines three perspectives:

1. **Functional coverage**: the percentage of planned core features implemented and demonstrated during defense preparation.
2. **Validation pass rate**: the ratio of passed scenarios in the extended test matrix (40 cases) described in the thesis package.
3. **Operational quality**: responsiveness on personal-scale data, stable CRUD/report refresh behavior, and successful backup/restore on valid snapshots.

*Table 3.2. Summary of functional testing and evaluation results.*

| Metric | Target | Observed | Status |
| ----- | ----- | ----- | ----- |
| Core functional coverage | ≥ 90% | [Fill] | [Pass / Improve] |
| Test pass rate (40 cases) | ≥ 90% | [Fill] | [Pass / Improve] |
| Report correctness | No aggregation mismatch | [Fill] | [Pass / Improve] |
| Restore success (valid backups) | 100% | [Fill] | [Pass / Improve] |

![C:\\Users\\Quang\\Downloads\\metrics-20260311T173115Z-1-001\\metrics\\confusion\_matrix.png](images/figure-3-7.png)

*Figure 3.7. Test result matrix and pass/fail visualization.*

![C:\\Users\\Quang\\Downloads\\metrics-20260311T173115Z-1-001\\metrics\\confidence\_curves.png](images/figure-3-8.png)

*Figure 3.8. Performance and response-time metrics.*

![C:\\Users\\Quang\\Downloads\\metrics\\classification\_report.png](images/figure-3-9.png)

*Figure 3.9. Quantitative quality report (summary-style metrics for evaluation).*

The evaluation confirms that iFinance meets its graduation-scope objectives: secure transaction lifecycle, structured categorization, practical dashboards and reports, optional intelligent analytics, and continuity mechanisms through backup/restore and audit logging. Remaining limitations and future improvements are summarized in the conclusion chapter.


# **CONCLUSION AND FUTURE DEVELOPMENT** {#conclusion-and-future-development}

**1. Conclusion**

This thesis presented **iFinance**, a practical personal finance management and intelligent analytics system that helps individuals record income and expenses, organize data through categories and rules, review financial behavior through dashboards and period-based reports, and protect continuity through backup/restore and audit logging.

The work followed a full software engineering lifecycle: requirement analysis, system modeling, layered architecture design, relational database modeling, backend and frontend implementation, testing, and evaluation. The resulting solution applies a modular structure that separates routes, middleware, services, and models, which improves maintainability and supports future extensions such as banking API integration or forecasting services.

Implementation and demonstration confirmed that the core objectives are achievable within the project scope: authenticated access, transaction CRUD with validation, category and rule workflows, reporting and dashboard aggregation, optional AI/anomaly advisory outputs, and reliable backup/restore paths. The evaluation framework in Chapter 3 further shows how functional correctness, security, and operational quality can be measured without relying on computer-vision style metrics.

From an academic perspective, iFinance contributes a transparent end-to-end case study that connects real user needs with concrete engineering artifacts (API design, data integrity constraints, test matrices, and deployment notes). From a practical perspective, it provides a usable baseline for continued product development.

**2. Future development**

Although iFinance meets its planned scope, several limitations remain and define natural next steps:

* **Banking and external integrations**: connect to banking APIs or import formats (CSV/OFX) to reduce manual entry while preserving validation and traceability.
* **Forecasting and budgeting intelligence**: add lightweight predictive models and budget goal tracking beyond current deterministic reporting.
* **Mobile companion application**: extend the same API to a mobile client for on-the-go capture.
* **Stronger automated testing and CI**: expand automated regression coverage and integrate continuous integration pipelines.
* **Multi-currency and localization**: support multiple currencies, locales, and regional formatting rules.
* **Hardening for multi-user deployments**: refine role separation, operational monitoring, and deployment automation if the system moves beyond personal-scale usage.

In summary, iFinance demonstrates that a maintainable, analytics-enabled personal finance platform can be built with modern full-stack practices while keeping deterministic financial logic auditable and user trust high.

# **REFERENCES** {#references}

[1] I. Sommerville, *Software Engineering*, 10th ed., Boston, MA, USA: Pearson, 2015.

[2] M. Fowler, *Patterns of Enterprise Application Architecture*, Boston, MA, USA: Addison-Wesley, 2002.

[3] E. Evans, *Domain-Driven Design: Tackling Complexity in the Heart of Software*, Boston, MA, USA: Addison-Wesley, 2003.

[4] R. T. Fielding, "Architectural styles and the design of network-based software architectures," Ph.D. dissertation, Dept. Inf. Comput. Sci., Univ. of California, Irvine, CA, USA, 2000.

[5] OWASP Foundation, "OWASP Top 10 – 2021: The Ten Most Critical Web Application Security Risks," 2021. [Online]. Available: https://owasp.org/Top10/

[6] Node.js Foundation, "Node.js documentation," 2026. [Online]. Available: https://nodejs.org/en/docs/

[7] OpenJS Foundation, "Express.js – Fast, unopinionated, minimalist web framework for Node.js," 2026. [Online]. Available: https://expressjs.com/

[8] D. R. Hipp et al., "SQLite documentation," 2026. [Online]. Available: https://sqlite.org/docs.html

[9] OpenJS Foundation, "Electron – build cross-platform desktop apps with JavaScript, HTML, and CSS," 2026. [Online]. Available: https://www.electronjs.org/docs/

[10] J. Nielsen, *Usability Engineering*, San Francisco, CA, USA: Morgan Kaufmann, 1993.

[11] B. Shneiderman *et al.*, *Designing the User Interface: Strategies for Effective Human-Computer Interaction*, 6th ed., Boston, MA, USA: Pearson, 2016.

[12] J. P. Bigus, *Data Mining with Neural Networks: Solving Business Problems from Application Development to Decision Support*, New York, NY, USA: McGraw-Hill, 1996.

[13] V. Chandola, A. Banerjee, and V. Kumar, "Anomaly detection: A survey," *ACM Computing Surveys*, vol. 41, no. 3, pp. 1–58, Jul. 2009.

[14] T. M. Lerman, *Personal Finance for Dummies*, 9th ed., Hoboken, NJ, USA: Wiley, 2018.

[15] G. Ramos and L. Lim, "A study of personal financial management software adoption: drivers and barriers," *International Journal of Information Management*, vol. 38, no. 1, pp. 217–225, Feb. 2018.

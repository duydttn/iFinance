# iFinance Graduation Thesis Report

THAI NGUYEN UNIVERSITY OF INFORMATION AND COMMUNICATION TECHNOLOGY  
INSTITUTE OF INTERNATIONAL TRAINING  

---

**GRADUATION THESIS REPORT**  
**Project Title:** iFinance - Personal Finance Management and Intelligent Analytics System  

Supervisor: Dr. Vu Duc Quang  
Student name: Be Van Duy  
Student ID: DTC235210010  
Class: CNTT QT K22A  

Thai Nguyen, May 2026

---

### ACKNOWLEDGMENTS

I would like to express my deepest and most sincere gratitude to Dr. Vu Duc Quang, who wholeheartedly guided, directed, and supported me throughout the process of completing my final report. His valuable professional feedback, dedication to teaching, and strong sense of responsibility not only helped me improve this report but also provided me with invaluable knowledge and practical experience in the field of software engineering and intelligent systems.

This report focuses on researching, designing, and building the iFinance system, a personal finance management and intelligent analytics platform. During this process, I made every effort to apply the knowledge I had learned while actively studying additional references, technologies, and implementation methods to improve the quality of the final product. Through this work, I gained deeper understanding of how to transform theory into practical software solutions, while also strengthening my analytical thinking and problem-solving skills.

However, due to limitations in time, practical experience, and available resources, this report still contains certain shortcomings. I sincerely look forward to receiving valuable comments and suggestions from my supervisor and the evaluation committee so that I can continue improving both my research quality and future product development.

Once again, I would like to express my sincere thanks to Dr. Vu Duc Quang.

### Declaration

I hereby declare that this thesis report titled **“iFinance - Personal Finance Management and Intelligent Analytics System”** is my own work, completed under the supervision of Vũ Đức Quang. All references, concepts, and external materials used in this report have been properly cited.

I take full responsibility for the authenticity of this report and confirm that it has not been submitted for assessment in any other program or institution.

Student Signature: ____________________  
Student Name: Bế Văn Duy  
Date: [DD/MM/YYYY]

### List of Abbreviations

| Abbreviation | Meaning |
|---|---|
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |
| DB | Database |
| ERD | Entity Relationship Diagram |
| FR | Functional Requirement |
| NFR | Non-Functional Requirement |
| KPI | Key Performance Indicator |
| UI | User Interface |
| UX | User Experience |
| JWT | JSON Web Token |

## Table of content

Table of content	2  
LIST OF TABLES AND FIGURES	4  
ABSTRACT	5  
CHAPTER 1. INTRODUCTION, OBJECTIVES, AND TECHNOLOGY SURVEY	7  
CHAPTER 2. SYSTEM ANALYSIS AND DESIGN	18  
CHAPTER 3. IMPLEMENTATION, DEMONSTRATION, AND EVALUATION	33  
CONCLUSION	56  
REFERENCES	58  
APPENDICES	60  

## LIST OF TABLES AND FIGURES

Figure 2.1. High-level system architecture	20  
Figure 3.1. Use case diagram	24  
Figure 3.2. Class diagram	26  
Figure 3.3. Sequence diagram - Create transaction	27  
Figure 3.4. Activity diagram - Monthly review	28  
Figure 3.5. ERD of iFinance database	30  
Figure 4.1. Dashboard screenshot	36  
Figure 4.2. Transactions page screenshot	37  
Figure 4.3. Reports page screenshot	38  
Figure 4.4. Backup and restore workflow screenshot	40  
Table 3.1. Functional requirements	19  
Table 3.2. Non-functional requirements	22  
Table 3.3. Detailed data dictionary	31  
Table 3.4. Risk analysis and mitigation	32  
Table 4.1. Condensed test matrix	43  
Table 4.2. Extended test matrix (40 cases)	47  
Table 4.3. Quantitative evaluation criteria	52  

---

## 1. Abstract

Personal finance management is a critical life skill, but many individuals still manage income and expenses using fragmented and inconsistent methods such as paper notes, chat messages, and spreadsheets. These methods are error-prone and provide limited analytical value. This thesis presents iFinance, a practical personal finance management and intelligent analytics system designed to integrate transaction recording, categorization, reporting, anomaly-aware analysis, and data backup in one platform.

The project follows a full software engineering lifecycle including requirement analysis, system modeling, architecture design, implementation, testing, and evaluation. The proposed system uses a modular layered architecture with clear separation of routes, middleware, services, and data models to improve maintainability and extensibility. Core features include secure authentication, transaction CRUD, category and rule management, dashboard metrics, period-based reporting, audit logging, and backup/restore operations.

Evaluation through functional testing and scenario-based demonstration shows that iFinance can effectively support daily expense tracking and improve financial awareness. The project also identifies current limitations and proposes future improvements such as bank API integration, advanced forecasting, and mobile support.

Keywords: personal finance, expense tracking, software architecture, data modeling, analytics, full-stack system.

---

## 2. Chapter 1. Introduction, Objectives, and Technology Survey

### 2.1 Background

In modern society, financial pressure is increasing due to inflation, unstable income patterns, and rising living costs. Effective personal finance management is essential for planning, saving, and long-term stability. However, most users do not maintain consistent spending records and therefore struggle to answer practical questions such as: where is money going, which categories consume the largest budget, and whether current spending habits are sustainable.

Traditional approaches, such as manual notebooks or simple spreadsheets, lack real-time insights and structured categorization. They also require substantial manual effort for monthly summarization and are vulnerable to input errors and missing records.

Digital finance tools exist, but many are either too complex, too opaque in internal logic, or too dependent on cloud ecosystems that may not fit educational and local deployment contexts. Therefore, there is a strong need for a practical, transparent, and modular system that can be both useful for users and academically analyzable.

### 2.2 Problem Statement

The core problem addressed in this thesis is the lack of an integrated and educationally transparent personal finance platform that combines secure data handling, transaction management, reporting, and intelligent insights in a maintainable architecture.

From an engineering perspective, the system must satisfy three simultaneous requirements:

1. **Practicality**: support real daily workflows such as adding transactions and reviewing monthly reports.
2. **Reliability**: preserve data integrity and provide backup/recovery controls.
3. **Extensibility**: allow future upgrades (for example forecasting or bank integration) without major redesign.

### 2.3 Objectives

#### 2.3.1 General Objective

To design and implement a full-stack personal finance management system that helps users track expenses, analyze financial behavior, and improve decision-making through structured reports and intelligent suggestions.

#### 2.3.2 Specific Objectives

1. Implement secure authentication and authorization for protected data access.
2. Provide full transaction CRUD with validation and filtering.
3. Support category and rule-based transaction organization.
4. Build dashboard and report views for period-based analysis.
5. Integrate anomaly-aware and AI-assisted analytical support.
6. Implement backup and restore to protect financial records.
7. Validate the system through testing and demonstration.

#### 2.3.3 Non-Functional Objectives

- Maintain modular and readable code organization.
- Ensure acceptable response time for personal-scale datasets.
- Provide user-friendly interface for frequent operations.
- Enforce basic security and traceability practices.

### 2.4 Scope and Limitations

#### 2.4.1 In-Scope

- User authentication and access control.
- Transaction recording and management.
- Category and rule management.
- Dashboard and report generation.
- AI/anomaly support.
- Backup and restore.
- Audit logging.

#### 2.4.2 Out-of-Scope

- Real-time direct bank account synchronization.
- Enterprise-grade accounting workflows.
- Multi-tenant high-scale cloud infrastructure.
- Complex legal tax automation for all jurisdictions.

#### 2.4.3 Limitations

- Analytical quality depends on data quality and quantity.
- AI outputs are advisory, not legally binding recommendations.
- Benchmarks are performed in project-scale local environments.

### 2.5 Significance of the Study

#### 2.5.1 Scientific Significance

This thesis provides a complete case study on translating a real societal problem into an end-to-end software engineering solution. It demonstrates requirement decomposition, architecture modeling, data design, modular implementation, and practical validation.

#### 2.5.2 Practical Significance

The developed platform supports users in understanding spending trends, controlling budgets, and making better financial decisions through integrated dashboards and reports.

### 2.6 Methodology

The development process follows an iterative and incremental lifecycle:

1. Requirement elicitation from practical use scenarios.
2. Domain and system analysis.
3. Architecture and data model design.
4. Feature-by-feature implementation.
5. Testing, debugging, and refinement.
6. Demonstration and final evaluation.

This process balances design discipline with implementation agility.

### 2.7 Technology Survey and Selection

#### 2.7.1 Backend Technologies

- **Node.js + Express**: lightweight, flexible routing, rich middleware ecosystem.
- **Fastify**: high performance but smaller ecosystem for this project.
- **Django**: mature but heavier and less aligned with chosen stack.

Selected choice: **Node.js + Express**.

#### 2.7.2 Database Technologies

- **SQLite**: easy local setup and suitable for personal-scale usage.
- **PostgreSQL**: robust and scalable but adds operational overhead.

Selected choice: **SQLite** with migration-ready schema design.

#### 2.7.3 Frontend and Desktop Stack

- Component-based frontend architecture for maintainability.
- Electron runtime for desktop packaging and cross-platform deployment.

#### 2.7.4 Analytics Strategy

Hybrid approach:
- deterministic rule-based logic for explainability,
- optional AI-assisted interpretation for richer insights.

### 2.8 Chapter Summary

Chapter 1 established motivation, objectives, scope, significance, methodology, and technology selection rationale. This foundation guides the formal analysis and design in Chapter 2.

### 2.9 Literature Review

Personal finance software has been studied across human-computer interaction, data visualization, and behavioral economics. Most studies agree that users are more likely to maintain healthy spending behavior when three conditions are satisfied: (1) transaction capture is easy, (2) feedback is timely and understandable, and (3) recommendations are specific enough to trigger action.

Traditional expense tracking systems mainly focus on recording and listing transactions. Their strengths include simplicity and low learning curve. However, they often fail to provide behavior-level interpretation. For example, a user may see a list of expenses but still not understand why overspending happened.

Modern platforms improve this by introducing dashboards, budget notifications, and spending analytics. Nevertheless, many solutions are closed-source cloud products and do not provide transparent architectural details. From an academic perspective, this is a limitation because design trade-offs and implementation decisions cannot be examined clearly.

Research on financial decision support also highlights the importance of explainability. Users tend to trust systems that can justify outputs through understandable rules and traceable calculations. Therefore, iFinance combines deterministic reporting with optional AI assistance, ensuring that core financial metrics remain auditable while still providing higher-level insights.

### 2.10 Comparative Analysis of Existing Solutions

This section compares typical solution groups:

1. **Spreadsheet-based approach**  
   - Pros: flexible, familiar, no installation complexity.  
   - Cons: manual aggregation, high error rate, low automation, weak access control.

2. **Mobile-only finance apps**  
   - Pros: convenience, quick transaction entry.  
   - Cons: limited custom logic, weak extensibility for academic system modeling.

3. **Enterprise accounting tools**  
   - Pros: strong reporting and controls.  
   - Cons: over-complex for personal use, expensive, steep onboarding.

4. **Custom academic full-stack approach (iFinance)**  
   - Pros: transparent architecture, tailored feature scope, extensible modules, educational value.  
   - Cons: requires implementation effort and disciplined testing.

The analysis supports the decision to build a focused, modular system rather than adopting a heavy external platform.

### 2.11 Research Gap and Thesis Positioning

The identified research gap is the lack of a transparent personal finance system that simultaneously provides:

- practical day-to-day usability,
- formal software architecture documentation,
- auditable data model and validation pipeline,
- and lightweight intelligent analytics support.

This thesis positions iFinance as a bridge between product utility and academic rigor. The system is intentionally designed so each architectural choice, data flow, and business rule can be explained, tested, and improved.

---

## 3. Chapter 2. System Analysis and Design

### 3.1 Stakeholders and User Roles

Primary stakeholder: individual user managing personal finances.

Roles:
- **Standard User**: manages own transactions, categories, reports, settings.
- **Maintainer/Admin (optional deployment role)**: handles advanced operations such as backup utilities and system-level configuration.

### 3.2 Functional Requirements

| ID | Requirement | Description | Priority |
|---|---|---|---|
| FR01 | Login | Authenticate user credentials | High |
| FR02 | Protected Access | Restrict private endpoints by auth | High |
| FR03 | Transaction CRUD | Create/read/update/delete transactions | High |
| FR04 | Category CRUD | Manage classification categories | High |
| FR05 | Rule Management | Create/update auto-categorization rules | Medium |
| FR06 | Dashboard | Show summary KPIs and distributions | High |
| FR07 | Reports | Generate monthly/range financial reports | High |
| FR08 | AI Insight | Provide analytical recommendations | Medium |
| FR09 | Anomaly Detection | Flag unusual transactions | Medium |
| FR10 | Audit Logging | Track key actions for traceability | Medium |
| FR11 | Backup | Export data snapshot | High |
| FR12 | Restore | Recover from backup | High |

### 3.3 Non-Functional Requirements

| ID | Type | Requirement | Acceptance |
|---|---|---|---|
| NFR01 | Security | Auth required for protected routes | Unauthorized access denied |
| NFR02 | Security | Server-side input validation | Invalid payload rejected |
| NFR03 | Performance | Responsive CRUD operations | Near real-time in local test |
| NFR04 | Reliability | Backup/restore consistency | Restored data valid |
| NFR05 | Maintainability | Modular code architecture | Clear layer separation |
| NFR06 | Usability | Low-friction daily operations | Task flow is concise |

### 3.4 Use Case Analysis

Main use cases:
- UC01 Login
- UC02 Logout
- UC03 Create Transaction
- UC04 Update Transaction
- UC05 Delete Transaction
- UC06 Manage Categories
- UC07 Manage Rules
- UC08 Generate Report
- UC09 Run AI/Anomaly Analysis
- UC10 Backup/Restore

#### 3.4.1 Sample Full Use Case: UC03 Create Transaction

- **Actor**: User  
- **Precondition**: User authenticated  
- **Main Flow**: open form -> input data -> submit -> validate -> persist -> refresh summary  
- **Alternative Flow**: invalid amount/date/category -> reject and return errors  
- **Postcondition**: transaction stored and included in reports

#### 3.4.2 Sample Full Use Case: UC08 Generate Report

- **Actor**: User  
- **Precondition**: transaction data exists  
- **Main Flow**: select period -> aggregate totals -> render charts/KPIs  
- **Alternative Flow**: empty period -> zero-state report  
- **Postcondition**: report available for planning decisions

### 3.5 UML Design

#### 3.5.1 Class Diagram Narrative

Core entities:
- `User`
- `Transaction`
- `Category`
- `Rule`
- `AuditLog`
- `Setting`

Key relationships:
- One user has many transactions.
- Transactions reference categories.
- Rules belong to users and can target categories.
- Audit logs track important actions with timestamps.

#### 3.5.2 Sequence Diagram Narrative (Create Transaction)

UI -> route -> auth middleware -> validator -> service -> model/database -> response -> UI refresh.

#### 3.5.3 Activity Diagram Narrative (Monthly Review)

Select period -> fetch transactions -> aggregate -> evaluate anomalies -> render insights -> user decision action.

#### 3.5.4 Component Diagram Narrative

Presentation layer, API/controller layer, middleware layer, service layer, data layer.

### 3.6 Database Design

#### 3.6.1 Entity Set

- `users`
- `transactions`
- `categories`
- `rules`
- `audit_logs`
- `settings`

#### 3.6.2 Integrity Constraints

- Foreign keys between user-related entities.
- Not-null constraints on mandatory fields.
- Type checks for transaction semantics.
- Optional uniqueness rules per user scope.

#### 3.6.3 Indexing Strategy

Recommended indexes:
- `transactions(user_id, transaction_date)`
- `transactions(category_id)`
- `categories(user_id, name)`
- `audit_logs(user_id, action_time)`

### 3.7 Architecture Design

#### 3.7.1 Layered Architecture

1. Presentation Layer  
2. API/Controller Layer  
3. Service Layer  
4. Data Access Layer

Benefits: low coupling, high readability, easy testability.

#### 3.7.2 Request Lifecycle

Request -> route -> middleware chain -> business service -> data model -> structured response.

### 3.8 Security Design

- Authentication checks for protected routes.
- Authorization rules for sensitive operations.
- Input validation and sanitization.
- Rate limiting on selected endpoints.
- Audit logs for sensitive actions.

### 3.9 UI/UX Design

Design principles:
- clarity of financial information,
- consistency of controls,
- minimal friction for frequent actions,
- immediate feedback for submit/update/delete operations.

Main pages:
- Login
- Dashboard
- Transactions
- Reports
- Settings
- AI Studio/analysis page

### 3.10 Chapter Summary

Chapter 2 defines the complete analysis and design blueprint for implementation, including requirements, use cases, UML narratives, database strategy, architecture, security, and usability principles.

### 3.11 Detailed Use Case Specifications

#### 3.11.1 UC01 Login

- **Actor**: User  
- **Goal**: Access personal workspace securely.  
- **Precondition**: Account exists and is active.  
- **Main Flow**: input credentials -> validate -> create auth context -> redirect to dashboard.  
- **Exception**: invalid credentials -> return error and keep login page state.  
- **Postcondition**: authenticated session available.

#### 3.11.2 UC03 Create Transaction

- **Actor**: User  
- **Goal**: Record income/expense.  
- **Precondition**: User authenticated; category available.  
- **Main Flow**: open form -> fill amount/type/date/category/note -> submit -> validate -> store -> refresh view.  
- **Exception A**: invalid amount -> validation message.  
- **Exception B**: missing required fields -> request rejected.  
- **Postcondition**: new transaction appears in list and reports.

#### 3.11.3 UC06 Manage Categories

- **Actor**: User  
- **Goal**: Organize transactions for reporting accuracy.  
- **Precondition**: User authenticated.  
- **Main Flow**: create/update/delete category -> apply changes -> refresh category selector.  
- **Exception**: delete constrained category -> controlled rejection or migration flow.  
- **Postcondition**: category state consistent with existing transactions.

#### 3.11.4 UC08 Generate Report

- **Actor**: User  
- **Goal**: Review period-based financial status.  
- **Precondition**: data exists or system can render empty-state safely.  
- **Main Flow**: select date range -> aggregate totals -> compute breakdown -> render charts/KPIs.  
- **Exception**: no data -> zero-state with guidance message.  
- **Postcondition**: report metrics available for decision support.

#### 3.11.5 UC10 Backup and Restore

- **Actor**: User/Admin  
- **Goal**: Protect and recover data.  
- **Precondition**: authorized role and valid backup source/target.  
- **Main Flow**: execute backup or restore -> integrity check -> log outcome.  
- **Exception**: corrupted file -> abort restore and preserve current state.  
- **Postcondition**: continuity and recoverability ensured.

### 3.12 Data Dictionary (Extended)

#### 3.12.1 `users`

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER/UUID | PK, NOT NULL | Unique identity |
| username | TEXT | UNIQUE, NOT NULL | Login identifier |
| password_hash | TEXT | NOT NULL | Credential hash |
| role | TEXT | NOT NULL | Authorization role |
| created_at | DATETIME | NOT NULL | Creation timestamp |
| updated_at | DATETIME | NULLABLE | Last update timestamp |

#### 3.12.2 `transactions`

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER/UUID | PK, NOT NULL | Transaction id |
| user_id | INTEGER/UUID | FK users(id), NOT NULL | Owner reference |
| category_id | INTEGER/UUID | FK categories(id), NULLABLE | Category reference |
| amount | DECIMAL | NOT NULL, CHECK amount > 0 | Monetary value |
| type | TEXT | NOT NULL, CHECK in domain | income/expense |
| note | TEXT | NULLABLE | Optional details |
| transaction_date | DATE | NOT NULL | Logical transaction date |
| created_at | DATETIME | NOT NULL | Creation timestamp |

#### 3.12.3 `categories`

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER/UUID | PK, NOT NULL | Category id |
| user_id | INTEGER/UUID | FK users(id), NOT NULL | Owner |
| name | TEXT | NOT NULL | Category title |
| category_type | TEXT | NULLABLE | Optional grouping |
| created_at | DATETIME | NOT NULL | Creation timestamp |

#### 3.12.4 `rules`

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER/UUID | PK, NOT NULL | Rule id |
| user_id | INTEGER/UUID | FK users(id), NOT NULL | Rule owner |
| condition_expr | TEXT | NOT NULL | Matching expression |
| target_category_id | INTEGER/UUID | FK categories(id), NULLABLE | Assignment target |
| priority | INTEGER | DEFAULT 0 | Evaluation order |
| is_active | BOOLEAN | NOT NULL | Rule enabled status |

#### 3.12.5 `audit_logs`

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER/UUID | PK, NOT NULL | Log id |
| user_id | INTEGER/UUID | FK users(id), NULLABLE | Trigger actor |
| action_type | TEXT | NOT NULL | Event classification |
| action_details | TEXT | NULLABLE | Serialized details |
| action_time | DATETIME | NOT NULL | Event timestamp |

### 3.13 Risk Analysis and Mitigation Plan

| Risk ID | Risk Description | Probability | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Invalid user input leads to inconsistent records | Medium | High | Strict validation + DB constraints |
| R2 | Unauthorized access to private financial data | Low-Medium | High | Auth middleware + scoped queries |
| R3 | Data loss due to accidental deletion | Medium | High | Backup/restore + confirmation dialogs |
| R4 | Incorrect rule configuration causes misclassification | Medium | Medium | Rule preview + priority management |
| R5 | AI suggestion inaccuracy | Medium | Medium | Advisory-only policy + explainable metrics |
| R6 | Deadline pressure reduces test coverage | Medium | High | Prioritized test matrix + smoke checks |
| R7 | Environment mismatch during deployment | Medium | Medium | Setup scripts + environment checklist |

The mitigation plan is integrated into implementation and operations to reduce both development and runtime risks.

---

## 4. Chapter 3. Implementation, Demonstration, and Evaluation

### 4.1 Development Environment

- Runtime: Node.js
- Backend: Express.js
- Database: SQLite (relational schema)
- Frontend: structured client modules
- Desktop support: Electron
- Tooling: npm scripts, linting, modular project organization

### 4.2 Core Module Implementation

#### 4.2.1 Authentication and Authorization

- Credential verification.
- Protected route middleware.
- User context injection for downstream service logic.

#### 4.2.2 Transaction Management

- Create/read/update/delete operations.
- Filter by date/category/type.
- Validation for amount, date, and required fields.

#### 4.2.3 Category and Rule Management

- Category CRUD with user scope.
- Rule definition for automatic classification.
- Priority and activation controls.

#### 4.2.4 Reporting and Dashboard

- Period-based income/expense totals.
- Category breakdown summaries.
- Trend indicators and comparison insights.

#### 4.2.5 AI and Anomaly Support

- Detect unusual patterns using threshold/rule checks.
- Optional textual analytical guidance.
- Advisory-only interpretation policy.

#### 4.2.6 Backup and Restore

- Create snapshot backups.
- Restore previous states with validation checks.
- Improve continuity and fault recovery.

#### 4.2.7 Audit Logging

- Record critical actions for diagnostics and accountability.

### 4.3 Demonstration Scenario

Suggested defense demo flow:

1. Login and show route protection.
2. Add income and expense transactions.
3. Create or edit category/rule.
4. Open dashboard and explain key metrics.
5. Generate monthly report.
6. Run AI/anomaly analysis.
7. Execute backup and restore operation.

### 4.4 Testing and Validation

Testing levels:
- unit-level validation,
- integration-level route/service/model tests,
- manual user acceptance scenario tests.

Sample test matrix (condensed):

| TC ID | Scenario | Expected |
|---|---|---|
| TC01 | Valid login | Auth success |
| TC02 | Invalid login | Auth error |
| TC03 | Create valid transaction | Persisted |
| TC04 | Create invalid transaction | Validation error |
| TC05 | Generate report with data | Correct aggregation |
| TC06 | Generate report empty period | Zero-state handled |
| TC07 | Unauthorized access to protected route | Access denied |
| TC08 | Backup operation | Snapshot created |
| TC09 | Restore valid snapshot | Data recovered |
| TC10 | Trigger anomaly analysis | Insight returned |

### 4.5 Performance and Reliability

For personal-scale workloads, the system provides responsive CRUD and reporting operations. Reliability is improved through strict validation, controlled error handling, and backup/recovery support.

### 4.6 Results and Achievements

Project achievements:
- completed secure transaction lifecycle,
- implemented category and rule workflows,
- delivered practical dashboards and reports,
- integrated anomaly/AI support,
- implemented backup/restore and traceability features.

### 4.7 Limitations

- No real-time direct banking integration.
- No advanced long-term predictive model yet.
- Evaluation limited to project-scale deployment scenarios.

### 4.8 Future Work

1. Banking API integration.
2. Forecasting and budget recommendation models.
3. Mobile companion application.
4. Stronger automated testing/CI coverage.
5. Multi-currency and localization support.

### 4.9 Chapter Summary

Chapter 3 demonstrates how the proposed design is implemented, tested, and evaluated in practice. The findings confirm the project objectives are met within scope.

### 4.10 Extended Test Matrix

To improve validation depth, the following extended matrix is used:

| TC ID | Module | Scenario | Expected Result |
|---|---|---|---|
| TC01 | Auth | Valid login | Success context issued |
| TC02 | Auth | Invalid password | Authentication error |
| TC03 | Auth | Empty username | Validation error |
| TC04 | Auth | Empty password | Validation error |
| TC05 | Auth | Protected endpoint without auth | Access denied |
| TC06 | Auth | Protected endpoint with invalid token | Access denied |
| TC07 | Transaction | Create valid income | Record persisted |
| TC08 | Transaction | Create valid expense | Record persisted |
| TC09 | Transaction | Missing amount | Validation error |
| TC10 | Transaction | Negative/invalid amount | Validation error |
| TC11 | Transaction | Missing date | Validation error |
| TC12 | Transaction | Update existing record | Record updated |
| TC13 | Transaction | Update missing record | Not found |
| TC14 | Transaction | Delete existing record | Record deleted |
| TC15 | Transaction | Delete missing record | Not found |
| TC16 | Transaction | Filter by date range | Correct subset |
| TC17 | Transaction | Filter by category | Correct subset |
| TC18 | Category | Create category | Category created |
| TC19 | Category | Duplicate category policy violation | Conflict error |
| TC20 | Category | Update category | Updated successfully |
| TC21 | Category | Delete unused category | Deleted |
| TC22 | Category | Delete used category | Controlled reject/migrate flow |
| TC23 | Rule | Create active rule | Rule stored |
| TC24 | Rule | Update rule priority | Priority updated |
| TC25 | Rule | Disable rule | Not applied in processing |
| TC26 | Report | Monthly report with data | Accurate totals |
| TC27 | Report | Empty month report | Zero-state output |
| TC28 | Report | Category totals | Accurate aggregation |
| TC29 | Dashboard | KPI refresh after create | Values updated |
| TC30 | Dashboard | KPI refresh after delete | Values updated |
| TC31 | AI | Insight request with enough data | Insight generated |
| TC32 | AI | Insight request with sparse data | Graceful message |
| TC33 | Anomaly | High outlier amount | Flag generated |
| TC34 | Audit | Login event | Log stored |
| TC35 | Audit | Delete event | Log stored |
| TC36 | Backup | Create snapshot | Backup success |
| TC37 | Restore | Restore valid snapshot | Data recovered |
| TC38 | Restore | Restore corrupted snapshot | Safe rejection |
| TC39 | Settings | Update preferences | Saved successfully |
| TC40 | System | Health endpoint ping | Service healthy |

### 4.11 Quantitative Evaluation Criteria

The project uses operational indicators for practical evaluation:

1. **Functional Coverage**: percentage of planned core features implemented and demonstrated.
2. **Validation Pass Rate**: ratio of passed test cases in test matrix.
3. **Response Practicality**: observed responsiveness under personal-scale data.
4. **Data Integrity Stability**: no broken references after CRUD and restore flows.
5. **Recovery Confidence**: success rate of backup/restore scenarios.

A suggested reporting format:

| Metric | Target | Observed | Status |
|---|---|---|---|
| Functional coverage | >= 90% core scope | [Fill] | [Pass/Need Improvement] |
| Test pass rate | >= 90% | [Fill] | [Pass/Need Improvement] |
| CRUD responsiveness | User-acceptable | [Fill] | [Pass/Need Improvement] |
| Report correctness | No aggregation mismatch | [Fill] | [Pass/Need Improvement] |
| Restore success | 100% on valid backups | [Fill] | [Pass/Need Improvement] |

### 4.12 Deployment and Operation Procedure

#### 4.12.1 Local Deployment Steps

1. Install dependencies for backend and frontend/client modules.
2. Configure environment variables and connection settings.
3. Initialize database schema and seed (if required).
4. Start backend service and verify health endpoint.
5. Start frontend or desktop runtime.
6. Run smoke test sequence (login -> create transaction -> report).

#### 4.12.2 Pre-Defense Operation Checklist

- Demo account prepared.
- Sample data prepared for visible reports.
- Backup file prepared for restore demonstration.
- Fallback screenshots prepared if live demo fails.
- Known limitations and future work points ready for Q&A.

#### 4.12.3 Post-Deployment Maintenance Notes

- Rotate or update credentials periodically.
- Archive backups with date/version naming.
- Review audit logs for unusual activity.
- Re-run core regression tests after major changes.

### 4.13 Extended Discussion

The implementation confirms that a layered full-stack architecture is effective for educational finance projects. Most complexity is concentrated in validation, report aggregation, and data consistency protection rather than UI rendering alone. This implies that future improvements should prioritize domain logic quality and testing depth before adding feature surface area.

The project also demonstrates that AI should remain a complementary tool. Deterministic reports remain the primary decision foundation, while AI-generated narratives help interpret trends more quickly. This balance improves user trust and reduces over-reliance on non-deterministic outputs.

---

## 5. Conclusion

This thesis introduced and validated iFinance as a practical personal finance management and intelligent analytics platform. The work covers full lifecycle engineering from requirement analysis to implementation and testing. The final system enables secure tracking, meaningful reporting, anomaly-aware insights, and data continuity via backup/restore.

Academically, the thesis provides a transparent and modular case study of modern software engineering applied to a real user problem. Practically, it offers a usable baseline for future development and deployment.

---

## 6. References

[1] Ian Sommerville, *Software Engineering*, 10th Edition, Pearson, 2015.  
[2] Martin Fowler, *Patterns of Enterprise Application Architecture*, Addison-Wesley, 2002.  
[3] Roy T. Fielding, “Architectural Styles and the Design of Network-based Software Architectures,” Ph.D. dissertation, 2000.  
[4] OWASP Foundation, “OWASP Top 10 Web Application Security Risks.”  
[5] Node.js Documentation, https://nodejs.org  
[6] Express.js Documentation, https://expressjs.com  
[7] SQLite Documentation, https://sqlite.org  
[8] Electron Documentation, https://www.electronjs.org  

---

## 7. Appendices

### Appendix A. Suggested Figures

1. System architecture diagram  
2. Use case diagram  
3. Class diagram  
4. Sequence diagram (Create Transaction)  
5. Activity diagram (Monthly Review)  
6. ERD  
7. Dashboard screenshot  
8. Transactions page screenshot  
9. Reports page screenshot  
10. Backup/restore screenshot  

### Appendix B. Suggested Tables

1. Technology comparison  
2. Functional requirements  
3. Non-functional requirements  
4. Data dictionary  
5. Test matrix  
6. Risk assessment  

### Appendix C. Formatting Standard for 50+ Pages

- Font: Times New Roman, size 13
- Line spacing: 1.5
- Margins: Left 3.5 cm, Right 2.0 cm, Top 2.5 cm, Bottom 2.5 cm
- Paragraph spacing: 6pt after
- Use consistent caption style for all figures/tables

### Appendix D. Final Submission Checklist

1. Replace all placeholders (`[Your Name]`, etc.).
2. Insert actual UML and ERD images.
3. Add real in-text citations.
4. Generate automatic table of contents in Word.
5. Verify figure/table numbering.
6. Proofread language and formatting.
7. Export PDF and verify final pagination.

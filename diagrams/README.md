# iFinance Diagrams

Source files for the figures used in `iFinance Report.docx.md`.
Render each one online (no installation required) and export PNG into
`images/` so Pandoc picks them up when building the DOCX.

| File                | Figure in report | Render with                                                         | Export name                          |
| ------------------- | ---------------- | ------------------------------------------------------------------- | ------------------------------------ |
| `01-usecase.puml`   | Figure 2.1       | https://www.plantuml.com/plantuml/uml/                              | `images/figure-2-1-usecase.png`      |
| `02-activity.puml`  | Figure 2.2       | https://www.plantuml.com/plantuml/uml/                              | `images/figure-2-2-activity.png`     |
| `03-pipeline.puml`  | Figure 3.1       | https://www.plantuml.com/plantuml/uml/                              | `images/figure-3-1-pipeline.png`     |
| `04-erd.dbml`       | Figure 2.3       | https://dbdiagram.io/d  (paste, then Export → PNG)                  | `images/figure-2-3-erd.png`          |

## Workflow (for each diagram)

1. Open the rendering URL above.
2. Open the source file in this folder, copy **all** of its content.
3. Paste it into the editor on the rendering site.
4. Click **Export** → **PNG** (DBML on dbdiagram.io has the same option).
5. Save into `d:/tech_quang/iFinance/images/` using the export name in the table.
6. Update Markdown reference (one-time):
   ```markdown
   ![Use-case diagram of the iFinance system](images/figure-2-1-usecase.png)
   *Figure 2.1. Use-case diagram of the iFinance system*
   ```
7. Rebuild DOCX:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\build-report.ps1 `
     -InputPath "iFinance Report.docx.md" -OutputPath "iFinance Report.docx"
   ```

## Tips for nicer rendering

- **PlantUML**: increase resolution by appending `?dpi=200` in the export
  URL or using the local CLI `java -jar plantuml.jar -tpng -DPLANTUML_LIMIT_SIZE=8192 file.puml`.
- **dbdiagram.io**: drag tables to a clean layout before exporting; the
  default auto-layout sometimes overlaps relationship arrows.
- Use **white background** (already enforced via `skinparam backgroundColor #FFFFFF`)
  so the figures look clean inside Word.

## Why use these source files at all?

Markdown / DOCX cannot store editable diagrams. Keeping the source code
in `diagrams/` means:

- The diagrams stay **version-controlled** alongside the rest of the project.
- Anyone can re-export an updated PNG after a schema change in 30 seconds.
- The figures stay **consistent** with the actual schema in
  `backend/database/schema.sql`.

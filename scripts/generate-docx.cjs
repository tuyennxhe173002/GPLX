const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  LevelFormat,
  Packer,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableOfContents,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} = require("docx");

const root = process.cwd();
const docsDir = path.join(root, "docs");
const outFile = path.join(docsDir, "gplx-implementation-plan.docx");
const planFile = path.join(docsDir, "gplx-implementation-plan.md");

const phaseFiles = Array.from({ length: 12 }, (_, i) =>
  path.join(docsDir, `phase-${String(i + 1).padStart(2, "0")}-${[
    "project-bootstrap",
    "database-migration",
    "data-import",
    "question-apis",
    "practice-api",
    "frontend-practice-ui",
    "animation-engine",
    "exam-backend",
    "exam-frontend",
    "progress",
    "testing",
    "deployment",
  ][i]}.md`)
);

const md = [planFile, ...phaseFiles].map((file) => fs.readFileSync(file, "utf8")).join("\n\n---\n\n");

const bulletRef = "bullet-list";
let numberRefCount = 0;

function textRun(text, opts = {}) {
  return new TextRun({ text, size: 22, font: "Arial", ...opts });
}

function paragraph(text = "", opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [textRun(text, opts.run || {})],
    ...opts,
  });
}

function codeParagraph(text) {
  return new Paragraph({
    spacing: { before: 20, after: 20 },
    shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
    children: [new TextRun({ text, font: "Consolas", size: 18, color: "111827" })],
  });
}

function heading(text, level) {
  const headingLevel = level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3;
  return new Paragraph({
    heading: headingLevel,
    spacing: { before: level === 1 ? 360 : 240, after: 140 },
    children: [textRun(text, { bold: true, size: level === 1 ? 32 : level === 2 ? 28 : 24, color: level === 1 ? "0F172A" : "1F2937" })],
  });
}

function makeTable(lines) {
  const rows = lines
    .filter((line) => line.trim().startsWith("|") && !/^\|\s*-/.test(line.trim()))
    .map((line, idx) => {
      const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
      return new TableRow({
        tableHeader: idx === 0,
        children: cells.map((cell) =>
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
            },
            shading: idx === 0 ? { fill: "E2E8F0", type: ShadingType.CLEAR } : undefined,
            verticalAlign: VerticalAlign.CENTER,
            width: { size: Math.floor(9360 / Math.max(cells.length, 1)), type: WidthType.DXA },
            children: [paragraph(cell, { run: { bold: idx === 0 } })],
          })
        ),
      });
    });
  return new Table({
    columnWidths: [3120, 3120, 3120],
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    rows,
  });
}

function parseMarkdown(markdown) {
  const children = [];
  const lines = markdown.split(/\r?\n/);
  let inCode = false;
  let table = [];
  let orderedRef = `numbered-${++numberRefCount}`;

  function flushTable() {
    if (table.length) {
      children.push(makeTable(table));
      table = [];
    }
  }

  for (const raw of lines) {
    const line = raw.replace(/\s+$/g, "");

    if (line.startsWith("```")) {
      flushTable();
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      children.push(codeParagraph(line || " "));
      continue;
    }

    if (line.trim().startsWith("|") && line.includes("|")) {
      table.push(line);
      continue;
    }
    flushTable();

    if (!line.trim()) {
      children.push(paragraph(""));
      continue;
    }

    if (line === "---") {
      orderedRef = `numbered-${++numberRefCount}`;
      children.push(paragraph(""));
      continue;
    }

    const h = line.match(/^(#{1,3})\s+(.+)$/);
    if (h) {
      children.push(heading(h[2], h[1].length));
      continue;
    }

    const bullet = line.match(/^-\s+(.+)$/);
    if (bullet) {
      children.push(new Paragraph({
        numbering: { reference: bulletRef, level: 0 },
        spacing: { before: 40, after: 40 },
        children: [textRun(bullet[1])],
      }));
      continue;
    }

    const num = line.match(/^\d+\.\s+(.+)$/);
    if (num) {
      children.push(new Paragraph({
        numbering: { reference: orderedRef, level: 0 },
        spacing: { before: 40, after: 40 },
        children: [textRun(num[1])],
      }));
      continue;
    }

    children.push(paragraph(line));
  }

  flushTable();
  return children;
}

const numberedConfigs = Array.from({ length: 80 }, (_, i) => ({
  reference: `numbered-${i + 1}`,
  levels: [{
    level: 0,
    format: LevelFormat.DECIMAL,
    text: "%1.",
    alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 720, hanging: 360 } } },
  }],
}));

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", run: { size: 44, bold: true, font: "Arial", color: "0F172A" }, paragraph: { spacing: { before: 240, after: 240 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 32, bold: true, color: "0F172A", font: "Arial" }, paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 28, bold: true, color: "1F2937", font: "Arial" }, paragraph: { spacing: { before: 240, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 24, bold: true, color: "374151", font: "Arial" }, paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      {
        reference: bulletRef,
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      ...numberedConfigs,
    ],
  },
  sections: [{
    properties: { page: { margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 } } },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [textRun("Page "), new TextRun({ children: [PageNumber.CURRENT] })] })] }),
    },
    children: [
      new Paragraph({ heading: HeadingLevel.TITLE, children: [textRun("GPLX 600 Questions Website - Implementation Plan", { bold: true, size: 44 })] }),
      paragraph("Spring Boot + ReactJS implementation plan with phased roadmap, data import strategy, API contracts, database schema and animation engine design."),
      new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
      ...parseMarkdown(md),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outFile, buffer);
  console.log(outFile);
});

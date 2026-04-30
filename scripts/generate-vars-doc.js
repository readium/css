#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");

const VARS_DIR = path.join(__dirname, "../css/vars");
const OUTPUT = path.join(VARS_DIR, "CSS-Variables.md");
const PREFIX = "--RS__";

const FILES = [
  { file: "pagination.json",  heading: "Pagination",   type: "flat" },
  { file: "colors.json",      heading: "Colors",       type: "flat" },
  { file: "fontStacks.json",  heading: "Font Stacks",  type: "flat" },
  { file: "i18n.json",        heading: "i18n",         type: "i18n" },
  { file: "experiments.json", heading: "Experiments",  type: "experiments" },
];

function camelToWords(str) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function mdCode(val) {
  return val !== undefined && val !== null ? `\`${val}\`` : "—";
}

function flatSection(heading, data) {
  const rows = Object.entries(data)
    .map(([key, val]) => `| ${mdCode(PREFIX + key)} | ${mdCode(val)} |`)
    .join("\n");

  return `## ${heading}\n\n| Variable | Value |\n| --- | --- |\n${rows}\n`;
}

const I18N_STRATEGY = `\
Different scripts require different amounts of line height. These compensation factors allow a Reading System to adjust a line-height value when the publication's language differs from its own, so that the result feels consistent across scripts rather than too tight or too loose.

\`\`\`
adjustedLineHeight = lineHeight * (publicationCompensation / appCompensation)
\`\`\`

| App language | Publication language | Effect |
| --- | --- | --- |
| Latin (\`1.0\`) | CJK (\`1.167\`) | line-height increases |
| CJK (\`1.167\`) | Latin (\`1.0\`) | line-height decreases |
| CJK (\`1.167\`) | CJK (\`1.167\`) | no change |
| Latin (\`1.0\`) | Latin (\`1.0\`) | no change |

To resolve a compensation factor for a BCP-47 language tag:

1. Match the full tag including region or script subtag (e.g. \`zh-Hant\`, \`zh-HK\`).
2. If no match, match on the primary language code alone (e.g. \`zh\`, \`ja\`).
3. If still no match, use \`default\` (\`1\`).

`;

function i18nSection(heading, data) {
  const langKeys = Object.keys(data);
  const propKeys = [...new Set(langKeys.flatMap((lang) => Object.keys(data[lang])))];

  const header = `| Language | ${propKeys.map(camelToWords).join(" | ")} |`;
  const divider = `| --- |${propKeys.map(() => " --- |").join("")}`;

  const rows = langKeys.map((lang) => {
    const cols = propKeys.map((prop) => {
      const val = data[lang][prop];
      return val !== undefined ? mdCode(val) : "—";
    });
    return `| ${mdCode(lang)} | ${cols.join(" | ")} |`;
  }).join("\n");

  return `## ${heading}\n\n${I18N_STRATEGY}${header}\n${divider}\n${rows}\n`;
}

function experimentsSection(heading, data) {
  const sections = Object.entries(data).map(([key, entry]) => {
    return `### ${key}\n\n${entry.description}\n\n**Value:** ${mdCode(entry.value)}\n`;
  }).join("\n");

  return `## ${heading}\n\n${sections}`;
}

function generate() {
  const parts = ["# CSS Variables Reference\n"];

  for (const { file, heading, type } of FILES) {
    const src = path.join(VARS_DIR, file);
    const data = JSON.parse(fs.readFileSync(src, "utf8"));

    if (type === "flat") {
      parts.push(flatSection(heading, data));
    } else if (type === "i18n") {
      parts.push(i18nSection(heading, data));
    } else if (type === "experiments") {
      parts.push(experimentsSection(heading, data));
    }
  }

  fs.writeFileSync(OUTPUT, parts.join("\n"));
  console.log(`Generated ${path.relative(process.cwd(), OUTPUT)}`);
}

generate();

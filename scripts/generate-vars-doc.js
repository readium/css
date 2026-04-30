#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");

const VARS_DIR = path.join(__dirname, "../css/vars");
const OUTPUT = path.join(VARS_DIR, "CSS-Variables.md");

const FILES = [
  { file: "pagination.json",  heading: "Pagination",   type: "flat" },
  { file: "colors.json",      heading: "Colors",       type: "flat" },
  { file: "fontStacks.json",  heading: "Font Stacks",  type: "flat" },
  { file: "i18n.json",        heading: "i18n",         type: "i18n" },
  { file: "settings.json",    heading: "Settings",     type: "settings" },
  { file: "experiments.json", heading: "Experiments",  type: "experiments" },
];

const PREFIX = "--RS__";
const USER_PREFIX = "--USER__";

const I18N_STRATEGY = `\
\`lineHeightCompensation\` factors account for the different line-height needs of scripts, **Latin being the default and the reference for other scripts**. To determine which value to apply, a Reading System should use the following lookup against the publication's BCP-47 language tag:

1. Find the key matching the publication's full BCP-47 language + region code.
2. If no match, find the key after removing the region code (only BCP-47 language code).
3. If no match, use \`default\` (or ignore, because the line-height compensation should be \`1\`).

`;

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

function settingsSection(heading, data) {
  const rows = Object.entries(data).map(([variant, { disabled, added }]) => {
    const disabledCol = disabled.length
      ? disabled.map((s) => mdCode(USER_PREFIX + s)).join(", ")
      : "—";
    const addedCol = added.length
      ? added.map((s) => mdCode(USER_PREFIX + s)).join(", ")
      : "—";
    return `| ${mdCode(variant)} | ${disabledCol} | ${addedCol} |`;
  }).join("\n");

  return `## ${heading}\n\nUser settings vary by stylesheet variant. Each name below maps to a \`${USER_PREFIX}\` CSS variable.\n\n| Variant | Disabled | Added |\n| --- | --- | --- |\n${rows}\n`;
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
    } else if (type === "settings") {
      parts.push(settingsSection(heading, data));
    } else if (type === "experiments") {
      parts.push(experimentsSection(heading, data));
    }
  }

  fs.writeFileSync(OUTPUT, parts.join("\n"));
  console.log(`Generated ${path.relative(process.cwd(), OUTPUT)}`);
}

generate();

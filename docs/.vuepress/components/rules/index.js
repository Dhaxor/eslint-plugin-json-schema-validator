/* eslint node/no-unsupported-features/es-syntax: off -- not node */
import { Linter } from "eslint/lib/linter";
// eslint-disable-next-line node/no-missing-import -- no build
import plugin from "../../../../";

const coreRules = Object.fromEntries(new Linter().getRules());

const CATEGORY_TITLES = {
  recommended: "eslint-plugin-json-schema-validator",
  "eslint-core-rules@problem": "ESLint core rules(Possible Errors)",
  "eslint-core-rules@suggestion": "ESLint core rules(Suggestions)",
  "eslint-core-rules@layout": "ESLint core rules(Layout & Formatting)",
};
const CATEGORY_INDEX = {
  recommended: 2,
  "eslint-core-rules@problem": 20,
  "eslint-core-rules@suggestion": 21,
  "eslint-core-rules@layout": 22,
};
const CATEGORY_CLASSES = {
  recommended: "eslint-plugin-json-schema-validator__category",
  "eslint-core-rules@problem": "eslint-core-category",
  "eslint-core-rules@suggestion": "eslint-core-category",
  "eslint-core-rules@layout": "eslint-core-category",
};

const allRules = [];

for (const k of Object.keys(plugin.rules)) {
  const rule = plugin.rules[k];
  rule.meta.docs.category = "recommended";
  allRules.push({
    classes: "eslint-plugin-json-schema-validator__rule",
    category: "recommended",
    ruleId: rule.meta.docs.ruleId,
    url: rule.meta.docs.url,
    initChecked:
      rule.meta.docs.categories &&
      rule.meta.docs.categories.includes("recommended"),
  });
}

for (const k of Object.keys(coreRules)) {
  const rule = coreRules[k];
  allRules.push({
    classes: "eslint-core-rule",
    category: `eslint-core-rules@${rule.meta.type}`,
    ruleId: k,
    url: rule.meta.docs.url,
    initChecked: false, // rule.meta.docs.recommended,
  });
}

allRules.sort((a, b) =>
  a.ruleId > b.ruleId ? 1 : a.ruleId < b.ruleId ? -1 : 0
);

export const categories = [];

for (const rule of allRules) {
  const title = CATEGORY_TITLES[rule.category] || rule.fallbackTitle;
  let category = categories.find((c) => c.title === title);
  if (!category) {
    category = {
      classes: CATEGORY_CLASSES[rule.category],
      category: rule.category,
      categoryOrder: CATEGORY_INDEX[rule.category],
      title,
      rules: [],
    };
    categories.push(category);
  }
  category.rules.push(rule);
}
categories.sort((a, b) =>
  a.categoryOrder > b.categoryOrder
    ? 1
    : a.categoryOrder < b.categoryOrder
    ? -1
    : a.title > b.title
    ? 1
    : a.title < b.title
    ? -1
    : 0
);

export const DEFAULT_RULES_CONFIG = allRules.reduce((c, r) => {
  // if (
  //     [
  //         "no-trailing-spaces",
  //         "no-multiple-empty-lines",
  //         "comma-spacing",
  //         "no-multi-spaces",
  //     ].includes(r.ruleId)
  // ) {
  //     c[r.ruleId] = "error"
  // } else {
  c[r.ruleId] = r.initChecked ? "error" : "off";
  // }
  return c;
}, {});

export const rules = allRules;

export function getRule(ruleId) {
  if (!ruleId) {
    return { url: "" };
  }
  for (const category of categories) {
    for (const rule of category.rules) {
      if (rule.ruleId === ruleId) {
        return rule;
      }
    }
  }
  return {
    ruleId,
    url: "",
    classes: "",
  };
}

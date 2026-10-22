// Second Bite's own lint rules, an Oxlint JS plugin (docs/guidelines/web.md › Data from outside). The idea is
// anti-slop's (github.com/dmmulroy/anti-slop): text from outside is parsed into a typed value once, where it
// arrives, so no file checks a shape by hand with `typeof`. Each rule names the one module allowed to do it.

const STORAGES = new Set(["localStorage", "sessionStorage"]);

const noRawStorage = {
  meta: {
    type: "problem",
    docs: { description: "Browser storage is read and written only through src/lib/stored.ts." },
    messages: {
      raw: "Keep `{{name}}` behind `stored(key, schema, fallback)` from @/lib/stored, which parses what it reads.",
    },
  },
  create(context) {
    return {
      Identifier(node) {
        if (STORAGES.has(node.name))
          context.report({ node, messageId: "raw", data: { name: node.name } });
      },
    };
  },
};

const noRawJsonParse = {
  meta: {
    type: "problem",
    docs: { description: "JSON text is parsed only through parseJson in src/lib/json.ts." },
    messages: {
      raw: "Parse JSON with `parseJson(text, schema)` from @/lib/json, so the value is checked where it arrives.",
    },
  },
  create(context) {
    return {
      MemberExpression(node) {
        if (
          node.object.type === "Identifier" &&
          node.object.name === "JSON" &&
          !node.computed &&
          node.property.name === "parse"
        ) {
          context.report({ node, messageId: "raw" });
        }
      },
    };
  },
};

const plugin = {
  meta: { name: "second-bite" },
  rules: {
    "no-raw-storage": noRawStorage,
    "no-raw-json-parse": noRawJsonParse,
  },
};

export default plugin;

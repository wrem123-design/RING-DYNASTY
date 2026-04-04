const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const INDEX_PATH = path.join(ROOT, "index.html");
const REGISTRY_PATH = path.join(ROOT, "data", "custom", "custom_sprite_registry.json");
const MANIFEST_PATH = path.join(ROOT, "data", "custom", "custom_sprite_manifest.js");
const REPORT_PATH = path.join(ROOT, "data", "custom", "reports", "common_stand_fallbacks_report.json");

const COMMON_FALLBACK_IDS = [
  "akira_tozawa",
  "andre_chase",
  "brooks_jensen",
  "charlie_dempsey",
  "dexter_lumis",
  "dijak",
  "grayson_waller",
  "johnny_gargano"
];

function readUtf8(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function extractLiteral(source, expression) {
  const match = source.match(expression);
  if (!match) {
    throw new Error(`Failed to extract literal for ${expression}`);
  }
  const literal = String(match[1]).trim().replace(/;$/, "");
  return Function(`return (${literal});`)();
}

function hashIndex(value, modulo) {
  const digest = crypto.createHash("sha256").update(String(value)).digest();
  return digest.readUInt32BE(0) % modulo;
}

function getGradeFromPopularity(popularity) {
  if (popularity >= 98) return "LEGEND";
  if (popularity >= 92) return "S";
  if (popularity >= 78) return "A";
  if (popularity >= 60) return "B";
  return "C";
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getPopularityScore(baseName, overrides) {
  if (Number.isFinite(overrides[baseName])) {
    return overrides[baseName];
  }
  return 42 + (hashString(baseName) % 24);
}

function writeManifest(manifestPath, spriteOverrides, customTemplates) {
  const lines = [
    "window.CUSTOM_WRESTLER_SPRITES = Object.assign({}, window.CUSTOM_WRESTLER_SPRITES || {}, "
      + JSON.stringify(spriteOverrides, null, 2)
      + ");",
    "",
    "window.CUSTOM_WRESTLER_TEMPLATES = (function(existingTemplates) {",
    "  const merged = {};",
    "  (Array.isArray(existingTemplates) ? existingTemplates : []).forEach(function(entry) {",
    "    if (entry && typeof entry.id === 'string' && entry.id) {",
    "      merged[entry.id] = entry;",
    "    }",
    "  });",
    "  " + JSON.stringify(customTemplates, null, 2) + ".forEach(function(entry) {",
    "    if (entry && typeof entry.id === 'string' && entry.id) {",
    "      merged[entry.id] = Object.assign({}, merged[entry.id] || {}, entry);",
    "    }",
    "  });",
    "  return Object.keys(merged).map(function(key) { return merged[key]; });",
    "})(window.CUSTOM_WRESTLER_TEMPLATES);",
    ""
  ];
  fs.writeFileSync(manifestPath, lines.join("\n"), "utf8");
}

function main() {
  const indexSource = readUtf8(INDEX_PATH);
  const portraitFiles = extractLiteral(indexSource, /const PORTRAIT_FILES = (\[[\s\S]*?\]);/);
  const popularityOverrides = extractLiteral(indexSource, /const POPULARITY_OVERRIDES = (\{[\s\S]*?\n    \})/);

  const registry = JSON.parse(readUtf8(REGISTRY_PATH));
  const sprites = registry.sprites || {};
  const templates = registry.templates || {};
  const sets = registry.sets || {};

  const commonSourceMap = {};
  COMMON_FALLBACK_IDS.forEach((id) => {
    const sprite = sprites[id];
    if (!sprite || typeof sprite.spriteSheet !== "string" || !sprite.spriteSheet) {
      throw new Error(`Missing common fallback sprite source for ${id}`);
    }
    commonSourceMap[id] = sprite.spriteSheet;
  });

  const missing = portraitFiles
    .map((fileName) => fileName.replace(/\.[^.]+$/, ""))
    .map((id) => ({
      id,
      popularity: getPopularityScore(id, popularityOverrides)
    }))
    .map((entry) => ({
      ...entry,
      grade: getGradeFromPopularity(entry.popularity)
    }))
    .filter((entry) => !sprites[entry.id]);

  const assignments = missing.map((entry) => {
    const sourceId = COMMON_FALLBACK_IDS[hashIndex(entry.id, COMMON_FALLBACK_IDS.length)];
    sprites[entry.id] = {
      spriteSheet: commonSourceMap[sourceId],
      portraitMode: true,
      spriteFrames: 1,
      sharedFallbackSourceId: sourceId
    };
    return {
      wrestler_id: entry.id,
      grade: entry.grade,
      fallback_source_id: sourceId,
      sprite_path: commonSourceMap[sourceId]
    };
  });

  sets.common_stand_fallbacks = {
    generatedAt: new Date().toISOString(),
    wrestler_ids: assignments.map((entry) => entry.wrestler_id),
    source_ids: COMMON_FALLBACK_IDS.slice(),
    count: assignments.length
  };

  const nextRegistry = {
    sprites,
    templates,
    sets
  };

  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(nextRegistry, null, 2), "utf8");
  writeManifest(MANIFEST_PATH, sprites, Object.values(templates));
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify({
    generatedAt: new Date().toISOString(),
    count: assignments.length,
    assignments
  }, null, 2), "utf8");

  console.log(`assigned=${assignments.length}`);
  console.log(`report=${path.relative(ROOT, REPORT_PATH).replace(/\\\\/g, "/")}`);
}

main();

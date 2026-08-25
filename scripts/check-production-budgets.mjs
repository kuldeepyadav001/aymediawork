import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const root = process.cwd();
const buildRoot = join(root, ".next");
const publicImagesRoot = join(root, "public", "images");
const limits = {
  image: 300 * 1024,
  imageTotal: 4 * 1024 * 1024,
  prerenderedHtml: 200 * 1024,
  publicRouteGzipJs: 250 * 1024,
  totalCss: 100 * 1024,
  totalCssGzip: 24 * 1024,
};

function filesUnder(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

function bytesLabel(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function assertBudget(condition, message, failures) {
  if (!condition) failures.push(message);
}

if (!existsSync(buildRoot)) {
  throw new Error("No .next production build found. Run npm run build first.");
}

const failures = [];
const imageFiles = filesUnder(publicImagesRoot).filter((path) =>
  [".avif", ".jpeg", ".jpg", ".png", ".svg", ".webp"].includes(
    extname(path).toLowerCase(),
  ),
);
assertBudget(
  imageFiles.length > 0,
  "No public image assets were found; verify the asset path and build inputs.",
  failures,
);
const imageSizes = imageFiles.map((path) => ({
  path,
  size: statSync(path).size,
}));
const imageTotal = imageSizes.reduce((total, asset) => total + asset.size, 0);
const largestImage = imageSizes.toSorted((a, b) => b.size - a.size)[0];

for (const asset of imageSizes) {
  assertBudget(
    asset.size <= limits.image,
    `${relative(root, asset.path)} is ${bytesLabel(asset.size)}; limit ${bytesLabel(limits.image)}.`,
    failures,
  );
}
assertBudget(
  imageTotal <= limits.imageTotal,
  `Public images total ${bytesLabel(imageTotal)}; limit ${bytesLabel(limits.imageTotal)}.`,
  failures,
);

const cssFiles = filesUnder(join(buildRoot, "static")).filter(
  (path) => extname(path) === ".css",
);
assertBudget(
  cssFiles.length > 0,
  "No generated CSS assets were found; verify the production build output.",
  failures,
);
const cssTotal = cssFiles.reduce(
  (total, path) => total + statSync(path).size,
  0,
);
const cssGzipTotal = cssFiles.reduce(
  (total, path) => total + gzipSync(readFileSync(path)).byteLength,
  0,
);
assertBudget(
  cssTotal <= limits.totalCss,
  `Production CSS totals ${bytesLabel(cssTotal)}; limit ${bytesLabel(limits.totalCss)}.`,
  failures,
);
assertBudget(
  cssGzipTotal <= limits.totalCssGzip,
  `Gzipped production CSS totals ${bytesLabel(cssGzipTotal)}; limit ${bytesLabel(limits.totalCssGzip)}.`,
  failures,
);

const buildManifest = JSON.parse(
  readFileSync(join(buildRoot, "build-manifest.json"), "utf8"),
);
const sharedClientFiles = buildManifest.rootMainFiles ?? [];
const publicReferenceManifests = filesUnder(
  join(buildRoot, "server", "app"),
).filter(
  (path) =>
    path.includes(`${join("app", "(public)")}`) &&
    path.endsWith("_client-reference-manifest.js"),
);
assertBudget(
  publicReferenceManifests.length > 0,
  "No public-route client reference manifests were found; verify the Next.js build output.",
  failures,
);
const routePayloads = publicReferenceManifests.map((manifestPath) => {
  const source = readFileSync(manifestPath, "utf8");
  const routeFiles = [...source.matchAll(/static\/chunks[^"']+\.js/g)].map(
    ([path]) => path,
  );
  const files = [...new Set([...sharedClientFiles, ...routeFiles])];
  const payload = files.reduce(
    (totals, path) => {
      const contents = readFileSync(join(buildRoot, decodeURIComponent(path)));
      totals.raw += contents.byteLength;
      totals.gzip += gzipSync(contents).byteLength;
      return totals;
    },
    { gzip: 0, raw: 0 },
  );
  return {
    ...payload,
    route: relative(join(buildRoot, "server", "app"), manifestPath).replace(
      /_client-reference-manifest\.js$/,
      "",
    ),
  };
});
const largestRoutePayload = routePayloads.toSorted(
  (a, b) => b.gzip - a.gzip,
)[0];

for (const payload of routePayloads) {
  assertBudget(
    payload.gzip <= limits.publicRouteGzipJs,
    `${payload.route} references ${bytesLabel(payload.gzip)} gzipped JavaScript; limit ${bytesLabel(limits.publicRouteGzipJs)}.`,
    failures,
  );
}

const prerenderedHtmlFiles = filesUnder(
  join(buildRoot, "server", "app"),
).filter((path) => extname(path) === ".html");
assertBudget(
  prerenderedHtmlFiles.length > 0,
  "No prerendered HTML files were found; verify that the expected static public output was generated.",
  failures,
);
const largestHtml = prerenderedHtmlFiles
  .map((path) => ({ path, size: statSync(path).size }))
  .toSorted((a, b) => b.size - a.size)[0];
if (largestHtml) {
  assertBudget(
    largestHtml.size <= limits.prerenderedHtml,
    `${relative(root, largestHtml.path)} is ${bytesLabel(largestHtml.size)}; limit ${bytesLabel(limits.prerenderedHtml)}.`,
    failures,
  );
}

console.log("Production performance budgets");
console.log(
  `- Public images: ${imageFiles.length} files, ${bytesLabel(imageTotal)} total${largestImage ? `; largest ${relative(root, largestImage.path)} at ${bytesLabel(largestImage.size)}` : ""}`,
);
console.log(
  `- Production CSS: ${bytesLabel(cssTotal)} raw / ${bytesLabel(cssGzipTotal)} gzip`,
);
if (largestRoutePayload) {
  console.log(
    `- Largest public route JS reference: ${largestRoutePayload.route}, ${bytesLabel(largestRoutePayload.raw)} raw / ${bytesLabel(largestRoutePayload.gzip)} gzip`,
  );
}
if (largestHtml) {
  console.log(
    `- Largest prerendered HTML: ${relative(root, largestHtml.path)}, ${bytesLabel(largestHtml.size)}`,
  );
}

if (failures.length) {
  console.error("\nBudget failures:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("- Result: PASS");
}

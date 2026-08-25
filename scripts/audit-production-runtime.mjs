import { performance } from "node:perf_hooks";

const baseUrl = new URL(
  process.env.RUNTIME_AUDIT_BASE_URL?.trim() || "http://localhost:3000",
);
const requiredPublicPaths = [
  "/",
  "/about",
  "/services",
  "/services/video-editing",
  "/services/2d-and-3d-animation",
  "/services/saas-video",
  "/services/graphic-design",
  "/services/ai-animation",
  "/services/web-development",
  "/services/ai-automation",
  "/services/social-media-marketing",
  "/services/facebook-and-meta-ads",
  "/services/cgi-and-vfx",
  "/work",
  "/work/signal-in-the-noise",
  "/work/interface-in-motion",
  "/work/worlds-between-frames",
  "/work/identity-in-rhythm",
  "/work/connected-by-design",
  "/work/impossible-made-visible",
  "/testimonials",
  "/blog",
  "/blog/one-idea-many-outputs",
  "/blog/motion-that-carries-meaning",
  "/blog/automation-with-a-human-thread",
  "/blog/website-as-a-living-system",
  "/contact",
  "/privacy",
  "/terms",
];
const failures = [];
const internalLinks = new Set();
const routeResults = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

async function request(path, init = {}) {
  const started = performance.now();
  const response = await fetch(new URL(path, baseUrl), {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
    ...init,
  });
  const body = await response.text();
  return {
    body,
    duration: performance.now() - started,
    response,
  };
}

function assertSecurityHeaders(path, response) {
  assert(
    response.headers.get("x-content-type-options") === "nosniff",
    `${path}: missing X-Content-Type-Options: nosniff.`,
  );
  assert(
    response.headers.get("referrer-policy") ===
      "strict-origin-when-cross-origin",
    `${path}: unexpected Referrer-Policy.`,
  );
  assert(
    response.headers.get("permissions-policy")?.includes("camera=()"),
    `${path}: missing restrictive Permissions-Policy.`,
  );
  assert(
    response.headers.get("x-frame-options") === "DENY",
    `${path}: missing X-Frame-Options: DENY (use a production server).`,
  );
  assert(
    response.headers
      .get("strict-transport-security")
      ?.includes("max-age=31536000"),
    `${path}: missing production HSTS policy.`,
  );
  assert(
    !response.headers.has("x-powered-by"),
    `${path}: X-Powered-By must remain disabled.`,
  );
}

function titleCount(html) {
  return [...html.matchAll(/<title(?:\s[^>]*)?>/gi)].length;
}

function headingOneCount(html) {
  return [...html.matchAll(/<h1(?:\s[^>]*)?>/gi)].length;
}

function collectInternalLinks(html) {
  for (const match of html.matchAll(/\shref=(["'])(.*?)\1/gi)) {
    const href = match[2]?.replaceAll("&amp;", "&");
    if (!href || href.startsWith("#")) continue;

    try {
      const url = new URL(href, baseUrl);
      if (
        url.origin === baseUrl.origin &&
        !url.pathname.startsWith("/_next/") &&
        !url.pathname.startsWith("/api/")
      ) {
        internalLinks.add(`${url.pathname}${url.search}`);
      }
    } catch {
      failures.push(`Invalid internal link: ${href}.`);
    }
  }
}

async function auditPublicPath(path) {
  const { body, duration, response } = await request(path);
  routeResults.push({ bytes: Buffer.byteLength(body), duration, path });

  assert(
    response.status === 200,
    `${path}: expected 200, got ${response.status}.`,
  );
  assert(
    response.headers.get("content-type")?.includes("text/html"),
    `${path}: expected an HTML response.`,
  );
  assertSecurityHeaders(path, response);
  assert(
    titleCount(body) === 1,
    `${path}: expected exactly one document title.`,
  );
  assert(
    /<meta[^>]+name=["']description["'][^>]+content=/i.test(body) ||
      /<meta[^>]+content=["'][^"']+["'][^>]+name=["']description["']/i.test(
        body,
      ),
    `${path}: missing meta description.`,
  );
  assert(
    /<link[^>]+rel=["']canonical["'][^>]+href=/i.test(body) ||
      /<link[^>]+href=["'][^"']+["'][^>]+rel=["']canonical["']/i.test(body),
    `${path}: missing canonical link.`,
  );
  assert(
    headingOneCount(body) === 1,
    `${path}: expected exactly one h1, found ${headingOneCount(body)}.`,
  );
  assert(
    body.includes('href="#main-content"'),
    `${path}: missing skip-to-content link.`,
  );
  assert(
    /<main[^>]+id=["']main-content["']/i.test(body),
    `${path}: missing main content landmark.`,
  );
  assert(
    !/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(body),
    `${path}: public route unexpectedly declares noindex.`,
  );
  assert(
    !response.headers.get("x-robots-tag")?.includes("noindex"),
    `${path}: public route unexpectedly sends X-Robots-Tag noindex.`,
  );
  assert(
    !body.includes("mailto:"),
    `${path}: contains an unapproved mail link.`,
  );
  assert(!body.includes("tel:"), `${path}: contains an unapproved phone link.`);
  assert(
    !/(?:googletagmanager|google-analytics)\.com|\/_vercel\/(?:insights|speed-insights)|(?:va\.vercel-scripts|vitals\.vercel-insights)\.com/i.test(
      body,
    ),
    `${path}: optional analytics loaded before browser consent.`,
  );
  collectInternalLinks(body);
}

console.log(`Auditing ${baseUrl.origin} ...`);

for (const path of requiredPublicPaths) {
  await auditPublicPath(path);
}

const sitemap = await request("/sitemap.xml");
assert(sitemap.response.status === 200, "/sitemap.xml: expected 200.");
assert(
  sitemap.response.headers.get("content-type")?.includes("xml"),
  "/sitemap.xml: expected an XML response.",
);
const sitemapPaths = [
  ...new Set(
    [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, value]) => {
      try {
        return new URL(value).pathname;
      } catch {
        return "INVALID_URL";
      }
    }),
  ),
];
for (const path of requiredPublicPaths) {
  assert(sitemapPaths.includes(path), `/sitemap.xml: missing ${path}.`);
}
for (const path of sitemapPaths) {
  assert(
    !path.startsWith("/admin") && !path.startsWith("/api"),
    `/sitemap.xml: private path exposed: ${path}.`,
  );
  if (!requiredPublicPaths.includes(path) && path !== "INVALID_URL") {
    await auditPublicPath(path);
  }
}
assert(
  !sitemapPaths.includes("INVALID_URL"),
  "/sitemap.xml: invalid URL found.",
);

for (const path of internalLinks) {
  const linked = await request(path);
  assert(
    linked.response.status >= 200 && linked.response.status < 400,
    `Internal link ${path}: expected a successful response, got ${linked.response.status}.`,
  );
}

const robots = await request("/robots.txt");
assert(robots.response.status === 200, "/robots.txt: expected 200.");
assert(
  /^Disallow: \/admin\/?$/m.test(robots.body) &&
    /^Disallow: \/api\/?$/m.test(robots.body),
  "/robots.txt: private surfaces are not disallowed.",
);
assert(
  robots.body.includes("Sitemap:"),
  "/robots.txt: sitemap declaration missing.",
);

const adminLogin = await request("/admin/login");
assert(adminLogin.response.status === 200, "/admin/login: expected 200.");
assertSecurityHeaders("/admin/login", adminLogin.response);
assert(
  adminLogin.response.headers.get("x-robots-tag")?.includes("noindex"),
  "/admin/login: missing X-Robots-Tag noindex.",
);
assert(
  /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(adminLogin.body),
  "/admin/login: missing robots noindex metadata.",
);

const protectedAdmin = await request("/admin/dashboard");
assert(
  [302, 303, 307, 308].includes(protectedAdmin.response.status),
  `/admin/dashboard: expected authentication redirect, got ${protectedAdmin.response.status}.`,
);
assert(
  protectedAdmin.response.headers.get("location")?.includes("/admin/login"),
  "/admin/dashboard: anonymous visitor was not redirected to login.",
);

for (const path of [
  "/services/not-a-published-service",
  "/services/video-editing/unexpected",
  "/work/not-a-published-study",
  "/blog/not-a-published-article",
]) {
  const missing = await request(path);
  assert(missing.response.status === 404, `${path}: expected hard 404.`);
}

for (const path of ["/api/inquiries", "/api/newsletter"]) {
  const methodCheck = await request(path);
  assert(
    methodCheck.response.status === 405,
    `${path}: unsupported GET should return 405, got ${methodCheck.response.status}.`,
  );
  assert(
    methodCheck.response.headers.get("x-robots-tag")?.includes("noindex"),
    `${path}: API response missing noindex header.`,
  );

  const crossSite = await request(path, {
    body: "{}",
    headers: {
      "content-type": "application/json",
      origin: "https://cross-site.invalid",
      "sec-fetch-site": "cross-site",
    },
    method: "POST",
  });
  assert(
    crossSite.response.status === 403,
    `${path}: cross-site POST should return 403, got ${crossSite.response.status}.`,
  );
  assert(
    crossSite.response.headers.get("cache-control") === "no-store",
    `${path}: mutation response must be no-store.`,
  );
}

const contact = routeResults.find((route) => route.path === "/contact");
if (contact) {
  const contactPage = await request("/contact?type=client");
  const newsletterInput = contactPage.body.match(
    /<input[^>]+name=["']newsletterConsent["'][^>]*>/i,
  )?.[0];
  assert(
    Boolean(newsletterInput),
    "/contact: standalone newsletter-consent input missing.",
  );
  assert(
    newsletterInput ? !/\schecked(?:=|\s|>)/i.test(newsletterInput) : false,
    "/contact: newsletter consent must be unchecked by default.",
  );
  assert(
    !/name=["'][^"']*(?:budget|payment|price)[^"']*["']/i.test(
      contactPage.body,
    ),
    "/contact: prohibited budget, payment, or pricing field found.",
  );
}

const imageUrl = new URL("/_next/image", baseUrl);
imageUrl.searchParams.set("url", "/images/home/hero-cinematic-frame.jpg");
imageUrl.searchParams.set("w", "640");
imageUrl.searchParams.set("q", "75");
const imageResponse = await fetch(imageUrl, {
  headers: { accept: "image/avif,image/webp,image/*" },
  signal: AbortSignal.timeout(15_000),
});
const optimizedImage = Buffer.from(await imageResponse.arrayBuffer());
assert(imageResponse.status === 200, "Image optimizer: expected 200.");
assert(
  imageResponse.headers.get("content-type")?.startsWith("image/"),
  "Image optimizer: expected an image response.",
);
assert(
  optimizedImage.byteLength < 100 * 1024,
  `Image optimizer: 640px hero is ${(optimizedImage.byteLength / 1024).toFixed(1)} KiB; expected under 100 KiB.`,
);

const durations = routeResults
  .map(({ duration }) => duration)
  .toSorted((a, b) => a - b);
const totalBytes = routeResults.reduce(
  (total, route) => total + route.bytes,
  0,
);
const slowest = routeResults.toSorted((a, b) => b.duration - a.duration)[0];
const largest = routeResults.toSorted((a, b) => b.bytes - a.bytes)[0];
const median = durations[Math.floor(durations.length / 2)] ?? 0;

console.log(`- Public HTML routes audited: ${routeResults.length}`);
console.log(`- Sitemap URLs found: ${sitemapPaths.length}`);
console.log(`- Unique internal links checked: ${internalLinks.size}`);
console.log(
  `- Median local response: ${median.toFixed(0)} ms; slowest ${slowest?.path ?? "n/a"} at ${slowest?.duration.toFixed(0) ?? "0"} ms`,
);
console.log(
  `- HTML transferred: ${(totalBytes / 1024).toFixed(1)} KiB total; largest ${largest?.path ?? "n/a"} at ${((largest?.bytes ?? 0) / 1024).toFixed(1)} KiB`,
);
console.log(
  `- Optimized 640px hero: ${(optimizedImage.byteLength / 1024).toFixed(1)} KiB`,
);

if (failures.length) {
  console.error(`\nRuntime audit failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("- Result: PASS");
}

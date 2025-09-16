/**
 * Test script for SEO middleware functionality
 * Tests bot detection and meta injection without middleware complexity
 */

import { 
  checkIsBotRequest, 
  generateMetaTagsHtml,
  generateCanonicalHtml,
  generateJsonLdHtml,
  injectMetaIntoHtml 
} from "./middleware/seo";
import { 
  getPageMetaWithFallback, 
  buildMetaTags, 
  buildCanonicalLink,
  buildJsonLd
} from "../shared/seo";

// Test bot detection
console.log("=== Testing Bot Detection ===");
const testUserAgents = [
  'TelegramBot (like TwitterBot)',
  'facebookexternalhit/1.1',
  'LinkedInBot/1.0',
  'vkShare',
  'WhatsApp/2.2',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0',
  'curl/7.68.0'
];

testUserAgents.forEach(ua => {
  const isBot = checkIsBotRequest(ua);
  console.log(`${isBot ? '✓' : '✗'} ${ua} -> ${isBot ? 'BOT' : 'USER'}`);
});

// Test meta generation
console.log("\n=== Testing Meta Generation ===");
const testRoutes = ['/', '/about', '/blog', '/app/dashboard'];
const baseUrl = 'https://rescrub.replit.app';

testRoutes.forEach(route => {
  console.log(`\nRoute: ${route}`);
  
  const pageMeta = getPageMetaWithFallback(route);
  console.log(`Title: ${pageMeta.title}`);
  console.log(`Description: ${pageMeta.description.slice(0, 100)}...`);
  console.log(`Type: ${pageMeta.type}`);
  
  const metaTags = buildMetaTags(pageMeta, route, baseUrl);
  console.log(`Meta tags generated: ${metaTags.length}`);
  
  const canonical = buildCanonicalLink(route, pageMeta, baseUrl);
  console.log(`Canonical: ${canonical.href}`);
});

// Test HTML injection
console.log("\n=== Testing HTML Injection ===");
const sampleHtml = `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <title>Original Title</title>
    <meta name="description" content="Original description" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

const testRoute = '/';
const pageMeta = getPageMetaWithFallback(testRoute);
const metaTags = buildMetaTags(pageMeta, testRoute, baseUrl);
const canonical = buildCanonicalLink(testRoute, pageMeta, baseUrl);
const jsonLd = buildJsonLd('Organization', {}, baseUrl);

const injectedHtml = injectMetaIntoHtml(
  sampleHtml,
  pageMeta.title,
  metaTags,
  canonical,
  jsonLd
);

console.log("HTML injection test:");
console.log(injectedHtml.includes(pageMeta.title) ? '✓ Title injection works' : '✗ Title injection failed');
console.log(injectedHtml.includes('og:title') ? '✓ Open Graph injection works' : '✗ Open Graph injection failed');
console.log(injectedHtml.includes('application/ld+json') ? '✓ JSON-LD injection works' : '✗ JSON-LD injection failed');
console.log(injectedHtml.includes(canonical.href) ? '✓ Canonical injection works' : '✗ Canonical injection failed');

console.log("\n=== SEO Test Complete ===");
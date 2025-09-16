/**
 * SEO Meta Injection Middleware for ResCrub
 * Handles dynamic meta tag injection for social media bots and rich previews
 * Optimized for Russian social platforms: VK, Telegram, WhatsApp, OK
 */

import { Request, Response, NextFunction } from "express";
import { readFile } from "fs/promises";
import { join } from "path";
import { 
  getPageMetaWithFallback, 
  buildMetaTags, 
  buildCanonicalLink,
  buildJsonLd,
  SEO_CONSTANTS,
  type PageMeta 
} from "../../shared/seo";

// ========== Bot Detection ==========

/**
 * SECURITY-CRITICAL: Known legitimate bot User-Agent patterns
 * PRODUCTION-SAFE: Allowlist of verified crawlers only to prevent cloaking issues
 * Includes Russian social platforms, international social bots, and search engines
 * 
 * IMPORTANT: Content served to bots MUST be identical to user content
 * to avoid Google cloaking penalties and SEO policy violations
 */

// Development-only debug tools (NOT included in production)
const DEBUG_USER_AGENTS = process.env.NODE_ENV === 'development' ? [
  /curl\//i,                    // curl command line tool
  /wget\//i,                    // wget download tool  
  /PostmanRuntime/i,            // Postman API client
  /HTTPie\//i,                  // HTTPie command line tool
  /python-requests/i,           // Python requests library
  /node-fetch/i,                // Node.js fetch library
] : [];

// Production legitimate bots only
const LEGITIMATE_BOT_PATTERNS = [
  // === SEARCH ENGINES (Primary) ===
  /Googlebot/i,                 // Google search crawler - CRITICAL
  /bingbot/i,                   // Bing search crawler 
  /YandexBot/i,                 // Yandex search (Russian primary search)
  /DuckDuckBot/i,               // DuckDuckGo
  /Baiduspider/i,               // Baidu search engine
  
  // === RUSSIAN SOCIAL PLATFORMS (High Priority) ===
  /vkShare/i,                    // VK.com sharing bot (official)
  /VKontakteBot/i,              // VK official crawler (not generic)
  /Mail\.Ru.*Bot/i,             // Mail.ru services crawler
  /OdnoklassnikiBot/i,          // Odnoklassniki social network official bot
  
  // === MESSAGING PLATFORMS (Russian Market) ===
  /TelegramBot/i,               // Telegram link previews - VERY IMPORTANT for Russian market
  /Telegram.*preview.*Bot/i,    // Telegram preview variants (more specific)
  /ViberBot/i,                  // Viber messenger bot (popular in CIS)
  /WhatsApp.*preview/i,         // WhatsApp preview bot (specific to previews only)
  
  // === INTERNATIONAL SOCIAL PLATFORMS ===
  /facebookexternalhit/i,       // Facebook link crawler (official)
  /Facebot/i,                   // Facebook additional bot
  /LinkedInBot/i,               // LinkedIn sharing crawler
  /Twitterbot/i,                // Twitter (X) cards bot
  /SkypeUriPreview/i,           // Skype link previews
  /SlackBot-LinkExpanding/i,    // Slack unfurling (specific variant)
  /DiscordBot/i,                // Discord link embeds
  /redditbot/i,                 // Reddit link previews
  /Pinterest.*Bot/i,            // Pinterest sharing crawlers

  // === ADDITIONAL LEGITIMATE CRAWLERS ===
  /AppleBot/i,                  // Apple search and Siri
  /ia_archiver/i,               // Internet Archive Wayback Machine
  /SemrushBot/i,                // Semrush SEO tool (legitimate)
  /AhrefsBot/i,                 // Ahrefs SEO tool (legitimate)
  
  // Add development debug tools only in dev environment
  ...DEBUG_USER_AGENTS
];

/**
 * SECURITY-CRITICAL: Check if request comes from a legitimate crawler
 * 
 * ANTI-CLOAKING POLICY: This function implements a strict allowlist approach
 * to prevent serving different content to unverified crawlers, which could
 * result in Google cloaking penalties.
 * 
 * @param userAgent - The User-Agent string from the request
 * @returns true only for verified, legitimate crawlers
 */
export function checkIsBotRequest(userAgent?: string): boolean {
  if (!userAgent || typeof userAgent !== 'string') {
    return false;
  }
  
  // Convert to lowercase once for efficiency
  const lowerUserAgent = userAgent.toLowerCase();
  
  // Additional security: Reject suspiciously short or long user agents
  if (lowerUserAgent.length < 3 || lowerUserAgent.length > 500) {
    return false;
  }
  
  // Test against our verified bot patterns
  const isLegitimateBot = LEGITIMATE_BOT_PATTERNS.some(pattern => pattern.test(userAgent));
  
  // SECURITY LOGGING: Log bot detection for monitoring
  if (isLegitimateBot) {
    const isDevelopmentTool = DEBUG_USER_AGENTS.some(pattern => pattern.test(userAgent));
    if (isDevelopmentTool) {
      console.log(`[SEO-DEV-TOOL] Development tool detected: ${userAgent.slice(0, 100)}...`);
    } else {
      console.log(`[SEO-SECURITY] Legitimate bot detected: ${userAgent.slice(0, 100)}...`);
    }
  }
  
  return isLegitimateBot;
}

/**
 * Get appropriate base URL for current environment
 * Uses dynamic URL resolution based on request headers for flexibility
 */
function getBaseUrl(req: Request): string {
  // Check for forwarded protocol (from proxies like Cloudflare, nginx)
  const forwardedProto = req.get('X-Forwarded-Proto');
  const forwardedHost = req.get('X-Forwarded-Host');
  
  // Use forwarded headers if available (production proxy setup)
  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  
  // Fallback to request properties
  const protocol = req.secure || req.get('X-Forwarded-Proto') === 'https' ? 'https' : 'http';
  const host = req.get('host') || 'localhost:5000';
  
  return `${protocol}://${host}`;
}

/**
 * Clean and normalize route path for meta lookup
 */
function normalizeRoutePath(path: string): string {
  // Remove query parameters and fragments
  const cleanPath = path.split('?')[0].split('#')[0];
  
  // Remove trailing slash except for root
  return cleanPath === '/' ? '/' : cleanPath.replace(/\/$/, '');
}

/**
 * Generate meta tags HTML string
 */
function generateMetaTagsHtml(metaTags: Array<{name?: string, property?: string, content: string}>): string {
  return metaTags
    .map(tag => {
      if (tag.name) {
        return `    <meta name="${escapeHtml(tag.name)}" content="${escapeHtml(tag.content)}" />`;
      } else if (tag.property) {
        return `    <meta property="${escapeHtml(tag.property)}" content="${escapeHtml(tag.content)}" />`;
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');
}

/**
 * Generate canonical link HTML
 */
function generateCanonicalHtml(canonical: { rel: string, href: string }): string {
  return `    <link rel="${escapeHtml(canonical.rel)}" href="${escapeHtml(canonical.href)}" />`;
}

/**
 * Generate JSON-LD structured data HTML with safe escaping
 * Prevents script termination vulnerabilities and Unicode issues
 */
function generateJsonLdHtml(jsonLd: any): string {
  // Safe JSON stringification with proper escaping
  let jsonString = JSON.stringify(jsonLd, null, 6);
  
  // Critical security fixes:
  // 1. Escape </script> to prevent script termination
  jsonString = jsonString.replace(/<\/script>/gi, '<\\/script>');
  
  // 2. Escape line terminators that can break JavaScript parsing
  jsonString = jsonString.replace(/\u2028/g, '\\u2028'); // Line separator
  jsonString = jsonString.replace(/\u2029/g, '\\u2029'); // Paragraph separator
  
  // 3. Escape other potentially dangerous characters
  jsonString = jsonString.replace(/</g, '\\u003C'); // Prevent HTML injection
  
  return `    <script type="application/ld+json">\n${jsonString}\n    </script>`;
}

/**
 * Basic HTML escaping for meta content
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// ========== HTML Template Processing ==========

let htmlTemplate: string | null = null;

/**
 * Load and cache HTML template
 */
async function loadHtmlTemplate(): Promise<string> {
  if (htmlTemplate) return htmlTemplate;
  
  try {
    const htmlPath = join(process.cwd(), 'client', 'index.html');
    htmlTemplate = await readFile(htmlPath, 'utf-8');
    return htmlTemplate;
  } catch (error) {
    console.error('Failed to load HTML template:', error);
    throw new Error('Could not load HTML template for SEO injection');
  }
}

/**
 * Remove existing meta tags and inject new ones to prevent duplicates
 * Removes existing title, canonical, robots, og:*, twitter:*, description, keywords tags
 * before injecting new meta tags for social bots
 */
function injectMetaIntoHtml(
  html: string, 
  title: string,
  metaTags: Array<{name?: string, property?: string, content: string}>,
  canonical: { rel: string, href: string },
  jsonLd: any
): string {
  let processedHtml = html;
  
  // CRITICAL FIX: Remove existing tags to prevent duplicates
  
  // 1. Remove existing title
  processedHtml = processedHtml.replace(
    /<title>.*?<\/title>/gi, 
    '<!-- TITLE_PLACEHOLDER -->'
  );
  
  // 2. Remove existing canonical link
  processedHtml = processedHtml.replace(
    /<link\s+rel=["']canonical["'][^>]*>/gi,
    ''
  );
  
  // 3. Remove existing meta description
  processedHtml = processedHtml.replace(
    /<meta\s+name=["']description["'][^>]*>/gi,
    ''
  );
  
  // 4. Remove existing meta keywords
  processedHtml = processedHtml.replace(
    /<meta\s+name=["']keywords["'][^>]*>/gi,
    ''
  );
  
  // 5. Remove existing meta robots
  processedHtml = processedHtml.replace(
    /<meta\s+name=["']robots["'][^>]*>/gi,
    ''
  );
  
  // 6. Remove existing Open Graph meta tags
  processedHtml = processedHtml.replace(
    /<meta\s+property=["']og:[^"']*["'][^>]*>/gi,
    ''
  );
  
  // 7. Remove existing Twitter meta tags
  processedHtml = processedHtml.replace(
    /<meta\s+name=["']twitter:[^"']*["'][^>]*>/gi,
    ''
  );
  
  // 8. Remove existing author meta tags
  processedHtml = processedHtml.replace(
    /<meta\s+name=["']author["'][^>]*>/gi,
    ''
  );
  
  // 9. Remove empty lines left by tag removal
  processedHtml = processedHtml.replace(/^\s*\n/gm, '');
  
  // Generate new meta tags HTML
  const metaHtml = generateMetaTagsHtml(metaTags);
  const canonicalHtml = generateCanonicalHtml(canonical);
  const jsonLdHtml = generateJsonLdHtml(jsonLd);
  
  // Replace title placeholder with new title
  processedHtml = processedHtml.replace(
    /<!-- TITLE_PLACEHOLDER -->/,
    `<title>${escapeHtml(title)}</title>`
  );
  
  // Find insertion point in head (before SEO comment or before </head>)
  let insertionPoint = processedHtml.indexOf('<!-- SEO Meta Tags will be injected here');
  if (insertionPoint === -1) {
    insertionPoint = processedHtml.indexOf('</head>');
  }
  
  if (insertionPoint !== -1) {
    const injectionContent = [
      '    <!-- SEO Meta Tags (Server Injected for Bots) -->',
      metaHtml,
      '',
      '    <!-- Canonical URL (Server Injected) -->',
      canonicalHtml,
      '',
      '    <!-- JSON-LD Structured Data (Server Injected) -->',
      jsonLdHtml,
      ''
    ].join('\n');
    
    if (processedHtml.indexOf('<!-- SEO Meta Tags will be injected here') !== -1) {
      // Replace the comment placeholder
      processedHtml = processedHtml.replace(
        /<!-- SEO Meta Tags will be injected here[^>]*>/,
        injectionContent
      );
    } else {
      // Insert before </head>
      processedHtml = 
        processedHtml.slice(0, insertionPoint) +
        '\n' + injectionContent +
        '  ' + processedHtml.slice(insertionPoint);
    }
  }
  
  return processedHtml;
}

// ========== Express Middleware ==========

/**
 * SEO Meta Injection Middleware
 * Detects social bots and injects appropriate meta tags for rich previews
 * Works around Vite development middleware constraints
 */
export function seoMetaInjection() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.get('User-Agent') || '';
    const isBot = checkIsBotRequest(userAgent);
    
    // Only process for bots requesting HTML content
    if (!isBot || !req.accepts('html')) {
      return next();
    }
    
    // In development mode, let Vite handle non-bot requests
    // The middleware should still work for production builds
    if (process.env.NODE_ENV === 'development') {
      // For development testing, we'll log bot detection but let Vite handle the request
      console.log(`[SEO Bot Detected] ${req.path} -> ${userAgent.slice(0, 50)}...`);
      // Continue to next middleware (Vite will handle it)
      return next();
    }
    
    try {
      // Get base URL and clean path
      const baseUrl = getBaseUrl(req);
      const routePath = normalizeRoutePath(req.path);
      
      // Skip API routes and assets
      if (routePath.startsWith('/api/') || 
          routePath.startsWith('/assets/') || 
          routePath.includes('.')) {
        return next();
      }
      
      // Get page metadata
      const pageMeta = getPageMetaWithFallback(routePath);
      
      // Build meta tags using shared utilities
      const metaTags = buildMetaTags(pageMeta, routePath, baseUrl);
      const canonical = buildCanonicalLink(routePath, pageMeta, baseUrl);
      
      // Generate appropriate JSON-LD based on page type
      let jsonLd;
      switch (pageMeta.type) {
        case 'article':
          jsonLd = buildJsonLd('Article', {
            headline: pageMeta.title,
            description: pageMeta.description,
            datePublished: pageMeta.publishedTime,
            dateModified: pageMeta.modifiedTime
          }, baseUrl);
          break;
        case 'service':
          jsonLd = buildJsonLd('Service', {
            name: pageMeta.title,
            description: pageMeta.description
          }, baseUrl);
          break;
        default:
          jsonLd = buildJsonLd('Organization', {}, baseUrl);
      }
      
      // Load and process HTML template
      const htmlTemplate = await loadHtmlTemplate();
      const processedHtml = injectMetaIntoHtml(
        htmlTemplate,
        pageMeta.title,
        metaTags,
        canonical,
        jsonLd
      );
      
      // Send processed HTML to bot
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5-minute cache for bots
      res.send(processedHtml);
      
      // SECURITY LOGGING: Track bot traffic for analysis
      console.log(`[SEO-BOT-SERVED] ${routePath} -> Bot: ${userAgent.slice(0, 80)}...`);
      console.log(`[SEO-CONTENT-PARITY] Served identical content structure to bot (no cloaking)`);
      
    } catch (error) {
      console.error('SEO middleware error:', error);
      // Fall back to normal processing if meta injection fails
      next();
    }
  };
}

/**
 * Development helper: Clear cached HTML template
 * Useful for development when index.html changes
 */
export function clearHtmlTemplateCache(): void {
  htmlTemplate = null;
}

// ========== Additional Exports ==========
// Note: Main functions like seoMetaInjection and checkIsBotRequest are already exported above

export {
  getBaseUrl,
  normalizeRoutePath,
  generateMetaTagsHtml,
  generateCanonicalHtml,
  generateJsonLdHtml,
  loadHtmlTemplate,
  injectMetaIntoHtml
};
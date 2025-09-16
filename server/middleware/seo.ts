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
 * Known social media bot User-Agent patterns
 * Tightened to specific, known bot identifiers to avoid false positives
 * Includes Russian social platforms and international ones
 */
const SOCIAL_BOT_PATTERNS = [
  // Russian social platforms (specific patterns)
  /vkShare/i,                    // VK.com sharing bot
  /VKontakteBot/i,              // VK official bot (not generic VKontakte)
  /Mail\.RuBot/i,               // Mail.ru services
  /YandexBot/i,                 // Yandex search and services
  /OdnoklassnikiBot/i,          // Odnoklassniki social network bot
  
  // Telegram (very important for Russian market)
  /TelegramBot/i,               // Telegram link previews
  /Telegram.*Bot/i,             // Telegram bot variants
  
  // WhatsApp (popular in Russia)
  /WhatsApp.*Bot/i,             // WhatsApp bots only, not the app
  /WhatsApp.*Preview/i,         // WhatsApp preview bot
  
  // International social platforms (specific bots)
  /facebookexternalhit/i,       // Facebook link crawler
  /Facebot/i,                   // Facebook bot
  /LinkedInBot/i,               // LinkedIn sharing
  /Twitterbot/i,                // Twitter (X) cards
  /SkypeUriPreview/i,           // Skype link previews
  /SlackBot/i,                  // Slack unfurling
  /DiscordBot/i,                // Discord link embeds
  /redditbot/i,                 // Reddit link previews
  /PinterestBot/i,              // Pinterest sharing bot (specific)
  
  // Search engines (specific bot patterns)
  /Googlebot/i,                 // Google search crawler
  /bingbot/i,                   // Bing search crawler
  /DuckDuckBot/i,               // DuckDuckGo
  
  // Messaging apps popular in CIS (specific bots)
  /ViberBot/i,                  // Viber messenger bot
  
  // Development and testing (kept for debugging)
  /curl/i,                      // CLI testing
  /wget/i,                      // CLI downloading
  /PostmanRuntime/i             // API testing
];

/**
 * Check if request comes from a social media bot or crawler
 */
export function checkIsBotRequest(userAgent?: string): boolean {
  if (!userAgent) return false;
  
  return SOCIAL_BOT_PATTERNS.some(pattern => pattern.test(userAgent));
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
      
      // Log bot request for monitoring
      console.log(`[SEO Bot] ${routePath} -> ${userAgent.slice(0, 50)}...`);
      
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
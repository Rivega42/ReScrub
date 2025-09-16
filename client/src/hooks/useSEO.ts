import { useEffect, useRef, useMemo } from 'react';
import { 
  PageMeta, 
  buildMetaTags, 
  buildCanonicalLink,
  SEO_CONSTANTS 
} from '@shared/seo';

export interface UseSEOOptions {
  /** Page metadata for SEO */
  meta: PageMeta;
  /** Current route path for canonical URL generation */
  path: string;
  /** Base URL for canonical and Open Graph URLs */
  baseUrl?: string;
  /** Whether to manage JSON-LD structured data */
  enableJsonLd?: boolean;
  /** Custom JSON-LD structured data */
  jsonLd?: Record<string, any> | Record<string, any>[];
}

/**
 * Safely serialize JSON-LD data for script injection
 * Prevents XSS while maintaining JSON validity for search engines
 */
function safeJsonLdSerialize(data: Record<string, any>): string {
  try {
    const jsonString = JSON.stringify(data);
    
    // Only escape what's necessary to prevent XSS without breaking JSON:
    // 1. Escape closing script tags to prevent premature script termination
    // 2. Escape Unicode line separators that can break JavaScript parsing
    // 3. Optionally escape '<' for extra safety
    // DO NOT escape double quotes or ampersands - this breaks JSON validity!
    return jsonString
      .replace(/<\/(script)/gi, '<\\/$1')  // Escape closing script tags
      .replace(/[\u2028\u2029]/g, '\\u$&')   // Escape line/paragraph separators
      .replace(/</g, '\\u003C');           // Escape < for extra safety
  } catch (error) {
    console.warn('Failed to serialize JSON-LD data:', error);
    return '{}';
  }
}

/**
 * Hook for managing SEO meta tags in React SPA
 * Handles dynamic document updates during client-side navigation
 * Includes proper JSON-LD serialization and stale tag cleanup
 */
export function useSEO(options: UseSEOOptions): void {
  const { 
    meta, 
    path, 
    baseUrl = SEO_CONSTANTS.BASE_URL, 
    enableJsonLd = false,
    jsonLd 
  } = options;

  // Track managed elements for cleanup
  const managedElementsRef = useRef<Set<HTMLElement>>(new Set());
  const previousTitleRef = useRef<string>('');
  
  // Memoize expensive computations
  const metaTags = useMemo(() => buildMetaTags(meta, path, baseUrl), [meta, path, baseUrl]);
  const canonicalLink = useMemo(() => buildCanonicalLink(path, meta, baseUrl), [path, meta, baseUrl]);
  const jsonLdArray = useMemo(() => {
    if (!enableJsonLd || !jsonLd) return [];
    return Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  }, [enableJsonLd, jsonLd]);

  useEffect(() => {
    // Store original title for potential restoration
    if (!previousTitleRef.current) {
      previousTitleRef.current = document.title;
    }

    // Update document title
    document.title = meta.title;

    // Clean up previously managed elements
    managedElementsRef.current.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    managedElementsRef.current.clear();

    // Mark elements as SEO-managed to prevent conflicts
    const SEO_MANAGED_ATTR = 'data-seo-managed';

    // Update or create meta tags
    metaTags.forEach(({ name, property, content }) => {
      if (!content || content.trim() === '') return;

      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let metaElement = document.querySelector(selector) as HTMLMetaElement;

      if (metaElement) {
        // Update existing meta tag and mark as managed
        metaElement.content = content;
        metaElement.setAttribute(SEO_MANAGED_ATTR, 'true');
        managedElementsRef.current.add(metaElement);
      } else {
        // Create new meta tag
        metaElement = document.createElement('meta');
        if (name) {
          metaElement.name = name;
        } else if (property) {
          metaElement.setAttribute('property', property);
        }
        metaElement.content = content;
        metaElement.setAttribute(SEO_MANAGED_ATTR, 'true');
        
        document.head.appendChild(metaElement);
        managedElementsRef.current.add(metaElement);
      }
    });

    // Update or create canonical link
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalElement) {
      canonicalElement.href = canonicalLink.href;
      canonicalElement.setAttribute(SEO_MANAGED_ATTR, 'true');
      managedElementsRef.current.add(canonicalElement);
    } else {
      canonicalElement = document.createElement('link');
      canonicalElement.rel = canonicalLink.rel;
      canonicalElement.href = canonicalLink.href;
      canonicalElement.setAttribute(SEO_MANAGED_ATTR, 'true');
      
      document.head.appendChild(canonicalElement);
      managedElementsRef.current.add(canonicalElement);
    }

    // Handle JSON-LD structured data injection with FIXED serialization
    if (jsonLdArray.length > 0) {
      // Remove existing JSON-LD scripts to prevent stale data
      document.querySelectorAll('script[type="application/ld+json"][data-seo-managed]')
        .forEach(script => script.remove());
      
      jsonLdArray.forEach((data, index) => {
        const scriptElement = document.createElement('script');
        scriptElement.type = 'application/ld+json';
        scriptElement.id = `jsonld-${index}`;
        scriptElement.setAttribute(SEO_MANAGED_ATTR, 'true');
        
        // FIXED: Use proper JSON-LD serialization that preserves JSON validity
        const jsonString = safeJsonLdSerialize(data);
        scriptElement.textContent = jsonString;
        
        document.head.appendChild(scriptElement);
        managedElementsRef.current.add(scriptElement);
      });
    }

    // Cleanup function
    return () => {
      // Remove managed elements on unmount or dependency change
      managedElementsRef.current.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
      managedElementsRef.current.clear();
    };
  }, [metaTags, canonicalLink, jsonLdArray, meta.title]);

  // Final cleanup on unmount
  useEffect(() => {
    return () => {
      // Restore original title if needed
      if (previousTitleRef.current && previousTitleRef.current !== document.title) {
        document.title = previousTitleRef.current;
      }
      
      // Clean up any remaining managed elements
      managedElementsRef.current.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
      managedElementsRef.current.clear();
    };
  }, []);
}

/**
 * Simplified useSEO hook for basic title and description updates
 */
export function useSimpleSEO(title: string, description?: string): void {
  const meta: PageMeta = {
    title,
    description: description || SEO_CONSTANTS.SITE_DESCRIPTION,
    keywords: SEO_CONSTANTS.CORE_KEYWORDS,
    type: 'website'
  };

  useSEO({
    meta,
    path: typeof window !== 'undefined' ? window.location.pathname : '/',
    enableJsonLd: false
  });
}

/**
 * useSEO hook with automatic path detection
 */
export function useAutoSEO(meta: Partial<PageMeta>, options?: {
  baseUrl?: string;
  enableJsonLd?: boolean;
  jsonLd?: Record<string, any> | Record<string, any>[];
}): void {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  
  const fullMeta: PageMeta = {
    title: meta.title || `${SEO_CONSTANTS.SITE_NAME} — ${SEO_CONSTANTS.SITE_TAGLINE}`,
    description: meta.description || SEO_CONSTANTS.SITE_DESCRIPTION,
    keywords: meta.keywords || SEO_CONSTANTS.CORE_KEYWORDS,
    type: meta.type || 'website',
    ...meta
  };

  useSEO({
    meta: fullMeta,
    path: currentPath,
    baseUrl: options?.baseUrl,
    enableJsonLd: options?.enableJsonLd,
    jsonLd: options?.jsonLd
  });
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronRight, 
  ChevronDown, 
  BookOpen, 
  Eye,
  Clock,
  FileText,
  List
} from 'lucide-react';

interface TocItem {
  id: string;
  title: string;
  level: number;
  children?: TocItem[];
}

interface TableOfContentsProps {
  content: string;
  readingTime?: number;
  className?: string;
}

// Extract headings from markdown content
function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+?)(?:\s*\{#([^}]+)\})?$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = match[3] || title
      .toLowerCase()
      .replace(/[^а-яёa-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 50);

    headings.push({
      id,
      title,
      level,
    });
  }

  return headings;
}

// Build nested structure for better display
function buildNestedToc(headings: TocItem[]): TocItem[] {
  const result: TocItem[] = [];
  const stack: TocItem[] = [];

  for (const heading of headings) {
    // Remove items from stack that are at same or higher level
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      result.push(heading);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(heading);
    }

    stack.push(heading);
  }

  return result;
}

function TocItem({ item, activeId, onItemClick, depth = 0 }: {
  item: TocItem;
  activeId: string;
  onItemClick: (id: string) => void;
  depth?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeId === item.id;

  return (
    <div className="space-y-1">
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer transition-all duration-200 group ${
          isActive 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => {
          onItemClick(item.id);
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
        }}
        data-testid={`toc-item-${item.id}`}
      >
        {hasChildren && (
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </div>
        )}
        {!hasChildren && depth > 0 && (
          <div className="w-3 h-3 flex-shrink-0" />
        )}
        <span 
          className={`text-sm leading-relaxed line-clamp-2 ${
            item.level === 1 ? 'font-semibold' : 
            item.level === 2 ? 'font-medium' : 'font-normal'
          }`}
        >
          {item.title}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-2 space-y-1">
          {item.children!.map((child) => (
            <TocItem
              key={child.id}
              item={child}
              activeId={activeId}
              onItemClick={onItemClick}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TableOfContents({ content, readingTime, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const headings = extractHeadings(content);
  const nestedHeadings = buildNestedToc(headings);

  // Track active heading based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Get the first visible heading
          const topEntry = visibleEntries.reduce((prev, current) => 
            prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current
          );
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0.1
      }
    );

    // Observe all headings
    headings.forEach(heading => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleItemClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <Card className={`sticky top-24 max-h-[calc(100vh-120px)] overflow-auto ${className}`} data-testid="table-of-contents">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">
              Содержание статьи
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            data-testid="button-toggle-toc"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {!isCollapsed && (
          <>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <List className="h-3 w-3" />
                <span>{headings.length} разделов</span>
              </div>
              {readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{readingTime} мин чтения</span>
                </div>
              )}
            </div>
            <Separator />
          </>
        )}
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="space-y-1 pt-0">
          {nestedHeadings.map((heading) => (
            <TocItem
              key={heading.id}
              item={heading}
              activeId={activeId}
              onItemClick={handleItemClick}
            />
          ))}
          
          <div className="pt-4 mt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>Прогресс чтения отслеживается автоматически</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
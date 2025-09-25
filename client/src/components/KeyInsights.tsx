import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Lightbulb, 
  CheckCircle, 
  TrendingUp, 
  Clock,
  Target,
  Zap,
  AlertTriangle,
  Info
} from 'lucide-react';

interface KeyInsight {
  id: string;
  text: string;
  type: 'tip' | 'fact' | 'warning' | 'trend' | 'statistic' | 'action';
  importance: 'high' | 'medium' | 'low';
}

interface KeyInsightsProps {
  insights?: KeyInsight[];
  title?: string;
  readingTime?: number;
  category?: string;
  className?: string;
}

// Auto-generate insights from article content
function generateInsightsFromContent(content: string, category: string = ''): KeyInsight[] {
  const insights: KeyInsight[] = [];
  
  // Extract key insights from content patterns
  const patterns = [
    // Look for important statistics
    {
      regex: /(\d+%[^.]*(?:россиян|пользователей|компаний|данных))/gi,
      type: 'statistic' as const,
      importance: 'high' as const
    },
    // Look for time-saving tips
    {
      regex: /(за \d+[^.]*минут[^.]*)/gi,
      type: 'tip' as const,
      importance: 'high' as const
    },
    // Look for warnings and important points
    {
      regex: /(?:⚠️|важно|внимание|осторожно)[^.]+[.!]/gi,
      type: 'warning' as const,
      importance: 'high' as const
    },
    // Look for efficiency claims
    {
      regex: /(эффективность[^.]+\d+%)/gi,
      type: 'fact' as const,
      importance: 'medium' as const
    }
  ];

  patterns.forEach(pattern => {
    const matches = content.match(pattern.regex);
    if (matches) {
      matches.slice(0, 2).forEach((match, index) => {
        insights.push({
          id: `${pattern.type}-${index}`,
          text: match.replace(/[⚠️🔒✅📊⏱️]/g, '').trim(),
          type: pattern.type,
          importance: pattern.importance
        });
      });
    }
  });

  // Add category-specific insights
  const categoryInsights = getCategoryInsights(category);
  insights.push(...categoryInsights.slice(0, 2));

  return insights.slice(0, 6); // Limit to 6 insights
}

function getCategoryInsights(category: string): KeyInsight[] {
  const categoryMap: Record<string, KeyInsight[]> = {
    'Пошаговые инструкции': [
      {
        id: 'category-tip-1',
        text: 'Следуйте инструкциям последовательно для наилучшего результата',
        type: 'tip',
        importance: 'high'
      },
      {
        id: 'category-action-1',
        text: 'Сохраните важные данные перед началом процедуры удаления',
        type: 'action',
        importance: 'high'
      }
    ],
    'Исследования': [
      {
        id: 'category-fact-1',
        text: 'Исследование основано на анализе актуальных данных 2025 года',
        type: 'fact',
        importance: 'medium'
      },
      {
        id: 'category-trend-1',
        text: 'Тренды в области защиты данных развиваются стремительно',
        type: 'trend',
        importance: 'medium'
      }
    ],
    'Законодательство': [
      {
        id: 'category-warning-1',
        text: 'Несоблюдение 152-ФЗ может привести к серьезным штрафам',
        type: 'warning',
        importance: 'high'
      },
      {
        id: 'category-fact-2',
        text: 'Каждый гражданин имеет право на защиту персональных данных',
        type: 'fact',
        importance: 'high'
      }
    ]
  };

  return categoryMap[category] || [];
}

function getInsightIcon(type: KeyInsight['type']) {
  const iconMap = {
    tip: Lightbulb,
    fact: Info,
    warning: AlertTriangle,
    trend: TrendingUp,
    statistic: Target,
    action: Zap
  };
  
  return iconMap[type] || Info;
}

function getInsightColor(type: KeyInsight['type'], importance: KeyInsight['importance']) {
  if (importance === 'high') {
    return type === 'warning' ? 'destructive' : 'default';
  }
  return 'secondary';
}

export default function KeyInsights({ 
  insights: providedInsights, 
  title = "Ключевые выводы", 
  readingTime,
  category = '',
  className 
}: KeyInsightsProps) {
  // Use provided insights or generate from content
  const insights = providedInsights || [];

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card className={`border-l-4 border-l-primary bg-muted/20 ${className}`} data-testid="key-insights">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">
              {title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {insights.length} выводов
            </Badge>
            {readingTime && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {readingTime} мин
              </Badge>
            )}
          </div>
        </div>
        <Separator />
      </CardHeader>

      <CardContent className="space-y-3">
        {insights.map((insight, index) => {
          const IconComponent = getInsightIcon(insight.type);
          const colorVariant = getInsightColor(insight.type, insight.importance);
          
          return (
            <div 
              key={insight.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border hover:bg-background/80 transition-colors"
              data-testid={`insight-${insight.id}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <div className={`p-1.5 rounded-full ${
                  insight.type === 'warning' ? 'bg-destructive/10' :
                  insight.importance === 'high' ? 'bg-primary/10' : 
                  'bg-muted'
                }`}>
                  <IconComponent className={`h-4 w-4 ${
                    insight.type === 'warning' ? 'text-destructive' :
                    insight.importance === 'high' ? 'text-primary' : 
                    'text-muted-foreground'
                  }`} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed text-foreground">
                  {insight.text}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant={colorVariant}
                    className="text-xs"
                  >
                    {insight.type === 'tip' && 'Совет'}
                    {insight.type === 'fact' && 'Факт'}
                    {insight.type === 'warning' && 'Важно'}
                    {insight.type === 'trend' && 'Тренд'}
                    {insight.type === 'statistic' && 'Статистика'}
                    {insight.type === 'action' && 'Действие'}
                  </Badge>
                  {insight.importance === 'high' && (
                    <Badge variant="outline" className="text-xs">
                      Приоритет
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Ключевые моменты для быстрого понимания</span>
            </div>
            <span>Обновлено {new Date().toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Export helper function for external use
export { generateInsightsFromContent };
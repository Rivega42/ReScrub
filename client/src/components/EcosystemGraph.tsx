import { useState } from 'react';
import { Wallet, Heart, TrendingUp, Calendar, Phone, Mic, Brain, Users, Sparkles } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  icon: any;
  angle: number;
  connections: string[];
  description: string;
}

const skills: Skill[] = [
  { 
    id: 'finance', 
    name: 'Финансы', 
    icon: Wallet, 
    angle: 0,
    connections: ['trading', 'family'],
    description: 'Связано с Торговлей (аналитика цен) и Семьёй (семейный бюджет)'
  },
  { 
    id: 'health', 
    name: 'Здоровье', 
    icon: Heart, 
    angle: 45,
    connections: ['calendar', 'family'],
    description: 'Связано с Календарём (тренировки) и Семьёй (здоровье близких)'
  },
  { 
    id: 'trading', 
    name: 'Торговля', 
    icon: TrendingUp, 
    angle: 90,
    connections: ['finance', 'secretary'],
    description: 'Связано с Финансами (баланс) и Секретарём (уведомления о сделках)'
  },
  { 
    id: 'calendar', 
    name: 'Календарь', 
    icon: Calendar, 
    angle: 135,
    connections: ['health', 'secretary'],
    description: 'Связано со Здоровьем (время тренировок) и Секретарём (напоминания)'
  },
  { 
    id: 'secretary', 
    name: 'Секретарь', 
    icon: Phone, 
    angle: 180,
    connections: ['calendar', 'voice'],
    description: 'Связано с Календарём (события) и Голосом (голосовые команды)'
  },
  { 
    id: 'voice', 
    name: 'Голос', 
    icon: Mic, 
    angle: 225,
    connections: ['secretary', 'memory'],
    description: 'Связано с Секретарём (распознавание) и Памятью (контекст диалогов)'
  },
  { 
    id: 'memory', 
    name: 'Память', 
    icon: Brain, 
    angle: 270,
    connections: ['voice', 'family'],
    description: 'Связано с Голосом (история) и Семьёй (общий контекст)'
  },
  { 
    id: 'family', 
    name: 'Семья', 
    icon: Users, 
    angle: 315,
    connections: ['memory', 'finance'],
    description: 'Связано с Памятью (события семьи) и Финансами (общий бюджет)'
  },
];

export default function EcosystemGraph() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const radius = 180;
  const centerX = 250;
  const centerY = 250;

  const getPosition = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    };
  };

  return (
    <div className="w-full py-16 bg-muted/20 border-y border-border/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground text-center mb-4">
          Интерактивная схема навыков
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Нажмите на любой навык, чтобы увидеть связи
        </p>
        
        <div className="relative mx-auto" style={{ width: '500px', height: '500px' }}>
          <svg width="500" height="500" className="absolute inset-0">
            {/* Connections */}
            {activeSkill && skills.find(s => s.id === activeSkill)?.connections.map(targetId => {
              const source = skills.find(s => s.id === activeSkill)!;
              const target = skills.find(s => s.id === targetId)!;
              const sourcePos = getPosition(source.angle);
              const targetPos = getPosition(target.angle);
              
              return (
                <line
                  key={`${activeSkill}-${targetId}`}
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  className="stroke-primary animate-pulse"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })}

            {/* Center Hub */}
            <g>
              <circle
                cx={centerX}
                cy={centerY}
                r="40"
                className="fill-primary/10 stroke-primary stroke-2"
              />
              <Sparkles
                x={centerX - 16}
                y={centerY - 16}
                width={32}
                height={32}
                className="text-primary"
              />
            </g>
          </svg>

          {/* Skills */}
          {skills.map((skill) => {
            const pos = getPosition(skill.angle);
            const Icon = skill.icon;
            const isActive = activeSkill === skill.id;
            const isConnected = activeSkill && skills.find(s => s.id === activeSkill)?.connections.includes(skill.id);

            return (
              <button
                key={skill.id}
                onClick={() => setActiveSkill(activeSkill === skill.id ? null : skill.id)}
                className={`
                  absolute flex flex-col items-center justify-center gap-1 cursor-pointer
                  transition-all duration-300 group
                  ${isActive ? 'scale-110' : isConnected ? 'scale-105' : 'scale-100'}
                `}
                style={{
                  left: `${pos.x - 40}px`,
                  top: `${pos.y - 40}px`,
                  width: '80px',
                  height: '80px',
                }}
              >
                <div
                  className={`
                    w-14 h-14 rounded-full flex items-center justify-center
                    border-2 transition-all duration-300
                    ${isActive 
                      ? 'bg-primary border-primary shadow-lg shadow-primary/50 animate-pulse' 
                      : isConnected
                      ? 'bg-primary/20 border-primary'
                      : 'bg-muted border-border group-hover:bg-muted/80 group-hover:border-primary/50'
                    }
                  `}
                >
                  <Icon 
                    className={`
                      w-6 h-6 transition-colors duration-300
                      ${isActive || isConnected ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'}
                    `}
                  />
                </div>
                <span 
                  className={`
                    text-xs font-medium text-center transition-colors duration-300
                    ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                  `}
                >
                  {skill.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tooltip */}
        {activeSkill && (
          <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/20 text-center animate-in fade-in duration-300">
            <p className="text-sm text-foreground">
              <strong>{skills.find(s => s.id === activeSkill)?.name}:</strong>{' '}
              {skills.find(s => s.id === activeSkill)?.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

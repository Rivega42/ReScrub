import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  weight: number;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    label: "Минимум 8 символов",
    test: (password: string) => password.length >= 8,
    weight: 1,
  },
  {
    label: "Заглавная буква",
    test: (password: string) => /[A-Z]/.test(password),
    weight: 1,
  },
  {
    label: "Строчная буква", 
    test: (password: string) => /[a-z]/.test(password),
    weight: 1,
  },
  {
    label: "Цифра",
    test: (password: string) => /\d/.test(password),
    weight: 1,
  },
  {
    label: "Специальный символ",
    test: (password: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
    weight: 1,
  },
];

export function PasswordStrengthIndicator({ 
  password, 
  className 
}: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const metRequirements = passwordRequirements.filter(req => req.test(password));
  const strength = metRequirements.length;
  const maxStrength = passwordRequirements.length;

  const getStrengthLevel = () => {
    if (strength === 0) return { level: "Очень слабый", color: "text-red-600", bgColor: "bg-red-200" };
    if (strength <= 2) return { level: "Слабый", color: "text-red-500", bgColor: "bg-red-100" };
    if (strength <= 3) return { level: "Средний", color: "text-yellow-600", bgColor: "bg-yellow-200" };
    if (strength <= 4) return { level: "Хороший", color: "text-blue-600", bgColor: "bg-blue-200" };
    return { level: "Отличный", color: "text-green-600", bgColor: "bg-green-200" };
  };

  const strengthInfo = getStrengthLevel();

  return (
    <div className={cn("space-y-3", className)} data-testid="password-strength-indicator">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Сложность пароля</span>
          <span className={cn("font-medium", strengthInfo.color)}>{strengthInfo.level}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-300 rounded-full", strengthInfo.bgColor)}
            style={{ width: `${(strength / maxStrength) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-1">
        {passwordRequirements.map((requirement, index) => {
          const isMet = requirement.test(password);
          return (
            <div 
              key={index} 
              className={cn(
                "flex items-center text-xs space-x-2 transition-colors",
                isMet ? "text-green-600" : "text-muted-foreground"
              )}
              data-testid={`password-requirement-${index}`}
            >
              {isMet ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <X className="h-3 w-3 text-muted-foreground" />
              )}
              <span>{requirement.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
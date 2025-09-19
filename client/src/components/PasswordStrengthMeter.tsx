import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
  onStrengthChange?: (strength: number, isValid: boolean) => void;
}

interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialChars: boolean;
}

export function PasswordStrengthMeter({ password, onStrengthChange }: PasswordStrengthMeterProps) {
  const [criteria, setCriteria] = useState<PasswordCriteria>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumbers: false,
    hasSpecialChars: false
  });

  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');
  const [strengthColor, setStrengthColor] = useState('');

  useEffect(() => {
    const newCriteria: PasswordCriteria = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)
    };

    setCriteria(newCriteria);

    // Подсчет силы пароля
    const passedCriteria = Object.values(newCriteria).filter(Boolean).length;
    const strengthPercentage = (passedCriteria / 5) * 100;
    setStrength(strengthPercentage);

    // Определение уровня и цвета
    let label = '';
    let color = '';
    
    if (strengthPercentage === 0) {
      label = '';
      color = '';
    } else if (strengthPercentage <= 40) {
      label = 'Слабый';
      color = 'text-destructive';
    } else if (strengthPercentage <= 60) {
      label = 'Средний';
      color = 'text-yellow-600';
    } else if (strengthPercentage <= 80) {
      label = 'Хороший';
      color = 'text-blue-600';
    } else {
      label = 'Отличный';
      color = 'text-green-600';
    }

    setStrengthLabel(label);
    setStrengthColor(color);

    // Уведомляем родительский компонент
    const isValid = passedCriteria >= 4; // Требуем минимум 4 из 5 критериев
    onStrengthChange?.(strengthPercentage, isValid);
  }, [password, onStrengthChange]);

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2" data-testid="password-strength-meter">
      {/* Индикатор силы пароля */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Сила пароля:
          </span>
          {strengthLabel && (
            <Badge 
              variant="secondary" 
              className={`text-xs ${strengthColor}`}
              data-testid="password-strength-badge"
            >
              {strengthLabel}
            </Badge>
          )}
        </div>
        <Progress 
          value={strength} 
          className="h-2"
          data-testid="password-strength-progress"
        />
      </div>

      {/* Критерии пароля */}
      <div className="space-y-1">
        <div className="text-xs font-medium text-muted-foreground mb-2">
          Требования к паролю:
        </div>
        {[
          { key: 'minLength', label: 'Минимум 8 символов', checked: criteria.minLength },
          { key: 'hasUppercase', label: 'Заглавные буквы (A-Z)', checked: criteria.hasUppercase },
          { key: 'hasLowercase', label: 'Строчные буквы (a-z)', checked: criteria.hasLowercase },
          { key: 'hasNumbers', label: 'Цифры (0-9)', checked: criteria.hasNumbers },
          { key: 'hasSpecialChars', label: 'Специальные символы (!@#$%^&*)', checked: criteria.hasSpecialChars }
        ].map((criterion) => (
          <div 
            key={criterion.key}
            className="flex items-center gap-2 text-xs"
            data-testid={`password-criterion-${criterion.key}`}
          >
            {criterion.checked ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={criterion.checked ? 'text-green-600' : 'text-muted-foreground'}>
              {criterion.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Code, Copy, Check, Variable } from 'lucide-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface EmailVariableSelectorProps {
  onSelect: (variable: string) => void;
  className?: string;
}

interface VariableGroup {
  label: string;
  variables: {
    name: string;
    label: string;
    description: string;
    example?: string;
  }[];
}

const variableGroups: VariableGroup[] = [
  {
    label: 'Персональные данные',
    variables: [
      {
        name: 'firstName',
        label: 'Имя',
        description: 'Имя получателя',
        example: 'Иван',
      },
      {
        name: 'lastName',
        label: 'Фамилия',
        description: 'Фамилия получателя',
        example: 'Петров',
      },
      {
        name: 'email',
        label: 'Email',
        description: 'Email адрес получателя',
        example: 'ivan@example.com',
      },
      {
        name: 'phone',
        label: 'Телефон',
        description: 'Номер телефона',
        example: '+7 999 123-45-67',
      },
      {
        name: 'company',
        label: 'Компания',
        description: 'Название компании',
        example: 'ООО "Компания"',
      },
    ],
  },
  {
    label: 'Данные запросов',
    variables: [
      {
        name: 'deletionCount',
        label: 'Количество удалений',
        description: 'Общее количество запросов на удаление',
        example: '42',
      },
      {
        name: 'scanDate',
        label: 'Дата сканирования',
        description: 'Дата последнего сканирования',
        example: '15.03.2024',
      },
      {
        name: 'requestDate',
        label: 'Дата запроса',
        description: 'Дата отправки запроса',
        example: '20.03.2024',
      },
      {
        name: 'brokerName',
        label: 'Название брокера',
        description: 'Имя брокера данных',
        example: 'Сбербанк',
      },
      {
        name: 'brokerUrl',
        label: 'Сайт брокера',
        description: 'URL сайта брокера',
        example: 'https://sberbank.ru',
      },
    ],
  },
  {
    label: 'Подписка',
    variables: [
      {
        name: 'planName',
        label: 'Название тарифа',
        description: 'Название тарифного плана',
        example: 'Премиум',
      },
      {
        name: 'planPrice',
        label: 'Стоимость',
        description: 'Цена подписки',
        example: '999 ₽/мес',
      },
      {
        name: 'expiryDate',
        label: 'Дата окончания',
        description: 'Дата окончания подписки',
        example: '15.04.2024',
      },
      {
        name: 'renewalUrl',
        label: 'Ссылка продления',
        description: 'URL для продления подписки',
        example: 'https://rescrub.ru/subscription',
      },
      {
        name: 'daysRemaining',
        label: 'Дней осталось',
        description: 'Количество дней до окончания',
        example: '30',
      },
    ],
  },
  {
    label: 'Система',
    variables: [
      {
        name: 'verificationUrl',
        label: 'Ссылка верификации',
        description: 'URL для подтверждения email',
        example: 'https://rescrub.ru/verify?token=abc123',
      },
      {
        name: 'resetPasswordUrl',
        label: 'Сброс пароля',
        description: 'URL для сброса пароля',
        example: 'https://rescrub.ru/reset?token=xyz789',
      },
      {
        name: 'currentYear',
        label: 'Текущий год',
        description: 'Текущий год',
        example: '2024',
      },
      {
        name: 'currentDate',
        label: 'Текущая дата',
        description: 'Сегодняшняя дата',
        example: '20.03.2024',
      },
      {
        name: 'legalBasis',
        label: 'Правовая основа',
        description: 'Ссылка на закон о персональных данных',
        example: 'ст. 14, 15, 21 ФЗ № 152',
      },
    ],
  },
];

export default function EmailVariableSelector({ 
  onSelect, 
  className = '' 
}: EmailVariableSelectorProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const handleSelect = (variable: string) => {
    onSelect(variable);
    setOpen(false);
    toast({
      title: 'Переменная добавлена',
      description: `{{${variable}}} добавлена в шаблон`,
    });
  };

  const handleCopy = (variable: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCopiedVar(variable);
    toast({
      title: 'Скопировано',
      description: `{{${variable}}} скопирована в буфер обмена`,
    });
    setTimeout(() => setCopiedVar(null), 2000);
  };

  // Filter variables based on search
  const filteredGroups = variableGroups.map(group => ({
    ...group,
    variables: group.variables.filter(v => 
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.label.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(group => group.variables.length > 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={className}
          data-testid="button-variable-selector"
        >
          <Variable className="w-4 h-4 mr-2" />
          Переменные
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] p-0" align="end">
        <Command>
          <CommandInput 
            placeholder="Поиск переменных..." 
            value={search}
            onValueChange={setSearch}
            data-testid="input-variable-search"
          />
          <CommandList className="max-h-[400px]">
            {filteredGroups.length === 0 ? (
              <CommandEmpty>Переменные не найдены</CommandEmpty>
            ) : (
              filteredGroups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.variables.map((variable) => (
                    <CommandItem
                      key={variable.name}
                      value={variable.name}
                      onSelect={() => handleSelect(variable.name)}
                      className="flex items-start justify-between p-2 cursor-pointer"
                      data-testid={`variable-item-${variable.name}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Code className="w-3 h-3 text-muted-foreground" />
                          <span className="font-mono text-sm">
                            {'{{' + variable.name + '}}'}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {variable.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {variable.description}
                        </p>
                        {variable.example && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Пример: <span className="font-medium">{variable.example}</span>
                          </p>
                        )}
                      </div>
                      <CopyToClipboard text={`{{${variable.name}}}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-8 w-8 p-0"
                          onClick={(e) => handleCopy(variable.name, e)}
                          data-testid={`button-copy-${variable.name}`}
                        >
                          {copiedVar === variable.name ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </CopyToClipboard>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
import { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Answer {
  text: string;
  value: string;
}

interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

interface UserType {
  type: string;
  skills: string[];
  savings: string;
  description: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Чем вы занимаетесь?',
    answers: [
      { text: 'Работаю на себя', value: 'freelancer' },
      { text: 'Наёмный сотрудник', value: 'employee' },
      { text: 'Бизнес', value: 'business' },
      { text: 'Студент', value: 'student' },
      { text: 'Мама в декрете', value: 'parent' },
    ],
  },
  {
    id: 2,
    question: 'Что отнимает больше всего времени?',
    answers: [
      { text: 'Финансы', value: 'finance' },
      { text: 'Планирование', value: 'planning' },
      { text: 'Общение с клиентами', value: 'communication' },
      { text: 'Покупки', value: 'shopping' },
      { text: 'Здоровье', value: 'health' },
    ],
  },
  {
    id: 3,
    question: 'Сколько подписок на сервисы?',
    answers: [
      { text: '1-3', value: 'few' },
      { text: '4-7', value: 'medium' },
      { text: '8+', value: 'many' },
    ],
  },
];

const getUserType = (answers: string[]): UserType => {
  const occupation = answers[0];
  const timeConsumer = answers[1];

  if (timeConsumer === 'finance' || occupation === 'business') {
    return {
      type: 'Финансист',
      skills: ['Финансы', 'AI-аналитика', 'Отчёты'],
      savings: '8 400₽/мес',
      description: 'Автоматический учёт расходов и доходов, умные отчёты и прогнозы',
    };
  }

  if (timeConsumer === 'shopping' || occupation === 'parent') {
    return {
      type: 'Семьянин',
      skills: ['Семейный бюджет', 'Чеки', 'Покупки'],
      savings: '12 200₽/мес',
      description: 'Общий бюджет семьи, автоучёт чеков, планирование покупок',
    };
  }

  if (timeConsumer === 'communication' || occupation === 'freelancer') {
    return {
      type: 'Организатор',
      skills: ['AI-секретарь', 'Календарь', 'Задачи'],
      savings: '6 900₽/мес',
      description: 'Автоматическое планирование, напоминания, обработка заявок',
    };
  }

  if (occupation === 'business') {
    return {
      type: 'Предприниматель',
      skills: ['Trading Hub', 'CRM', 'Аналитика'],
      savings: '24 600₽/мес',
      description: 'Торговые площадки, автоматизация продаж, аналитика бизнеса',
    };
  }

  return {
    type: 'Организатор',
    skills: ['AI-помощник', 'Календарь', 'Напоминания'],
    savings: '5 400₽/мес',
    description: 'Умный помощник для повседневных задач и планирования',
  };
};

export default function UserQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<UserType | null>(null);

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResult(getUserType(newAnswers));
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  if (result) {
    return (
      <div className="w-full py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Вы — {result.type}</h2>
            <p className="text-muted-foreground">{result.description}</p>
          </div>

          <div className="bg-background border border-border rounded-2xl p-8 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <h3 className="text-xl font-semibold text-foreground mb-4">Рекомендованные навыки:</h3>
            <div className="grid gap-3 mb-6">
              {result.skills.map((skill, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20"
                  style={{ animationDelay: `${i * 100 + 300}ms` }}
                >
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-foreground font-medium">{skill}</span>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Персональная экономия</p>
              <p className="text-3xl font-bold text-primary">{result.savings}</p>
            </div>

            <div className="flex gap-3">
              <a href="https://t.me/Grandhub_bot" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="lg" className="w-full gap-2">
                  Попробовать бесплатно <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <Button size="lg" variant="outline" onClick={handleReset}>
                Пройти заново
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Какой вы пользователь?</h2>
          <p className="text-muted-foreground">Узнайте, какие навыки подходят именно вам</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Шаг {step + 1} из {questions.length}
          </p>
        </div>

        {/* Question */}
        <div className="bg-background border border-border rounded-2xl p-8 shadow-lg animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 className="text-xl font-semibold text-foreground mb-6">{currentQuestion.question}</h3>

          <div className="grid gap-3 mb-6">
            {currentQuestion.answers.map((answer, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(answer.value)}
                className="p-4 rounded-lg border-2 border-border bg-background hover:bg-muted/50 hover:border-primary/50 transition-all duration-200 text-left group"
              >
                <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                  {answer.text}
                </span>
              </button>
            ))}
          </div>

          {step > 0 && (
            <Button variant="outline" onClick={handleBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Назад
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

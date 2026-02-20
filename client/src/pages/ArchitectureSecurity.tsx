import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, ArrowLeft, ArrowRight, Lock, Eye, AlertTriangle, FileText, Gauge } from "lucide-react";

const layers = [
  {
    icon: Gauge,
    color: "emerald",
    title: "Rate Limiting",
    desc: "Ограничение частоты запросов на уровне IP и userId. Защита от DDoS и злоупотреблений.",
    details: ["100 req/min per user", "1000 req/min per IP", "Circuit breaker", "Adaptive throttling"],
  },
  {
    icon: Shield,
    color: "cyan",
    title: "Guardian AI",
    desc: "AI-прослойка проверяет каждый запрос на соответствие политике безопасности перед обработкой.",
    details: ["Content policy check", "Intent classification", "Risk scoring", "Auto-block on threat"],
  },
  {
    icon: AlertTriangle,
    color: "purple",
    title: "Injection Scanner",
    desc: "Защита от prompt injection атак. Санитизация входных данных, обнаружение попыток обхода.",
    details: ["Pattern detection", "Jailbreak recognition", "Input sanitization", "Anomaly detection"],
  },
  {
    icon: Lock,
    color: "emerald",
    title: "Шифрование данных",
    desc: "Все данные шифруются at-rest и in-transit. AES-256 для хранения, TLS 1.3 для передачи.",
    details: ["AES-256 at rest", "TLS 1.3 in transit", "Key rotation", "Encrypted backups"],
  },
  {
    icon: Eye,
    color: "cyan",
    title: "Изоляция (tenantId)",
    desc: "Полная изоляция данных между пользователями. Каждый юзер видит только свои данные.",
    details: ["Row-level security", "Tenant isolation", "Cross-user protection", "Zero data leakage"],
  },
  {
    icon: FileText,
    color: "purple",
    title: "Audit Log",
    desc: "Полный журнал всех действий. Кто, что, когда сделал — всё логируется и хранится.",
    details: ["Immutable logs", "Action tracking", "GDPR compliance", "Retention policy"],
  },
];

const colorBorder: Record<string, string> = {
  purple: "border-purple-500/40 bg-purple-500/5",
  cyan: "border-cyan-500/40 bg-cyan-500/5",
  emerald: "border-emerald-500/40 bg-emerald-500/5",
};
const colorIcon: Record<string, string> = {
  purple: "bg-purple-500/20 text-purple-400",
  cyan: "bg-cyan-500/20 text-cyan-400",
  emerald: "bg-emerald-500/20 text-emerald-400",
};
const colorText: Record<string, string> = {
  purple: "text-purple-400",
  cyan: "text-cyan-400",
  emerald: "text-emerald-400",
};
const colorDot: Record<string, string> = {
  purple: "bg-purple-400",
  cyan: "bg-cyan-400",
  emerald: "bg-emerald-400",
};

export default function ArchitectureSecurity() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link href="/architecture">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors cursor-pointer">
                <ArrowLeft className="h-4 w-4" /> Архитектура
              </div>
            </Link>
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400 mb-6">
                <Shield className="mr-2 h-4 w-4" />
                Безопасность
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Многослойная защита{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  твоих данных
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Enterprise-grade безопасность в каждом слое: от rate limiting до AI-контроля
                и полной изоляции между пользователями.
              </p>
            </div>
          </div>
        </section>

        {/* Shield visualization */}
        <section className="py-12 bg-muted/20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-xl font-semibold text-foreground mb-8">
              Слои защиты
            </h2>
            {/* Concentric layers */}
            <div className="relative flex flex-col gap-3 max-w-xl mx-auto">
              {[
                { label: "Rate Limiting", color: "emerald", w: "w-full" },
                { label: "Guardian AI", color: "cyan", w: "w-11/12" },
                { label: "Injection Scanner", color: "purple", w: "w-10/12" },
                { label: "TLS 1.3 + AES-256", color: "emerald", w: "w-9/12" },
                { label: "tenantId Isolation", color: "cyan", w: "w-8/12" },
                { label: "🔒 Твои данные", color: "purple", w: "w-7/12" },
              ].map((layer, i) => (
                <div key={i} className={`${layer.w} mx-auto`}>
                  <div className={`rounded-xl border text-center py-2.5 text-sm font-medium ${colorBorder[layer.color]} ${colorText[layer.color]}`}>
                    {layer.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Layers detail */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {layers.map((layer) => {
                const Icon = layer.icon;
                return (
                  <div key={layer.title} className={`rounded-2xl border p-6 ${colorBorder[layer.color]}`}>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${colorIcon[layer.color]}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${colorText[layer.color]}`}>{layer.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{layer.desc}</p>
                    <ul className="space-y-1.5">
                      {layer.details.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${colorDot[layer.color]}`} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Guardian AI detail */}
        <section className="py-16 bg-muted/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Guardian AI в действии
            </h2>
            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <pre className="text-sm text-muted-foreground font-mono leading-relaxed overflow-x-auto">
{`async function guardianCheck(userId, message) {
  // 1. Rate limit check
  if (await rateLimiter.isExceeded(userId)) {
    throw new RateLimitError(429);
  }

  // 2. Injection scan (regex + ML)
  const injectionRisk = injectionScanner.scan(message);
  if (injectionRisk.score > 0.8) {
    await auditLog.write(userId, 'INJECTION_ATTEMPT', message);
    throw new SecurityError('Подозрительный запрос');
  }

  // 3. Content policy (Guardian AI model call)
  const policy = await guardianModel.check(message);
  if (!policy.allowed) {
    return { blocked: true, reason: policy.reason };
  }

  // 4. Audit log — всегда
  await auditLog.write(userId, 'REQUEST_OK', {
    risk: injectionRisk.score,
    policy: policy.category,
    timestamp: Date.now(),
  });

  return { allowed: true };
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
              Соответствие стандартам
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "152-ФЗ", desc: "Защита персональных данных" },
                { label: "GDPR", desc: "Европейские стандарты" },
                { label: "HTTPS only", desc: "TLS 1.3 везде" },
                { label: "Zero-log", desc: "Нет логов разговоров" },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
                  <div className="text-xl font-bold text-emerald-400 mb-1">{c.label}</div>
                  <div className="text-xs text-muted-foreground">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nav */}
        <section className="py-12 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/architecture/ai">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <ArrowLeft className="h-4 w-4" /> AI Runtime
              </div>
            </Link>
            <Link href="/architecture/skills">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors cursor-pointer">
                Система навыков <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

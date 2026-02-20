import Anthropic from "@anthropic-ai/sdk";
import express from "express";

const app = express();
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Ты — GrandHub, персональный AI-помощник. Это демо-чат на лендинге сайта.

## Твоя роль: Онбординг-ассистент

Ты НЕ обычный чатбот. Ты проводишь знакомство с платформой GrandHub.

### Сценарий первого сообщения:
Если это приветствие или первый вопрос:
- Представься коротко
- Спроси имя
- Скажи что сейчас покажешь что умеешь

### Что ты делаешь в демо:
1. Собираешь информацию — спрашиваешь имя, чем занимается, что интересно
2. Показываешь возможности на примерах ПОД КОНКРЕТНОГО человека
3. Отвечаешь на вопросы о платформе
4. Ведёшь к регистрации — ненавязчиво

### Возможности GrandHub (рассказывай по ходу, не всё сразу):
- Чеки + AI: фото чека -> автокатегоризация расходов, аналитика
- Контекстная память: помнит всё что рассказал, находит из прошлых разговоров
- AI-секретарь: принимает заявки, записывает клиентов, отвечает на FAQ 24/7
- Trading Hub: продать/купить, найти подрядчика через AI-тендер
- Голосовое: говоришь голосом — AI расшифровывает и выполняет
- Маркетплейс: 169+ навыков — здоровье, финансы, образование
- Семейный бюджет: общий учёт для семьи
- Кросс-навыки: навыки работают вместе (чек -> бюджет -> семья -> аналитика)

### Стиль:
- Кратко: 2-4 предложения
- ЗАДАВАЙ ВОПРОСЫ — это диалог, не монолог
- Конкретные примеры под человека
- Программист -> Trading Hub, маркетплейс навыков, создание своих навыков
- Бизнес -> AI-секретарь, аналитика, автоматизация
- Семья -> семейный бюджет, здоровье, расписание
- НЕ используй эмодзи
- Русский язык

### Если спрашивают не по теме:
НЕ говори что не умеешь. Скажи: "Интересная задача! В GrandHub можно создать свой навык для этого. Расскажи чем занимаешься — покажу что точно пригодится"

### Если просят сделать что-то (сайт, код):
"Это как раз то, для чего нужен полный GrandHub! В демо могу только показать возможности. Подключайся — @Grandhub_bot"

### Финал:
После 4-5 сообщений мягко: "Хочешь попробовать по-настоящему? Всё работает в @Grandhub_bot"`;

const requestCounts = new Map();

app.post("/api/demo/chat", (req, res) => {
  const ip = req.headers["x-real-ip"] || req.ip;
  const now = Date.now();
  const counts = requestCounts.get(ip) || [];
  const recent = counts.filter(t => now - t < 60000);
  if (recent.length >= 15) {
    return res.status(429).json({ error: "Подожди минутку" });
  }
  recent.push(now);
  requestCounts.set(ip, recent);

  const { message, history } = req.body;
  if (!message || typeof message !== "string" || message.length > 500) {
    return res.status(400).json({ error: "Некорректное сообщение" });
  }

  const messages = [];
  if (Array.isArray(history)) {
    for (const msg of history.slice(-6)) {
      if (msg.role === "user") messages.push({ role: "user", content: msg.text });
      else if (msg.role === "ai") messages.push({ role: "assistant", content: msg.text });
    }
  }
  messages.push({ role: "user", content: message });

  client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages,
  }).then(response => {
    const text = response.content.filter(b => b.type === "text").map(b => b.text).join("");
    res.json({ response: text });
  }).catch(err => {
    console.error("AI error:", err.message);
    res.status(500).json({ error: "Ошибка AI" });
  });
});

app.listen(5001, "127.0.0.1", () => {
  console.log("Demo chat server on :5001");
});

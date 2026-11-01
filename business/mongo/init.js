const dbName = process.env.MONGO_APP_DB;
const appUser = process.env.MONGO_APP_USER;
const appPassword = process.env.MONGO_APP_PASSWORD;

if (!dbName || !appUser || !appPassword) {
  throw new Error("Не заданы MONGO_APP_DB, MONGO_APP_USER или MONGO_APP_PASSWORD");
}

const appDb = db.getSiblingDB(dbName);

// Пользователь приложения: чтение и запись только в своей базе
appDb.createUser({
  user: appUser,
  pwd: appPassword,
  roles: [{ role: "readWrite", db: dbName }]
});

const datePattern = "^\\d{4}-\\d{2}-\\d{2}$";
const providerPattern = "^[a-z0-9_]+$";

function create(name, schema) {
  appDb.createCollection(name, {
    validator: { $jsonSchema: schema },
    validationLevel: "strict",
    validationAction: "error"
  });
}

// Дневник: чувствительное содержимое (текст и оценки) лежит одним зашифрованным полем payload
create("diary_entries", {
  bsonType: "object",
  required: ["userId", "date", "payload", "createdAt", "updatedAt"],
  properties: {
    userId:    { bsonType: "long" }, //владелец данных
    date:      { bsonType: "string", pattern: datePattern }, //день, к которому относится запись
    payload:   { bsonType: "string" }, // зашифрованное содержимое (текст и оценки)
    createdAt: { bsonType: "date" }, // когда запись создана
    updatedAt: { bsonType: "date" }   // когда запись последний раз изменена
  }
});

// Показатели носимого устройства: один документ на пользователя + день
create("biometrics", {
  bsonType: "object",
  required: ["userId", "date", "provider", "source", "payloadVersion", "payload", "importedAt"],
  properties: {
    userId:     { bsonType: "long" },  //владелец данных
    date:       { bsonType: "string", pattern: datePattern }, // день, за который показатели
    provider:       { bsonType: "string", pattern: providerPattern }, // производитель: samsung_health, garmin...
    source:         { enum: ["file_export", "api"] },    // как получены данные: архив экспорта или API
    payloadVersion: { bsonType: ["int", "long"], minimum: 1 },  // версия формата payload
    payload:    { bsonType: "string" },  // зашифрованный JSON: сон, стресс, пульс, активность
    importedAt: { bsonType: "date" }   // когда данные загружены в систему
  }
});

// Показатели занятости из календаря по дням
create("calendar_daily_stats", {
  bsonType: "object",
  required: ["userId", "date", "provider", "meetingsCount", "meetingsMinutes",
             "tasksCompleted", "tasksOverdue", "collectedAt],
  properties: {
    userId:          { bsonType: "long" }, //владелец данных
    date:            { bsonType: "string", pattern: datePattern }, //какой день описывает запись
    provider:        { bsonType: "string", pattern: providerPattern }, // календарь: google, yandex
    meetingsCount:   { bsonType: ["int", "long"], minimum: 0 }, //сколько встреч было в этот день
    meetingsMinutes: { bsonType: ["int", "long"], minimum: 0 }, //их суммарная длительность в минутах
    tasksCompleted:  { bsonType: ["int", "long"], minimum: 0 }, //сколько задач выполнено в этот день
    tasksOverdue:    { bsonType: ["int", "long"], minimum: 0 }, //сколько задач на конец дня просрочено (срок уже прошёл, а не выполнены)
    collectedAt:     { bsonType: "date" } //когда система собрала эти данные из календаря
  }
});

// Подключённые источники: календари и носимое устройство (токены в зашифрованном виде)
create("integrations", {
  bsonType: "object",
  required: ["userId", "category", "provider", "mode", "status", "createdAt"],
  properties: {
    userId:          { bsonType: "long" },  //пользователь
    category:        { enum: ["calendar", "wearable"] },  // вид источника: календарь или носимое устройство
    provider:        { bsonType: "string", pattern: providerPattern }, // google, yandex, samsung_health...
    mode:            { enum: ["oauth", "file_import"] },  // доступ по токенам или загрузка архива вручную
    status:          { enum: ["active", "needs_reauth", "revoked"] }, // работает / нужно подключить заново / отключён пользователем
    accessTokenEnc:  { bsonType: "string" }, // зашифрованный токен доступа (только для oauth)
    refreshTokenEnc: { bsonType: "string" }, // зашифрованный токен обновления (только для oauth)
    tokenExpiresAt:  { bsonType: "date" }, // когда истекает токен доступа
    scopes:          { bsonType: "array", items: { bsonType: "string" } }, // какие права выданы
    lastSyncAt:      { bsonType: "date" }, // когда была последняя синхронизация или загрузка
    lastDataDate:    { bsonType: "string", pattern: datePattern }, // до какого дня данные уже загружены
    createdAt:       { bsonType: "date" }  // когда источник подключён
  }
});

// Отчёты ИИ: текст и рекомендации зашифрованы в payload, verdict открыт для панели
create("ai_reports", {
  bsonType: "object",
  required: ["userId", "periodFrom", "periodTo", "trigger", "status", "createdAt"],
  properties: {
    userId:       { bsonType: "long" },  //владелец отчёта
    periodFrom:   { bsonType: "string", pattern: datePattern },
    periodTo:     { bsonType: "string", pattern: datePattern }, //за какой период проанализированы данные (обычно неделя)
    trigger:      { enum: ["schedule", "manual"] }, //как запущен отчёт: schedule (по расписанию раз в неделю) или manual (пользователь запросил)
    status:       { enum: ["done", "timeout", "error"] }, // готов / модель не ответила вовремя / ошибка
    verdict:      { bsonType: "string" }, // короткий вывод для панели (не шифруется)
    payload:      { bsonType: "string" }, //зашифрованный полный отчёт: текст, рекомендации, посчитанные показатели
    generationMs: { bsonType: ["int", "long"], minimum: 0 },  //сколько миллисекунд ушло на генерацию
    createdAt:    { bsonType: "date" }  //когда создан
  }
});

// Индексы
appDb.diary_entries.createIndex({ userId: 1, date: 1 }, { unique: true });
appDb.biometrics.createIndex({ userId: 1, provider: 1, date: 1 }, { unique: true });
appDb.calendar_daily_stats.createIndex({ userId: 1, provider: 1, date: 1 }, { unique: true });
appDb.integrations.createIndex({ userId: 1, provider: 1 }, { unique: true });
appDb.ai_reports.createIndex({ userId: 1, createdAt: -1 });
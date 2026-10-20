# Сервис авторизации Mental Support System

Сервис отвечает за регистрацию и аутентификацию пользователей системы психологической поддержки. Он предоставляет REST API для управления профилем и сессиями, выпускает JWT access-токены и refresh-токены, а также поддерживает административные операции с пользователями. 

## Технологии

- Java 21
- Spring Boot 4.1.1, Spring Web MVC и Spring Security
- Spring Data JPA и Hibernate
- PostgreSQL
- Flyway для миграций базы данных
- JWT с RSA-подписью; пароли хешируются с BCrypt
- Maven Wrapper для сборки и запуска

## Требования

- JDK 21
- PostgreSQL
- OpenSSL — только если нужно сгенерировать RSA-ключ

## Локальный запуск

Команды ниже выполняются из каталога `auth`.

1. Создайте базу данных PostgreSQL:

   ```sql
   CREATE DATABASE auth_mental_support;
   ```

2. Создайте файл `auth/.env` с настройками подключения и локальной разработки:

   ```properties
   DB_URL=jdbc:postgresql://localhost:5432/auth_mental_support
   DB_USERNAME=postgres
   DB_PASSWORD=your-local-database-password
   COOKIE_SECURE=false

   # Необязательно: при задании обоих параметров администратор
   # будет создан при старте, если пользователь с таким email ещё не существует.
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=replace-with-a-strong-password

   # Можно не задавать, если используется значение по умолчанию.
   JWT_PRIVATE_KEY_PATH=./secrets/jwt_private.pem
   ```

   `DB_PASSWORD` должен соответствовать паролю пользователя PostgreSQL. Для локального HTTP-соединения установите `COOKIE_SECURE=false`; для HTTPS используйте `true`. Файл `.env` исключён из Git.

3. Подготовьте RSA-ключ в формате PKCS#8. Приложение по умолчанию ожидает файл `auth/secrets/jwt_private.pem`. Если ключа ещё нет, из каталога `auth` можно создать его так:

   ```powershell
   New-Item -ItemType Directory -Force secrets
   openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out secrets/jwt_private.pem
   ```

   Закрытый ключ и каталог `secrets` не следует публиковать или добавлять в Git. Путь можно изменить переменной `JWT_PRIVATE_KEY_PATH`.

4. Запустите приложение из каталога `auth`:

   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

   Сервис будет доступен на `http://localhost:8081`. При первом запуске Flyway автоматически выполнит миграции и создаст таблицы. Для запуска из корня репозитория:

   ```powershell
   cd auth
   .\mvnw.cmd spring-boot:run
   ```


## Настройки

| Переменная | Значение по умолчанию | Назначение |
| --- | --- | --- |
| `DB_URL` | `jdbc:postgresql://localhost:5432/auth_mental_support` | JDBC URL базы данных |
| `DB_USERNAME` | `postgres` | Пользователь PostgreSQL |
| `DB_PASSWORD` | — | Пароль пользователя PostgreSQL |
| `JWT_PRIVATE_KEY_PATH` | `./secrets/jwt_private.pem` | Путь к закрытому RSA-ключу в формате PKCS#8 |
| `COOKIE_SECURE` | `true` | Флаг `Secure` для auth-cookie; для локального HTTP задайте `false` |
| `ADMIN_EMAIL` | пусто | Email начального администратора; вместе с паролем включает его создание |
| `ADMIN_PASSWORD` | пусто | Пароль начального администратора |

Файл `.env` загружается Spring Boot из текущего каталога запуска. Кроме переменных из таблицы, порт по умолчанию — `8081`; access-токен действует 15 минут, refresh-токен — 30 дней.

## API

Все пути относительны к `http://localhost:8081`. Для запросов с телом используется JSON. Успешная регистрация и вход устанавливают HttpOnly-cookie `access_token` и `refresh_token`; refresh-cookie передаётся на маршруты `/auth`. Для локального HTTP-соединения не забудьте `COOKIE_SECURE=false`.

### Регистрация и вход

| Метод | Путь | Назначение |
| --- | --- | --- |
| `POST` | `/auth/register` | Регистрация пользователя. Обязательные поля: `name`, `email`, `password`; пароль — от 6 до 26 символов. Дополнительно принимаются `surname`, `genderId`, `birthday` |
| `POST` | `/auth/login` | Вход по `email` и `password` |
| `POST` | `/auth/refresh` | Обновление токенов по refresh-cookie |
| `POST` | `/auth/logout` | Завершение текущей сессии и очистка cookie |
| `POST` | `/auth/logout-all` | Завершение всех сессий текущего пользователя |

### Профиль и сессии

Эти маршруты требуют действующий access-токен.

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/users/me` | Получить профиль текущего пользователя |
| `PATCH` | `/users/me` | Обновить профиль |
| `PUT` | `/users/me/email` | Изменить email |
| `PUT` | `/users/me/password` | Изменить пароль и завершить текущую авторизацию |
| `DELETE` | `/users/me` | Удалить собственную учётную запись |
| `GET` | `/auth/sessions` | Получить список активных сессий |
| `DELETE` | `/auth/sessions/{id}` | Завершить указанную сессию |

### Администрирование

Маршруты доступны только пользователям с ролью администратора.

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/admin/users` | Получить список пользователей |
| `GET` | `/admin/users/{id}` | Получить пользователя по ID |
| `PATCH` | `/admin/users/{id}/role` | Изменить роль пользователя |
| `DELETE` | `/admin/users/{id}` | Удалить пользователя |



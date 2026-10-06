CREATE TABLE genders (
    id    SMALLINT    PRIMARY KEY,
    name  VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE types_of_devices (
    id    SMALLINT    PRIMARY KEY,
    name  VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE users (
    id             BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name           VARCHAR(50)  NOT NULL,
    surname        VARCHAR(50),
    gender_id      SMALLINT     REFERENCES genders (id),
    email          VARCHAR(254) NOT NULL UNIQUE,
    password_hash  VARCHAR(100) NOT NULL,
    birthday       DATE,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    last_login_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX        ix_users_last_login_at ON users (last_login_at);

CREATE TABLE sessions (
    id                  BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id             BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    refresh_token_hash  VARCHAR(64)     NOT NULL UNIQUE,
    device_label        VARCHAR(100),
    device_type_id      SMALLINT     REFERENCES types_of_devices (id),
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    expires_at          TIMESTAMPTZ  NOT NULL,
    last_used_at        TIMESTAMPTZ
);

CREATE INDEX ix_sessions_user_id    ON sessions (user_id);
CREATE INDEX ix_sessions_expires_at ON sessions (expires_at);
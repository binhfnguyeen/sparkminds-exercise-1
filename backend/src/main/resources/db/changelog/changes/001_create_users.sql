CREATE TABLE users (
   user_id BIGSERIAL PRIMARY KEY,
   email VARCHAR(255) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   phone VARCHAR(20) UNIQUE,
   first_name VARCHAR(255),
   last_name VARCHAR(255),
   date_of_birth DATE,
   role VARCHAR(50) NOT NULL,
   status VARCHAR(50) NOT NULL,
   requires_password_change BOOLEAN NOT NULL DEFAULT FALSE,
   failed_attempt INT NOT NULL DEFAULT 0,
   lock_time TIMESTAMP,
   is_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
   mfa_secret VARCHAR(255),
   is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
   created_at TIMESTAMP,
   updated_at TIMESTAMP
);
CREATE TABLE categories (
    category_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
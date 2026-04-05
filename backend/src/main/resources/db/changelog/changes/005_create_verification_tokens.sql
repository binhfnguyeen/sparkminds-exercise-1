CREATE TABLE verification_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_token_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);
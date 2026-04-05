CREATE TABLE books (
    book_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    description TEXT,
    quantity INT,
    image_url VARCHAR(500),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    category_id BIGINT NOT NULL,
    CONSTRAINT fk_books_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
);
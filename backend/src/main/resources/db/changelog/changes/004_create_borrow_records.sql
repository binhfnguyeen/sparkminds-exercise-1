CREATE TABLE borrow_records (
    borrow_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    due_date TIMESTAMP,
    returned_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_borrow_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_borrow_book FOREIGN KEY (book_id) REFERENCES books(book_id)
);
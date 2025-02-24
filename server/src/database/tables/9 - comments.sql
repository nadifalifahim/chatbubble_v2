CREATE TABLE Comments (
    comment_id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(20) NOT NULL,
    user_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES Tickets (ticket_id),
    FOREIGN KEY (user_id) REFERENCES Users (user_id)
);
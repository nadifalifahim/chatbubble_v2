CREATE TABLE Attachments (
    attachment_id SERIAL PRIMARY KEY,
    ticket_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_name VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INT NOT NULL,
    FOREIGN KEY (ticket_id) REFERENCES Tickets (ticket_id),
    FOREIGN KEY (uploaded_by) REFERENCES Users (user_id)
);
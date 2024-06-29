CREATE SEQUENCE ticket_serial_seq START 1;

CREATE TABLE Tickets (
    ticket_id VARCHAR(20) PRIMARY KEY,
    ticket_message TEXT,
    ticket_status VARCHAR(20) CHECK (ticket_status IN ('open', 'in progress', 'closed')) DEFAULT 'open',
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    user_id bigint,
    reported_by VARCHAR(50),
    platform VARCHAR(20),
    assigned_team_id INT NOT NULL,
    category_id INT,
    telegram_user_id bigint,
    telegram_message_id bigint,
    telegram_chat_id bigint,
    telegram_chat_title TEXT,
    telegram_attachment_id TEXT;
    project_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    closed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users (user_id),
    FOREIGN KEY (project_id) REFERENCES Projects (project_id),
    FOREIGN KEY (assigned_team_id) REFERENCES Teams (team_id),
    FOREIGN KEY (category_id) REFERENCES Categories (category_id)
);

CREATE OR REPLACE FUNCTION generate_ticket_id()
RETURNS TRIGGER AS $$
DECLARE
    current_date_prefix VARCHAR(8);
    serial_number VARCHAR(7);
BEGIN
    -- Generate the date prefix
    current_date_prefix := TO_CHAR(NOW(), 'DDMMYYYY');

    -- Generate the serial number
    serial_number := LPAD(NEXTVAL('ticket_serial_seq')::TEXT, 7, '0');

    -- Combine them to form the ticket_id
    NEW.ticket_id := current_date_prefix || serial_number;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ticket_id
BEFORE INSERT ON Tickets
FOR EACH ROW
EXECUTE FUNCTION generate_ticket_id();
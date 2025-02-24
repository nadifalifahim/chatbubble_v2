CREATE TABLE UserTeams (
    user_id INT NOT NULL,
    team_id INT NOT NULL,
    team_role VARCHAR(20) CHECK (team_role IN ('team_lead', 'team_member')) NOT NULL DEFAULT 'team_member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, team_id),
    FOREIGN KEY (user_id) REFERENCES Users (user_id),
    FOREIGN KEY (team_id) REFERENCES Teams (team_id)
);
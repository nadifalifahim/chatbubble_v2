CREATE TABLE ProjectKeywords (
    project_keyword_id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    keyword_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Projects (project_id),
    FOREIGN KEY (keyword_id) REFERENCES Keywords (keyword_id),
    FOREIGN KEY (category_id) REFERENCES Categories (category_id),
    UNIQUE (project_id, keyword_id)
);
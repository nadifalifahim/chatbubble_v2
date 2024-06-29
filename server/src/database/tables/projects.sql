CREATE SEQUENCE project_id_seq;

CREATE TABLE Projects (
    project_id VARCHAR(20) PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    project_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION generate_project_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.project_id := CONCAT('PROJ', nextval('project_id_seq')::TEXT);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_project_id
BEFORE INSERT ON Projects
FOR EACH ROW
EXECUTE FUNCTION generate_project_id();
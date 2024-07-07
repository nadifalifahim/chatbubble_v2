import { PoolClient } from "pg";
import { db } from "../../../../database/database.js";

export interface Project {
  project_id?: number;
  project_name: string;
  project_description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProjectID {
  project_id?: number;
}

export class ProjectModel {
  private pool = db.pool; // Replace with your database connection pool

  async createProject(project: Project): Promise<Project | null> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query =
        "INSERT INTO projects (project_name, project_description, created_at) VALUES ($1, $2, $3) RETURNING *";
      const values = [
        project.project_name,
        project.project_description,
        new Date(),
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating project:", error);
      return null;
    } finally {
      client.release();
    }
  }

  async getProjects(): Promise<Project[] | null> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = "SELECT * FROM projects";
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error creating project:", error);
      return null;
    } finally {
      client.release();
    }
  }

  async getProjectsByTelegramChatID(
    telegramChatID: string
  ): Promise<ProjectID | null> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = "SELECT project_id FROM projects WHERE telegram_chat_id=$1";
      const result = await client.query(query, [telegramChatID]);

      // Return all project IDs as an array or null if no results
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching projects by Telegram chat ID:", error);
      return null; // Return null in case of error
    } finally {
      client.release();
    }
  }
}

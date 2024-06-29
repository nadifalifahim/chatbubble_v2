import { PoolClient } from "pg";
import { db } from "../../../database/database.js";
export interface Ticket {
  ticket_id: string;
  ticket_message: string;
  ticket_status?: "open" | "in progress" | "closed";
  priority?: "low" | "medium" | "high";
  user_id?: number;
  reported_by?: string;
  platform?: string;
  assigned_team_id: number;
  category_id?: number;
  project_id: number;
  created_at?: Date;
  updated_at?: Date;
  closed_at?: Date;
}

export class ProjectModel {
  private pool = db.pool; // Replace with your database connection pool

  async createTicket(ticket: Ticket): Promise<Ticket | null> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query =
        "INSERT INTO tickets (ticket_message, ticket_status, priority, user_id, reported_by, platform, assigned_team_id, category_id, project_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ticket_id";
      const values = [
        ticket.ticket_message,
        ticket.ticket_status,
        ticket.priority,
        ticket.user_id,
        ticket.reported_by,
        ticket.platform,
        ticket.assigned_team_id,
        ticket.category_id,
        ticket.project_id,
        new Date(),
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating ticket:", error);
      return null;
    } finally {
      client.release();
    }
  }
}

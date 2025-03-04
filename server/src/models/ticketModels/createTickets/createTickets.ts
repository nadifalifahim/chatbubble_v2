import { PoolClient, QueryResult } from "pg";
import { db } from "../../../database/database.js";
export interface Ticket {
  ticket_id?: string;
  message: string;
  status?: string;
  priority?: string;
  telegramUserId?: number;
  reportedBy?: string;
  platform?: string;
  assignedTeamId: number;
  categoryId?: number;
  projectId: string;
  created_at?: Date;
  telegramMessageId: number;
  telegramChatId: number;
  telegramChatTitle: string;
  telegramAttachmentId?: string;
}

export interface Ticket2 {
  ticket_id: string;
  ticket_status: string;
  priority: string;
  reported_by: string;
  platform: string;
  team_name: string;
  closed_at: Date;
}

export class TicketModel {
  private pool = db.pool; // Replace with your database connection pool

  async createTicket(ticket: Ticket): Promise<Ticket | null> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query =
        "INSERT INTO tickets (ticket_message, ticket_status, priority, telegram_user_id, reported_by, platform, assigned_team_id, category_id, project_id, created_at, telegram_message_id, telegram_chat_id, telegram_chat_title, telegram_attachment_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING ticket_id";
      const values = [
        ticket.message,
        ticket.status,
        ticket.priority,
        ticket.telegramUserId,
        ticket.reportedBy,
        ticket.platform,
        ticket.assignedTeamId,
        ticket.categoryId,
        ticket.projectId,
        new Date(),
        ticket.telegramMessageId,
        ticket.telegramChatId,
        ticket.telegramChatTitle,
        ticket.telegramAttachmentId,
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

  async updateTicketStatus(ticketId: string, status: string): Promise<boolean> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query =
        "UPDATE tickets SET ticket_status = $1 WHERE ticket_id = $2";
      const values = [status, ticketId];
      const result: QueryResult = await client.query(query, values);

      // Check that result is defined and has rowCount
      return result && result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error("Error updating ticket status:", error);
      return false;
    } finally {
      client.release();
    }
  }

  async getTickets(
    fromDate: Date | null,
    toDate: Date | null,
    projectID: String
  ): Promise<Ticket[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `
      SELECT
        t.ticket_id,
        t.ticket_message,
        t.ticket_status,
        t.priority,
        t.user_id,
        t.reported_by,
        t.platform,
        tm.team_name,
        c.category_name,
        t.telegram_user_id,
        t.telegram_message_id,
        t.telegram_chat_id,
        t.telegram_chat_title,
        t.telegram_attachment_id,
        t.project_id,
        t.created_at,
        t.updated_at,
        t.closed_at
      FROM Tickets t
      JOIN Teams tm ON t.assigned_team_id = tm.team_id
      LEFT JOIN Categories c ON t.category_id = c.category_id
      WHERE TRUE
    `;
      const values: any[] = [];

      query += ` AND t.project_id = $${values.length + 1}`;
      values.push(projectID.toUpperCase());

      if (fromDate) {
        fromDate.setHours(0, 0, 0, 0);
        query += ` AND t.created_at >= $${values.length + 1}`;
        values.push(fromDate);
      }

      if (toDate) {
        // Set end of day for `toDate`
        const endOfToDate = new Date(toDate);
        endOfToDate.setHours(23, 59, 59, 999);
        query += ` AND t.created_at <= $${values.length + 1}`;
        values.push(endOfToDate);
      }

      query += " ORDER BY t.created_at DESC";

      const result = await client.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error fetching tickets: ", error);
      return [];
    } finally {
      client.release();
    }
  }

  async getTicket(ticketID: string | null): Promise<Ticket2 | null> {
    if (!ticketID) {
      console.error("Invalid ticketID provided.");
      return null; // Return null if ticketID is invalid
    }

    const client: PoolClient = await this.pool.connect();
    try {
      const query = `
        SELECT
          t.ticket_id,
          t.ticket_status,
          t.priority,
          t.reported_by,
          t.platform,
          tm.team_name,
          t.closed_at
        FROM Tickets t
        JOIN Teams tm ON t.assigned_team_id = tm.team_id
        WHERE t.ticket_id = $1
      `;
      const value = [ticketID];
      const result = await client.query(query, value);

      // Return the first ticket object or null if no results
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error("Error fetching ticket: ", error);
      return null; // Return null in case of error
    } finally {
      client.release();
    }
  }
}

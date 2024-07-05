var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { db } from "../../../database/database.js";
export class TicketModel {
    constructor() {
        this.pool = db.pool; // Replace with your database connection pool
    }
    createTicket(ticket) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            try {
                const query = "INSERT INTO tickets (ticket_message, ticket_status, priority, telegram_user_id, reported_by, platform, assigned_team_id, category_id, project_id, created_at, telegram_message_id, telegram_chat_id, telegram_chat_title, telegram_attachment_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING ticket_id";
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
                const result = yield client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                console.error("Error creating ticket:", error);
                return null;
            }
            finally {
                client.release();
            }
        });
    }
    updateTicketStatus(ticketId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            try {
                const query = "UPDATE tickets SET ticket_status = $1 WHERE ticket_id = $2";
                const values = [status, ticketId];
                const result = yield client.query(query, values);
                // Check that result is defined and has rowCount
                return result && result.rowCount !== null && result.rowCount > 0;
            }
            catch (error) {
                console.error("Error updating ticket status:", error);
                return false;
            }
            finally {
                client.release();
            }
        });
    }
    getTickets(fromDate, toDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
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
                const values = [];
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
                query += ` ORDER BY created_at DESC`;
                const result = yield client.query(query, values);
                return result.rows;
            }
            catch (error) {
                console.error("Error fetching tickets: ", error);
                return [];
            }
            finally {
                client.release();
            }
        });
    }
}

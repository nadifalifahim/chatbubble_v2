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
export class ProjectModel {
    constructor() {
        this.pool = db.pool; // Replace with your database connection pool
    }
    createTicket(ticket) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            try {
                const query = "INSERT INTO tickets (ticket_message, ticket_status, priority, user_id, reported_by, platform, assigned_team_id, category_id, project_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ticket_id";
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
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { db } from "../../../../database/database.js";
export class ProjectModel {
    constructor() {
        this.pool = db.pool; // Replace with your database connection pool
    }
    createProject(project) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            try {
                const query = "INSERT INTO projects (project_name, project_description, created_at) VALUES ($1, $2, $3) RETURNING *";
                const values = [
                    project.project_name,
                    project.project_description,
                    new Date(),
                ];
                const result = yield client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                console.error("Error creating project:", error);
                return null;
            }
            finally {
                client.release();
            }
        });
    }
}

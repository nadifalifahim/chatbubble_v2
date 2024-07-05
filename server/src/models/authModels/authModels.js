var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { db } from "../../database/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
export const registerUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fullName, email, password, contactNumber, }) {
    const client = yield db.pool.connect();
    const emailCheckQuery = `SELECT * FROM users WHERE email = $1`;
    const emailCheckResult = yield client.query(emailCheckQuery, [email]);
    if (emailCheckResult.rows.length > 0) {
        throw new Error("Email already exists");
    }
    const hashedPassword = yield bcrypt.hash(password, 10);
    const insertQuery = `
    INSERT INTO users (full_name, email, contact_number, password_hash, role_id)
    VALUES ($1, $2, $3, $4, $5) returning user_id;
  `;
    const insertValues = [fullName, email, contactNumber, hashedPassword, 2];
    const registrationQuery = yield client.query(insertQuery, insertValues);
    const userId = registrationQuery.rows[0].id;
    const token = jwt.sign({ userId: userId }, JWT_SECRET, {
        expiresIn: "24h",
    });
    return { token, message: "User registered successfully" };
});
export const loginUser = (_b) => __awaiter(void 0, [_b], void 0, function* ({ email, password, }) {
    const client = yield db.pool.connect();
    try {
        const userQuery = `SELECT user_id, full_name, password_hash FROM users WHERE email = $1`;
        const userResult = yield client.query(userQuery, [email]);
        if (userResult.rows.length === 0) {
            throw new Error("Email not found. Please try again.");
        }
        const user = userResult.rows[0];
        // Ensure the password is not undefined or null
        if (!user.password_hash) {
            throw new Error("Password not found for the user.");
        }
        const passwordMatch = yield bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            throw new Error("Invalid password. Please try again.");
        }
        const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, {
            expiresIn: "24h",
        });
        return { token, message: "Login successful", full_name: user.full_name };
    }
    catch (error) {
        console.error("Error:", error);
        throw error;
    }
    finally {
        client.release();
    }
});

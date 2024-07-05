import { PoolClient } from "pg";
import { db } from "../../database/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

interface User {
  fullName: string;
  email: string;
  password: string;
  contactNumber: string;
}

interface UserLogin {
  email: string;
  password: string;
}

interface RegistrationResponse {
  token: string;
  message: string;
}

interface LoginResponse {
  token: string;
  message: string;
}

export const registerUser = async ({
  fullName,
  email,
  password,
  contactNumber,
}: User): Promise<RegistrationResponse> => {
  const client: PoolClient = await db.pool.connect();
  const emailCheckQuery = `SELECT * FROM users WHERE email = $1`;
  const emailCheckResult = await client.query(emailCheckQuery, [email]);

  if (emailCheckResult.rows.length > 0) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const insertQuery = `
    INSERT INTO users (full_name, email, contact_number, password_hash, role_id)
    VALUES ($1, $2, $3, $4, $5) returning user_id;
  `;
  const insertValues = [fullName, email, contactNumber, hashedPassword, 2];
  const registrationQuery = await client.query(insertQuery, insertValues);

  const userId = registrationQuery.rows[0].id;

  const token = jwt.sign({ userId: userId }, JWT_SECRET as string, {
    expiresIn: "24h",
  });

  return { token, message: "User registered successfully" };
};

export const loginUser = async ({
  email,
  password,
}: UserLogin): Promise<LoginResponse> => {
  const client: PoolClient = await db.pool.connect();
  try {
    const userQuery = `SELECT user_id, password_hash FROM users WHERE email = $1`;
    const userResult = await client.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      throw new Error("Email not found. Please try again.");
    }

    const user = userResult.rows[0];
    // Ensure the password is not undefined or null
    if (!user.password_hash) {
      throw new Error("Password not found for the user.");
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new Error("Invalid password. Please try again.");
    }

    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET as string, {
      expiresIn: "24h",
    });

    return { token, message: "Login successful" };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    client.release();
  }
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PoolClient } from "pg";
import { db } from "../../database/database.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.cookie) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET as string) as {
      userId: string;
    };

    // Add user information to res.locals for easy access in controllers
    const userInfo = await getUserInfo(decoded.userId);
    console.log(decoded);
    console.log("Info", userInfo.full_name);
    res.locals.full_name = userInfo.full_name;

    next();
  } catch (error) {
    console.error("Token validation error:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(405).json({ error: "Unauthorized: Invalid token" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Helper functions
const parseCookies = (cookie: string): Record<string, string> => {
  return cookie.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split("=");
    acc[name] = value;
    return acc;
  }, {} as Record<string, string>);
};

const getUserInfo = async (userId: string) => {
  const client: PoolClient = await db.pool.connect();
  const userQuery = `SELECT full_name, user_id FROM users WHERE user_id = $1`;
  const userInfo = await client.query(userQuery, [userId]);
  return userInfo.rows[0];
};

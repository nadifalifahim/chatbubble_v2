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
    const cookieHeader = await req.headers.cookie;
    console.log(req.headers.cookie);
    if (!cookieHeader) {
      return res.status(401).json({ error: "Unauthorized. Cookie missing." });
    }

    console.log(parseCookies(cookieHeader));
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized. Token missing" });
    }

    const decoded = jwt.verify(token, JWT_SECRET as string) as {
      userId: string;
    };
    console.log(decoded);

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

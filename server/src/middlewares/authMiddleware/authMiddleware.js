var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import { db } from "../../database/database.js";
const JWT_SECRET = process.env.JWT_SECRET;
export const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.cookie) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const cookies = parseCookies(req.headers.cookie);
        const token = cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        // Add user information to res.locals for easy access in controllers
        const userInfo = yield getUserInfo(decoded.userId);
        console.log(decoded);
        console.log("Info", userInfo.full_name);
        res.locals.full_name = userInfo.full_name;
        next();
    }
    catch (error) {
        console.error("Token validation error:", error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(405).json({ error: "Unauthorized: Invalid token" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
// Helper functions
const parseCookies = (cookie) => {
    return cookie.split(";").reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split("=");
        acc[name] = value;
        return acc;
    }, {});
};
const getUserInfo = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db.pool.connect();
    const userQuery = `SELECT full_name, user_id FROM users WHERE user_id = $1`;
    const userInfo = yield client.query(userQuery, [userId]);
    return userInfo.rows[0];
});

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
const JWT_SECRET = process.env.JWT_SECRET;
export const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookieHeader = req.headers.cookie;
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
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded);
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

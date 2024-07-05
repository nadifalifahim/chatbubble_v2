var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { registerUser, loginUser } from "../../models/authModels/authModels.js";
export const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, contactNumber, password } = req.body;
    try {
        const { token, message } = yield registerUser({
            fullName,
            email,
            contactNumber,
            password,
        });
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
            httpOnly: true,
            path: "/",
            secure: true,
            sameSite: "none", // Allow cross-site requests
        });
        res.status(201).json({ message });
    }
    catch (error) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unexpected error occurred" });
        }
    }
});
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const { token, message, full_name } = yield loginUser({ email, password });
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
            httpOnly: true,
            path: "/",
            secure: true,
            sameSite: "none", // Allow cross-site requests
        });
        res.status(200).json({ message, full_name });
    }
    catch (error) {
        console.error("Error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unexpected error occurred" });
        }
    }
});
export const signOut = (req, res) => {
    try {
        res.clearCookie("token", {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({ signout: true });
    }
    catch (error) {
        console.error("Error signing out:", error);
        res.status(500).json({ signout: false, error: "Internal server error" });
    }
};

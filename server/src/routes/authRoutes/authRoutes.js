import express from "express";
import { register, login, signOut, } from "../../controllers/authControllers/authControllers.js";
import { validateToken } from "../../middlewares/authMiddleware/authMiddleware.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/sign-out", signOut);
router.post("/protected", validateToken, (req, res) => {
    res.status(200).json({ authorized: true });
});
export default router;

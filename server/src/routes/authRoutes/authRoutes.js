import express from "express";
import { register, login, signOut, } from "../../controllers/authControllers/authControllers.js";
import { validateToken } from "../../middlewares/authMiddleware/authMiddleware.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/sign-out", signOut);
router.post("/protected", validateToken, (req, res) => {
    const { full_name } = res.locals;
    res.status(200).json({ authorized: true, full_name: full_name });
});
export default router;

import { registerUser, loginUser } from "../../models/authModels/authModels.js";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  const { fullName, email, contactNumber, password } = req.body;

  try {
    const { token, message } = await registerUser({
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
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { token, message, full_name } = await loginUser({ email, password });

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "none", // Allow cross-site requests
    });

    res.status(200).json({ message, full_name });
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

export const signOut = (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({ signout: true });
  } catch (error) {
    console.error("Error signing out:", error);
    res.status(500).json({ signout: false, error: "Internal server error" });
  }
};

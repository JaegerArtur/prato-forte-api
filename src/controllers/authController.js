import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

import { generateToken } from "../utils/generateToken.js";

const SALT_ROUNDS = 12;

const register = async (req, res) => {
    const { username, name, email, inputPassword } = req.body;

    if (!username || !name || !email || !inputPassword) {
        return res.status(400).json({ error: "Missing user data for registering" });
    }

    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(inputPassword, salt);

        const user = await prisma.user.create({
            data: { username, name, email, password: hashedPassword },
        });

        return res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
        // P2002 = "This operation would violate an unique constraint"
        if (error.code === "P2002") {
            // ["username"] or ["email"]
            const field = error.meta.target[0];
            return res.status(409).json({ error: `${field} already in use` });
        }

        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const login = async (req, res) => {
    const { email, inputPassword } = req.body;

    // Verify if the email is registered
    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare passwords if the email is registered
    const passwordIsValid = await bcrypt.compare(inputPassword, user.password);

    if (!passwordIsValid) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = generateToken(user.id, res);

    return res.status(201).json({ user: { id: user.id, username: user.username }, token });
};

export { register, login };

import { prisma } from "../config/db.js";

const register = async (req, res) => {
    const { username, name, email, password } = req.body;

    if (!username || !name || !email || !password) {
        return res.status(400).json({ error: "Missing user data for registering" });
    }

    try {
        const user = prisma.user.create({
            data: username,
            name,
            email, //colocar hash
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

export { register };

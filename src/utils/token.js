import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
    const payload = { id: userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return token;
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

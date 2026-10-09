import { UnauthorizedError } from "../errors/AppError.js";
import * as userRepository from "../repositories/userRepository.js";
import { hashPassword, passwordIsValid, passwordIsValid } from "../utils/password.js";
import { generateToken } from "../utils/token.js";

export const register = async (username, name, email, inputPassword) => {
    const hashedPassword = await hashPassword(inputPassword);
    try {
        const user = await userRepository.create(username, name, email, hashedPassword);

        return { user, token: generateToken(user.id) };
    } catch (error) {
        // P2002 = "This operation would violate an unique constraint"
        if (error.code === "P2002") {
            const field = error.meta.target[0];
            throw new ConflictError(`${field} already in use`);
        }

        throw error;
    }
};

export const login = async (email, password) => {
    // Verify if the email is registered
    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new UnauthorizedError("Invalid email or password");
    }

    // Compare passwords if the email is registered
    if (!(await passwordIsValid(password, user.password))) {
        throw new UnauthorizedError("Invalid email or password");
    }

    // Generate JWT Token
    const token = generateToken(user.id);

    return { user, token };
};

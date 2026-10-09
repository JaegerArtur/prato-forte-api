import * as authService from "../services/authService.js";

export const register = async (req, res) => {
    const { username, name, email, password } = req.body;

    const result = await authService.register(username, name, email, password);

    return res.status(201).json(result);
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return res.status(200).json(result);
};

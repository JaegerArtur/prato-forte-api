import prisma from "../config/db.js";

export const findByEmail = (email) => {
    return prisma.user.findUnique({ where: { email } });
};

export const findById = (id) => {
    return prisma.user.findUnique({ where: { id } });
};

export const create = (username, name, email, password) => {
    return prisma.user.create({
        data: { username, name, email, password },
        select: { id: true, username: true, name: true, email: true },
    });
};

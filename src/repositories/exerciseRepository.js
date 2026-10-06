import { prisma } from "../config/db.js";

// GET (one)
export const findByName = async (name, userId) => {
    return prisma.exercise.findUnique({
        where: {
            name: name,
            OR: [{ user_id: null }, { user_id: userId }],
            deleted_at: null,
        },
    });
};

export const findByNameForUser = async (name, userId) => {
    return prisma.exercise.findFirst({
        where: { user_id: userId, name },
    });
};

// GET (many)
export const findMany = async (userId, updatedAt) => {
    const where = {
        OR: [{ user_id: null }, { user_id: userId }],
    };

    if (updatedAt) {
        where.updated_at = { gt: updatedAt };
    }

    return prisma.exercise.findMany({ where });
};

// CREATE
export const create = async (name, userId, description, image, muscularGroupsIds) => {
    return prisma.exercise.create({
        data: {
            name,
            user_id: userId,
            description,
            image,
            muscular_groups: {
                create: muscularGroupsIds.map((id) => ({ muscular_id: id })),
            },
        },
        select: {
            id: true,
            name: true,
            description: true,
            image: true,
            muscular_groups: {
                select: {
                    muscular_ext: {
                        select: { name: true },
                    },
                },
            },
        },
    });
};

export const restore = async (id, { description, image, muscularGroupsIds }) => {
    return prisma.exercise.update({
        where: { id },
        data: {
            deleted_at: null,
            description,
            image,
            muscular_groups: {
                deleteMany: {},
                create: muscularGroupsIds.map((id) => ({ muscular_id: id })),
            },
        },
        select: {
            id: true,
            name: true,
            description: true,
            image: true,
            muscular_groups: {
                select: {
                    muscular_ext: {
                        select: { name: true },
                    },
                },
            },
        },
    });
};

// DELETE

// UPDATE

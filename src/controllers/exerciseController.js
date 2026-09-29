import { prisma } from "../config/db.js";

// GET

// CREATE
const createExercise = async (req, res) => {
    const { name, userId, muscularGroups, image, description } = req.body;

    if (!name || !userId || !muscularGroups) {
        return res.status(409).json({ error: "Missing exercise data for registering" });
    }

    const uniqueGroups = [...new Set(muscularGroups.map((name) => name.trim().toUpperCase()))];

    const foundGroups = await prisma.muscular_group.findMany({
        where: { name: { in: uniqueGroups } },
        select: { id: true },
    });

    if (foundGroups.length !== uniqueGroups.length) {
        const foundNames = new Set(foundGroups.map((g) => g.name));
        const missingNames = uniqueGroups.filter((name) => !foundNames.has(name));

        return res.status(400).json({ error: `Invalid muscular group name(s): ${missingNames.join(", ")}` });
    }

    try {
        const newExercise = await prisma.exercise.create({
            data: {
                name,
                user_id: userId,
                description,
                image,
                muscular_groups: {
                    create: foundGroups.map((group) => ({ muscular_id: group.id })),
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

        const response = {
            ...newExercise,
            muscularGroups: exercise.muscular_groups.map((mg) => mg.muscular_ext.name),
        };

        return res.status(201).json(response);
    } catch (error) {
        // P2002 = "This operation would violate an unique constraint"
        if (error.code === "P2002") {
            return res.status(409).json({ error: `Exercise already registered` });
        }

        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// DELETE

// UPDATE

export { createExercise };

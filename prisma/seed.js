import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const muscularGroups = [
    "CHEST",
    "BACK",
    "SHOULDERS",
    "BICEPS",
    "TRICEPS",
    "FOREARMS",
    "ABS",
    "OBLIQUES",
    "LOWER_BACK",
    "GLUTES",
    "QUADRICEPS",
    "HAMSTRINGS",
    "CALVES",
    "HIP_FLEXORS",
    "ADDUCTORS",
    "ABDUCTORS",
    "TRAPS",
    "NECK",
];

const main = async () => {
    console.log("Seeding muscular groups...");
    for (const name of muscularGroups) {
        await prisma.muscular_group.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        console.log(`Create muscular group: ${name}`);
    }
    console.log("Seeding completed");
};

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

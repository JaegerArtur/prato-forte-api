import { ConflictError, NotFoundError, ValidationError } from "../errors/AppError";
import "../repositories/exerciseRepository.js";

// GET (one)
export const getByName = async (name, userId) => {
    const exercise = await exerciseRepository.findByName(name, userId);

    if (!exercise) {
        throw new NotFoundError("Exercise not found");
    }

    return exercise;
};

// GET (many)
export const getAll = async (userId, updatedSince) => {
    const since = updatedSince ? new Date(updatedSince) : undefined;

    if (since && isNaN(since.getTime())) {
        throw new ValidationError("Invalid updatedSince date");
    }

    return exerciseRepository.findMany(userId, since);
};

// CREATE
export const create = async (name, userId, description, image, muscularGroupNames) => {
    if (!name || name.trim().length === 0) {
        throw new ValidationError("Exercise name is required");
    }

    const existing = await exerciseRepository.findByNameForUser(name, userId);

    if (existing && !existing.deleted_at) {
        throw new ConflictError("You already have an exercise with this name");
    }

    if (!muscularGroupNames || muscularGroupNames.length === 0) {
        throw new ValidationError("At least one muscular group is required");
    }

    const uniqueNames = [...new Set(muscularGroupNames.map((n) => n.trim().toUpperCase()))];
    const foundGroups = await muscularGroupRepository.findByNames(uniqueNames);

    if (foundGroups.length !== uniqueNames.length) {
        throw new ValidationError("Invalid muscular group name(s)");
    }

    if (existing) {
        return exerciseRepository.restore(existing.id, { description, image, foundGroups });
    }

    return exerciseRepository.create(name.trim(), userId, description, image, foundGroups);
};

// DELETE
export const remove = async (id, userId) => {
    const removed = await exerciseRepository.remove(id, userId);

    if (removed.count === 0) {
        throw new NotFoundError("Exercise not found");
    }
};

// UPDATE
export const update = async (id, userId, data) => {
    try {
        return await exerciseRepository.update(id, userId, data);
    } catch (err) {
        if (err.code === "P2025") {
            throw new NotFoundError("Exercise not found");
        }
        if (err.code === "P2002") {
            throw new ConflictError("You already have an exercise with this name");
        }
        throw err;
    }
};

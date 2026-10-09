import * as exerciseService from "../services/exerciseService.js";

// GET (one)
export const getExercise = async (req, res) => {
    const exercise = await exerciseService.getByName(req.query.name, req.userId);

    return res.status(200).json(exercise);
};

// GET (many)
export const getExercises = async (req, res) => {
    const exercises = await exerciseService.getAll(req.userId, req.query.updatedSince);

    return res.status(200).json(exercises);
};

// CREATE
export const createExercise = async (req, res) => {
    const { name, muscularGroups, image, description } = req.body;

    const newExercise = await exerciseService.create(name, req.userId, description, image, muscularGroups);

    return res.status(201).json(newExercise);
};

// DELETE
export const deleteExercise = async (req, res) => {
    await exerciseService.remove(req.params.exerciseId, req.userId);

    return res.status(204).send();
};

// UPDATE
export const updateExercise = async (req, res) => {
    const { name, description, image } = req.body;

    const exercise = await exerciseService.update(req.params.id, req.userId, { name, description, image });

    return res.status(200).json(exercise);
};

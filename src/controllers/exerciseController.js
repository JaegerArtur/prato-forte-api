import { create, getAll, getByName } from "../services/exerciseService.js";

// GET (unique item)
const getExercise = async (req, res) => {
    const exercise = await getByName(req.query.name, req.userId);

    return res.status(200).json(exercise);
};

// GET (many)
const getExercises = async (req, res) => {
    const exercises = await getAll(req.userId, req.query.updatedSince);

    return res.status(200).json(exercises);
};

// CREATE
const createExercise = async (req, res) => {
    const { name, muscularGroups, image, description } = req.body;

    const newExercise = await create(name, req.userId, description, image, muscularGroups);

    return res.status(201).json(newExercise);
};

// DELETE
const deleteExercise = async (req, res) => {
    await delete (req.query.exerciseId, req.userId);

    return res.status(204).send();
};

// UPDATE

export { getExercise, getExercises, createExercise };

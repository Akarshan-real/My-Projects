import express, { Request, Response } from 'express';
import User from '../../models/Todo.js';

const router = express.Router();

export default router.post("/todos", async (req: Request, res: Response) => {
    try {
        const { name, todos } = req.body;

        if (!name || !Array.isArray(todos)) {
            return res.status(400).json({ status: "failed", msg: "Invalid data provided" });
        }

        const user = await User.findOneAndUpdate(
            { name },
            { todos: todos },
            {
                new: true,
                upsert: true
            }
        );

        res.json(user);
    }
    catch (error: any) {
        res.status(500).json({ status: "failed", msg: error.message });
    }
});

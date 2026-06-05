import express, { Request, Response } from 'express';
import User from '../../models/Todo.js';
import { type ITodoUser } from "../../types/index.js";

const router = express.Router();

export default router.get("/todos/:name", async (req: Request, res: Response) => {
    const name = req.params.name as string;
    
    try {
        let user: ITodoUser | null = await User.findOne({ name });

        if (!user) {
            user = await User.create({
                name: name,
                todos: []
            });
        }

        res.json(user);
    }
    catch (error: any) {
        res.status(500).json({ status: "failed", msg: error.message });
    }
});
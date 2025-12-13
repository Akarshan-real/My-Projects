// todoRoutes.js
import express from 'express'
import User from '../models/Todo.js'

const router = express.Router();

router.get("/todos/:name", async (req, res) => {
    const name = req.params.name;
    try {
        let user = await User.findOne({ name });

        if (!user) {
            user = await User.create({ name , todos: [] });
        };

        res.json(user);
    }
    catch (error) {
        res.status(500).json({status : "failed", msg : error.message});
    }
});

router.post("/todos", async (req, res) => {
    try {
        const { name , todos } = req.body;

        const user = await User.findOneAndUpdate(
            {name},
            {todos : todos},
            {new : true}
        );

        res.json(user);
    }
    catch (error) {
        res.status(500).json({status : "failed", msg : error.message});
    }
});

export default router;

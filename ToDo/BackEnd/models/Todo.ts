import mongoose from "mongoose";
import { ITodoUser } from "../types/index.js";

const userSchema = new mongoose.Schema<ITodoUser>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    todos: {
        type: [String],
        default: []
    }
});

export default mongoose.model<ITodoUser>('User', userSchema);
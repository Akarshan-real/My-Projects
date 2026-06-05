import { Document } from "mongoose";

export interface ITodoUser extends Document {
    name: string;
    todos: string[];
}
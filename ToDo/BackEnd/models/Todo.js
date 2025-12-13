// Todo.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema ({
    name : {type: String , required: true , unique: true},
    todos: [String]
});

export default mongoose.model('User',userSchema);
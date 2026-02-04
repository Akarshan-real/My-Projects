// Todo.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema ({
    name : {type: String , required: true , unique: true},
    todos: { type : [String] , default: [] }
});

export default mongoose.model('User',userSchema);
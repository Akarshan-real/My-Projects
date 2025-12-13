import React, { useState, useRef, useEffect } from "react"
import './Todo.css'

const Todo = ({ info, show, onCheckChange, index, isEditing, setEditValue, isSelected , lockedIndex }) => {

    const inputRef = useRef(null); // this is the select box for the todo to enable select or not
    const editRef = useRef(null); // the input which appears in the todo.jsx and send the edited value back to app.jsx db
    const [val, setVal] = useState(info); // this is to display and store the value being edited and set to display and later send abck to app.jsx for db


    
    useEffect(() => {
        if (isEditing) {
            editRef.current.value = info;
            editRef.current.focus();
        }
        else {

        }
    }, [isEditing, info])

    useEffect(() => {
        if (show) {
            if (isSelected) {
                inputRef.current.focus();
            } else {
                inputRef.current.blur();
            }
        }
    }, [isSelected, show]);


    return (
        <div className='outerTodo' onClick={(e) => e.stopPropagation()}>
            <span
                className={`todoInfoBox ${isSelected ? "checked" : "unchecked"} flex-1 block relative`}
            >

                <form
                    onSubmit={(e) => { 
                        e.preventDefault(); 
                        setEditValue(val); 
                    }}
                    onClick={(e) => e.stopPropagation()}

                    className={`absolute z-10 left-0 top-0 w-full ${isEditing && lockedIndex === index ? "flex items-center" : "hidden"}`}>
                    <input
                        autoComplete="off"
                        className={`w-full`}
                        type="text"
                        ref={editRef}
                        name="editingText"
                        id="editingTextInput"
                        placeholder={`${val}`}
                        onChange={(e) => {
                            setVal(e.target.value);
                            setEditValue(e.target.value);
                        }}
                    />
                </form>

                <span className={`${isEditing && lockedIndex === index ? "opacity-0 pointer-events-none" : "opacity-100 "}`}>
                    {info}
                </span>
            </span>

            <div
                className={`todoCheckBoxContainer ${show ? "show" : ""}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onCheckChange(index);
                }}
            >
                <input
                    ref={inputRef}
                    type="checkbox"
                    checked={isSelected}
                    name="todo-select"
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => onCheckChange(index)}
                    className={`todoCheckbox`}
                />
                <span
                    onCopy={(e) => e.preventDefault()}
                    className={`todoChecked 
                    ${isSelected ? "checked" : "unchecked"}`} 
                >
                    {isSelected ? "Checked" : "Check"}
                </span>
            </div>
        </div>
    )
}

export default Todo

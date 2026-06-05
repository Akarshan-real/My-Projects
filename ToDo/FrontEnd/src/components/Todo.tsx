import { useState, useRef, useEffect } from "react"

interface TodoProps {
    info: string;
    show: boolean;
    onCheckChange: (index: number) => void;
    index: number;
    isEditing: boolean;
    setEditValue: (val: string) => void;
    isSelected: boolean;
    lockedIndex: number | null;
    onSave: () => void;
}

const Todo = ({ info, show, onCheckChange, index, isEditing, setEditValue, isSelected , lockedIndex, onSave }: TodoProps) => {

    const inputRef = useRef<HTMLInputElement>(null); // this is the select box for the todo to enable select or not
    const editRef = useRef<HTMLInputElement>(null); // the input which appears in the todo.jsx and send the edited value back to app.jsx db
    const [val, setVal] = useState(info); // this is to display and store the value being edited and set to display and later send abck to app.jsx for db

    useEffect(() => {
        setVal(info);
    }, [info]);


    
    useEffect(() => {
        if (isEditing && editRef.current) {
            editRef.current.value = val;
            editRef.current.focus();
        }
    }, [isEditing])

    useEffect(() => {
        if (show) {
            if (isSelected) {
                inputRef.current?.focus();
            } else {
                inputRef.current?.blur();
            }
        }
    }, [isSelected, show]);


    return (
        <div className='flex justify-between items-center w-full min-h-[60px] relative px-4 py-3 bg-white/30 hover:bg-white/50 rounded-2xl transition-colors duration-200 border border-transparent hover:border-white/40 shadow-sm' onClick={(e) => e.stopPropagation()}>
            <span
                className={`relative transition-all duration-300 flex h-full items-center max-w-[80%] ${isSelected ? "text-[1.3rem] md:text-[1.5rem] font-semibold text-navbar-bg" : "text-[1.2rem] md:text-[1.3rem] text-gray-800"} block w-full`}
            >

                <form
                    onSubmit={(e) => { 
                        e.preventDefault(); 
                        setEditValue(val); 
                        onSave();
                    }}
                    onClick={(e) => e.stopPropagation()}

                    className={`absolute z-10 left-0 top-0 w-full ${isEditing && lockedIndex === index ? "flex items-center" : "hidden"}`}>
                    <input
                        autoComplete="off"
                        className={`w-full bg-white/70 px-3 py-1 rounded-xl outline-none border border-white focus:outline-none focus:border-navbar-bg focus:ring-1 focus:ring-navbar-bg transition-all text-[1.2rem]`}
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

                <span className={`block w-full wrap-break-word pl-[5px] ${isEditing && lockedIndex === index ? "opacity-0 pointer-events-none" : "opacity-100 "}`}>
                    {info}
                </span>
            </span>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${show ? "w-[120px] opacity-100 ml-3" : "w-0 opacity-0 ml-0"}`}>
                <div
                    className={`flex justify-center items-center gap-2 py-2 px-3 cursor-pointer rounded-xl bg-white/50 hover:bg-white/80 shadow-sm border border-white/60 w-full`}
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
                        className={`flex justify-center content-center cursor-pointer`}
                    />
                    <span
                        onCopy={(e) => e.preventDefault()}
                        className={`transition-all duration-300 font-medium
                        ${isSelected ? "opacity-100 text-[1.1rem] text-navbar-bg" : "opacity-70 text-[1rem] text-gray-700"}`} 
                    >
                        {isSelected ? "Checked" : "Check"}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Todo

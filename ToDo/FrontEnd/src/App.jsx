// App.jsx
import { useState, useEffect, useRef } from 'react'
import viteLogo from '/vite.svg'
import LogIn from './components/LogIn'
import Navbar from './components/Navbar'
import Todo from './components/Todo'
import Label from './components/Label'
import './App.css'

const API = {
  URL : import.meta.env.VITE_API_URL,
  KEY : import.meta.env.VITE_API_KEY
};

function App() {

  const [logInStatus, setLogInStatus] = useState(!!localStorage.getItem("userName")); // to take username from the user instead of prompt
  const [logInName, setLogInName] = useState(localStorage.getItem("userName")); // to get the log-in name from user
  const [select, setSelect] = useState(false); // to see if the todos should be selected or not
  const [hasClickedOnce, setHasClickedOnce] = useState(true); // to check if select is once or not but in inverse
  const [data, setData] = useState([]); // to store todos in an array
  const [selectedIndexes, setSelectedIndexes] = useState([]); // to set the indexes of the todos selected at the moment
  const [editValue, setEditValue] = useState(""); // to set the new value to the only todo selected
  const [lockedIndex, setLockedIndex] = useState(null); // stores the index the editing is happening on
  const [editing, setEditing] = useState(false); // to enable or disable the state of a todo being edited

  // ----------------------------------------------------------------------------------------------

  const nameEntry = (name) => {
    const newName = name.trim().toLowerCase();
    setLogInName(newName);
    localStorage.setItem("userName" , newName);
  };

  useEffect(() => {
    if (!logInName) {
      return;
    }

    (async function () {
      try {
        const response = await fetch(`${API.URL}/api/todos/${logInName}`, {
          headers: {
            "content-type": "application/json",
            "frontend-api": API.KEY
          }
        });
        if (response.ok) {
          const user = await response.json();
          setData(user.todos || []);
        }
        else {
          throw new Error("Backend problem");
        }
      }
      catch (error) {
        console.log(`Error is ${error}`);
      }
    })();
  }, [logInName]);

  async function saveTodosForBackend(updatedTodosArray) {
    try {
      await fetch(`${API.URL}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 'frontend-api': API.KEY },
        body: JSON.stringify({ name: logInName, todos: updatedTodosArray })
      })
    }
    catch (error) {
      console.error(`Error happened : ${error}`);
    }
  };

  // ----------------------------------------------------------------------------------------------

  const handelAddData = async (xtra) => {
    xtra = xtra.trim();
    if (xtra === '') {
      alert("Enter a valid todo");
    }
    else {
      const updatedTodosArray = [...data, xtra];
      setData(updatedTodosArray);
      await saveTodosForBackend(updatedTodosArray);
    }
  };

  const handelCheckChange = (idx) => {
    setSelectedIndexes(prev => {
      if (prev.includes(idx)) {
        const updatedIndexes = prev.filter(i => i !== idx);
        return updatedIndexes;
      }
      else {
        const updatedIndexes = [...prev, idx]
        return updatedIndexes;
      }
    });
  };

  // ----------------------------------------------------------------------------------------------

  const handleSelectClick = () => {
    setHasClickedOnce(false);
    setSelect(true);
  };


  useEffect(() => {
    console.log("selectedIndexes:", selectedIndexes);
  }, [selectedIndexes]);


  useEffect(() => {
    setEditValue(data[selectedIndexes[0]]);
  }, [selectedIndexes, data]);

  const handleCancel = () => {
    setEditing(false);
    setSelect(false);
    setSelectedIndexes([]);
  };

  const handelEdit = async () => {
    if (!editing) {
      if (selectedIndexes.length !== 1) {
        return;
      }
      setLockedIndex(selectedIndexes[0]);
      setEditing(true);
      return;
    }
    else {
      const updatedTodosArray = data.map((item, index) =>
        index === lockedIndex ? editValue : item
      );
      await saveTodosForBackend(updatedTodosArray);
      setData(updatedTodosArray);
      setEditing(false);
      setLockedIndex(null);
      setSelectedIndexes([]);
      setSelect(false);
    }
  };

  const handelDelete = async () => {
    const updatedTodosArray = data.filter((_, i) => !selectedIndexes.includes(i));
    setData(updatedTodosArray);
    await saveTodosForBackend(updatedTodosArray);
    setSelectedIndexes([]);
    setSelect(false);
  };

  // ----------------------------------------------------------------------------------------------

  return (
    <div className='mx-auto flex flex-col items-center overflow-x-hidden gap-4 bg-(--navbar-bg) h-screen'>

      {/* LOG IN WITH USERNAME */}
      {!logInStatus && < LogIn logInChanger={setLogInStatus}  nameCheck={nameEntry} />}

      {/* NAVBAR */}
      <Navbar todos={data} />

      {/* MAIN CONTAINER */}
      <div className="todos w-[calc(100%-2rem)] h-fit bg-(--content-bg) rounded-2xl p-4 flex flex-col gap-5">

        {/* ADD A TODO */}
        <h2 className='font-bold text-4xl'>Add a ToDo</h2>

        {/* ADD BOX */}
        <Label onAdd={handelAddData} />

        {/* HEADING OF YOUR TODOS */}
        <h2 className='font-bold text-4xl w-fit'>Your ToDos</h2>

        {/* TODO BUTTONS */}
        <div className='h-12 flex items-center gap-8 relative'>

          {/* SELECT BUTTON */}
          <div className={`absolute left-0 top-0 h-full 
          ${hasClickedOnce ? "opacity-100" : (select ? "slideOut" : "slideIn")
            }`}>
            <button
              type="button"
              className={`selectButton flex justify-center items-center ${data.length > 0 ? "" : "opacity-50 pointer-events-none"}`}
              onClick={data.length > 0 ? handleSelectClick : null}
              disabled={data.length === 0}>
              Select
            </button>
          </div>

          {/* CANCEL , EDIT , DELETE BUTTON */}
          <div className={`
          absolute left-0 top-0 h-full flex gap-4 
          ${hasClickedOnce ? "opacity-0 pointer-events-none" : (select ? "slideIn" : "slideOut")}
          `}>
            <button
              type='button'
              className="operationButtons flex justify-center items-center cancel"
              onClick={handleCancel}>
              Cancel
            </button>

            <button
              type='button' className={`operationButtons flex justify-center items-center edit ${selectedIndexes.length === 1 ? "" : "opacity-50 pointer-events-none"}`}
              onClick={handelEdit}>
              {editing ? "Save" : "Edit"}
            </button>

            <button
              type='button' className={`operationButtons flex justify-center items-center delete ${selectedIndexes.length > 0 ? "" : "opacity-50 pointer-events-none"}`}
              onClick={handelDelete}>
              Delete
            </button>
          </div>

        </div>

        {/* TODO CONTAINER */}
        <div className='flex flex-col gap-6'>
          {data.map((element, index) => (
            <Todo
              key={index} // mandatory key value
              info={element} // the name of the todos collected from db
              show={select} // the state if the todos's selector buttons should be showed or not
              onCheckChange={handelCheckChange} // to set the index of those todos which are selected
              index={index} // passing the index as index
              isEditing={editing} // to see if the todo is being edited or not 
              setEditValue={setEditValue} // to obtain the edited value from todo.jsx
              isSelected={selectedIndexes.includes(index)} // to see which is selected i think i dunno
              lockedIndex={lockedIndex} // locks the editing index
            />
          ))}
        </div>

      </div>
    </div>
  )
}

export default App

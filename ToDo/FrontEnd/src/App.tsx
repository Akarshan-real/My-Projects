import { useState, useEffect } from 'react';
import axiosInstance from './lib/axiosInstance';
import LogIn from './components/LogIn';
import Navbar from './components/Navbar';
import Todo from './components/Todo';
import Label from './components/Label';

function App() {

  const [logInStatus, setLogInStatus] = useState(!!localStorage.getItem("userName")); // to take username from the user instead of prompt
  const [logInName, setLogInName] = useState(localStorage.getItem("userName")); // to get the log-in name from user
  const [select, setSelect] = useState(false); // to see if the todos should be selected or not
  const [data, setData] = useState<string[]>([]); // to store todos in an array
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]); // to set the indexes of the todos selected at the moment
  const [editValue, setEditValue] = useState(""); // to set the new value to the only todo selected
  const [lockedIndex, setLockedIndex] = useState<number | null>(null); // stores the index the editing is happening on
  const [editing, setEditing] = useState(false); // to enable or disable the state of a todo being edited

  // ----------------------------------------------------------------------------------------------

  const nameEntry = (name: string) => {
    const newName = name.trim().toLowerCase();
    setLogInName(newName);
    localStorage.setItem("userName", newName);
  };

  useEffect(() => {
    if (!logInName) {
      return;
    };

    (async function () {
      try {
        const response = await axiosInstance.get(`/todos/${logInName}`);

        if (response && response.data) {
          setData(response.data.todos || []);
        }
        else {
          return;
        }
      }
      catch (error) {
        console.log(`Error is ${error}`);
        return;
      }
    })();
  }, [logInName]);

  async function saveTodosForBackend(updatedTodosArray: string[], previousData: string[]) {
    if (!logInName || !Array.isArray(updatedTodosArray)) {
      console.error("Invalid data: missing name or todos array");
      setData(previousData);
      alert("Invalid data. Cannot save.");
      return;
    }

    try {
      await axiosInstance.post('/todos', { name: logInName, todos: updatedTodosArray });
    }
    catch (error) {
      console.error(`Error happened : ${error}`);
      setData(previousData);
      alert("Failed to save changes to the server! Reverting changes.");
      return;
    }
  };

  // ----------------------------------------------------------------------------------------------

  const handelAddData = async (xtra: string) => {
    xtra = xtra.trim();
    if (xtra === '') {
      alert("Enter a valid todo");
    }
    else {
      const previousData = data;
      const updatedTodosArray = [...data, xtra];
      setData(updatedTodosArray);
      saveTodosForBackend(updatedTodosArray, previousData);
    }
  };

  const handelCheckChange = (idx: number) => {
    setSelectedIndexes((prev: number[]) => {
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
    console.log("handelEdit called. editing:", editing, "lockedIndex:", lockedIndex, "editValue:", editValue);
    if (!editing) {
      if (selectedIndexes.length !== 1) {
        return;
      }
      setLockedIndex(selectedIndexes[0]);
      setEditing(true);
      return;
    }
    else {
      console.log("Saving...");
      const previousData = data;
      const updatedTodosArray = data.map((item, index) =>
        index === lockedIndex ? editValue : item
      );
      setData(updatedTodosArray);
      setEditing(false);
      setLockedIndex(null);
      setSelectedIndexes([]);
      setSelect(false);

      saveTodosForBackend(updatedTodosArray, previousData);
    }
  };

  const handelDelete = async () => {
    const previousData = data;
    const updatedTodosArray = data.filter((_, i) => !selectedIndexes.includes(i));
    setData(updatedTodosArray);
    setSelectedIndexes([]);
    setSelect(false);
    saveTodosForBackend(updatedTodosArray, previousData);
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    setLogInName(null);
    setLogInStatus(false);
    setData([]);
  };

  // ----------------------------------------------------------------------------------------------

  return (
    <div className='mx-auto flex flex-col items-center overflow-x-hidden bg-gradient-to-br from-[#1e293b] via-navbar-bg to-[#0f172a] min-h-screen selection:bg-pink-300 selection:text-navbar-bg'>

      {/* LOG IN WITH USERNAME */}
      {!logInStatus && < LogIn logInChanger={setLogInStatus}  nameCheck={nameEntry} />}

      {/* NAVBAR */}
      <Navbar todos={data} onLogout={handleLogout} />

      {/* MAIN CONTAINER */}
      <div className="w-[calc(100%-2rem)] max-w-[1200px] h-fit bg-content-bg/95 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 flex flex-col gap-8 mt-8 mb-12 shadow-2xl shadow-black/20 border border-white/50 relative overflow-hidden">
        {/* Subtle inner glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

        {/* ADD A TODO */}
        <h2 className='font-bold text-3xl md:text-4xl text-navbar-bg drop-shadow-sm tracking-tight'>Add a ToDo</h2>

        {/* ADD BOX */}
        <Label onAdd={handelAddData} />

        {/* HEADING OF YOUR TODOS */}
        <h2 className='font-bold text-3xl md:text-4xl w-fit text-navbar-bg drop-shadow-sm tracking-tight mt-4'>Your ToDos</h2>

        {/* TODO BUTTONS */}
        <div className='flex flex-wrap items-center gap-3 md:gap-4'>

          {!select ? (
            <button
              type="button"
              className={`rounded-2xl bg-navbar-bg font-semibold text-white px-6 md:px-8 h-10 md:h-12 cursor-pointer transition-all duration-200 ease-in-out whitespace-nowrap hover:bg-navbar-bg-hover hover:shadow-lg hover:-translate-y-0.5 active:scale-95 text-[14px] md:text-base flex justify-center items-center shadow-md shrink-0 ${data.length > 0 ? "" : "opacity-50 pointer-events-none"}`}
              onClick={data.length > 0 ? handleSelectClick : undefined}
              disabled={data.length === 0}>
              Select
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-3 md:gap-4 animate-[popup_0.3s_ease-out]">
              <button
                type='button'
                className="rounded-2xl bg-gray-500 font-semibold text-white px-5 md:px-8 h-10 md:h-12 cursor-pointer transition-all duration-200 ease-in-out whitespace-nowrap hover:bg-gray-600 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 text-[14px] md:text-base flex justify-center items-center shadow-md shrink-0"
                onClick={handleCancel}>
                Cancel
              </button>

              <button
                type='button' className={`rounded-2xl bg-navbar-bg font-semibold text-white px-5 md:px-8 h-10 md:h-12 cursor-pointer transition-all duration-200 ease-in-out whitespace-nowrap hover:bg-navbar-bg-hover hover:shadow-lg hover:-translate-y-0.5 active:scale-95 text-[14px] md:text-base flex justify-center items-center shadow-md shrink-0 ${selectedIndexes.length === 1 ? "" : "opacity-50 pointer-events-none"}`}
                onClick={handelEdit}>
                {editing ? "Save" : "Edit"}
              </button>

              <button
                type='button' className={`rounded-2xl bg-red-500 font-semibold text-white px-5 md:px-8 h-10 md:h-12 cursor-pointer transition-all duration-200 ease-in-out whitespace-nowrap hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 text-[14px] md:text-base flex justify-center items-center shadow-md shrink-0 ${selectedIndexes.length > 0 ? "" : "opacity-50 pointer-events-none"}`}
                onClick={handelDelete}>
                Delete
              </button>
            </div>
          )}

        </div>

        {/* TODO CONTAINER */}
        <div className='flex flex-col gap-4 w-full'>
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
              onSave={handelEdit} // saves on enter
            />
          ))}
        </div>

      </div>
    </div>
  )
}

export default App

import { useState } from 'react';
import Navbar_todos from './Navbar_todos';

interface NavbarProps {
  todos: string[];
  onLogout: () => void;
}

const Navbar = ({ todos, onLogout }: NavbarProps) => {

  const [show, setShow] = useState(false);

  return (
    <>
      <nav className='flex justify-center items-center w-full h-14 text-white bg-navbar-bg/80 backdrop-blur-lg border-b border-white/10 shadow-lg sticky top-0 z-[60]'>
        <div className='flex justify-between items-center h-full w-full px-6 max-w-[1400px]'>
        <div>
          <span className='w-fit h-fit cursor-context-menu font-bold'>iTask</span>
        </div>
        <ul className='flex justify-center items-center gap-6 md:gap-10 h-full text-sm md:text-base'>
          <li className={`group cursor-pointer relative h-fit whitespace-nowrap rounded-2xl px-1 transition-all duration-300 after:content-[''] after:h-[2px] after:w-0 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:rounded-2xl after:bg-white after:transition-all after:duration-200 hover:after:w-full opacity-100 pointer-events-auto`} onClick={() => setShow(true)}>Your Tasks</li>
          <li className={`group cursor-pointer relative h-fit whitespace-nowrap rounded-lg px-3 py-1 ml-2 transition-all duration-300 bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white border border-red-500/30 hover:shadow-[0_0_10px_rgba(239,68,68,0.4)]`} onClick={onLogout}>Logout</li>
        </ul>
        </div>
      </nav>

      <div onClick={() => setShow(false)} className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[100dvh] w-[100dvw] flex justify-center items-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-[9999] ${show ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
        <div onClick={(e) => e.stopPropagation()} className={`flex flex-col relative w-[85%] max-w-[800px] h-[75%] max-h-[800px] bg-navbar-bg/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl shadow-black/50`}>
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 shrink-0">
             <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">Your Tasks</h2>
             <button onClick={() => {
                const text = todos.map(t => `• ${t}`).join('\n');
                if (text) {
                  navigator.clipboard.writeText(text);
                  alert("Copied all tasks to clipboard!");
                }
             }} className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-5 py-2 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 text-sm md:text-base font-semibold cursor-pointer">Copy to Clipboard</button>
          </div>
          
          <div className="flex flex-col gap-3 overflow-y-auto pr-2">
            {todos.length === 0 ? (
              <div className="text-center text-white/50 mt-10 text-lg">No tasks added yet.</div>
            ) : (
              todos.map((element, index) => (
                <Navbar_todos
                  key={index}
                  info={element}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar

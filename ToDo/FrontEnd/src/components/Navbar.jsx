import { useState } from 'react';
import './Navbar.css'
import Navbar_todos from './Navbar_todos';

const Navbar = ({ todos }) => {

  const [show, setShow] = useState(false);

  return (
    <nav className='flex justify-center items-center w-full h-12 text-white'>
      <div className='nav-first-div flex justify-between items-center h-full z-50 w-full px-4'>
        <div>
          <span className='w-fit h-fit cursor-context-menu font-bold'>iTask</span>
        </div>
        <ul className='flex justify-center items-center gap-10 h-full'>
          <li className={`lis cursor-pointer relative h-fit whitespace-nowrap ${show ? "active scale-[1.15]" : "deactive"}`} onClick={() => setShow(false)}>Home</li>
          <li className={`lis cursor-pointer relative h-fit whitespace-nowrap ${show ? "deactive" : "active"}`} onClick={() => setShow(true)}>Your Tasks</li>
        </ul>
      </div>

      <div className={`floatingTodos ${show ? "display-on" : "display-off"}`}>
        <div className={`flex flex-col gap-4 w-[70%] h-[70%] bg-[#212121] rounded-2xl py-6 border-3 border-white`}>
          {todos.map((element, index) => (
            <Navbar_todos
              key={index}
              info={element}
            />
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

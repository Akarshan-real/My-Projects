import "./Navbar_todos.css"
const Navbar_todos = ({info}) => {
  return (
    <div className={`navbar-todos-divs w-full h-fit m-0 px-[5%] py-1 whitespace-normal flex items-center`}>
      <span>
        {info}
      </span>
    </div>
  )
}

export default Navbar_todos

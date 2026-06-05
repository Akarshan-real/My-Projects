interface NavbarTodosProps {
  info: string;
}

const Navbar_todos = ({info}: NavbarTodosProps) => {
  return (
    <div className={`w-full h-fit m-0 px-5 py-3 flex items-center bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-white/10`}>
      <span className="w-full wrap-break-word relative pl-5 text-white/95 text-[1.1rem]">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400/80 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></span>
        {info}
      </span>
    </div>
  )
}

export default Navbar_todos

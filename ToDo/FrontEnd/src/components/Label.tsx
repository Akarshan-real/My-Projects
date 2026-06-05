import { useRef, useState } from 'react'

interface LabelProps {
    onAdd: (val: string) => void;
}

const Label = ({ onAdd }: LabelProps) => {
    const [val, setVal] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const inputBox = useRef<HTMLInputElement>(null);

    const handelAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!val.trim()) return;
        setShowPopup(true);
        onAdd(val);
        setVal('');
        setTimeout(() => {
            setShowPopup(false);
        }, 2000);
    }

    return (
        <div className='flex items-center gap-4 w-full md:flex-row flex-col mb-4'>
            {showPopup && <div className='fixed w-fit h-fit py-3 px-6 pointer-events-none bg-gradient-to-tr from-[#04db3e] to-[#02cde8] rounded-2xl shadow-xl top-8 left-1/2 -translate-x-1/2 text-xl border border-white/50 text-white font-extrabold z-[9999] animate-popup tracking-wide'>Data Added ✨</div>}
            
            <form onSubmit={handelAdd} className={`group relative w-full md:max-w-[500px] h-[56px] rounded-2xl py-2 px-3 border border-white/60 bg-white/40 backdrop-blur-sm transition-all duration-300 flex items-center hover:bg-white/60 focus-within:bg-white/80 focus-within:ring-2 focus-within:ring-navbar-bg focus-within:border-transparent shadow-sm`} id='inputHolder'>
                <input className='w-full h-full px-2 outline-none border-none focus:outline-none focus:border-none focus:ring-0 z-20 bg-transparent text-[1.1rem] text-gray-800 placeholder-transparent' autoComplete='off'
                    ref={inputBox} placeholder='Enter What To Do 😎' value={val} type="text" name="todoAddBox" id="todoA" onChange={(e) => setVal(e.target.value)} />
                <label className={`absolute left-4 top-1/2 -translate-y-1/2 text-[1rem] text-gray-600 pointer-events-none transition-all duration-300 z-30 font-medium ${val.length > 0 ? '-translate-y-[2.2rem] text-[0.8rem] text-navbar-bg font-bold opacity-0' : 'group-focus-within:-translate-y-[2.2rem] group-focus-within:text-[0.8rem] group-focus-within:text-navbar-bg group-focus-within:font-bold group-focus-within:opacity-0'}`}
                    htmlFor="todoA">Enter What To Do 😎</label>
            </form>
            <button disabled={val.trim() === ''} type='submit' className={`flex justify-center w-full md:w-auto items-center py-2 h-[56px] text-white font-semibold cursor-pointer bg-navbar-bg px-8 rounded-2xl transition-all duration-200 hover:bg-navbar-bg-hover hover:-translate-y-0.5 hover:shadow-lg active:scale-95 shadow-md shrink-0 ${val.trim() ? "opacity-100" : "opacity-50 pointer-events-none"}`} form='inputHolder'>
                <span className='flex justify-center items-center text-[1.1rem] tracking-wide'>Add Task</span>
            </button>
        </div>
    )
}

export default Label




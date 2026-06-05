// logger.jsx
import { useState, useRef } from 'react'

interface LogInProps {
    logInChanger: (status: boolean) => void;
    nameCheck: (name: string) => void;
}

const LogIn = ({ logInChanger, nameCheck }: LogInProps) => {

    const [done, setDone] = useState(false);
    const [val, setVal] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const loggerRef = useRef<HTMLInputElement>(null);
    
    const isActive = isFocused || val.length > 0;
    
    return (
        <div className='w-screen h-screen flex justify-center items-center flex-col gap-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] z-[9998] fixed top-0 left-0'>
            <h1 className={`transition-colors duration-500 ease-in-out ${val.length > 0 ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" : "text-white/60"} text-8xl md:text-9xl tracking-tighter font-extrabold mb-4`}>iTask</h1>
            <div className='w-fit h-fit bg-white/5 p-8 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl'>
                <form id='userNameTaker'
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!val || val.trim().length === 0) {
                            setVal('');
                            setDone(true);
                            return;
                        }
                        nameCheck(val);
                        logInChanger(true);
                    }} className={`group w-fit h-fit`}>
                    <div className='w-fit h-fit relative mt-6'>
                        <input type="text" value={val} id='logger' ref={loggerRef}
                        autoComplete='off'
                            className={`text-white w-[80vw] md:w-[400px] h-[56px] rounded-2xl border border-white/20 bg-white/5 px-6 transition-all duration-300 outline-none focus:outline-none focus:border-blue-400 focus:bg-white/10 focus:ring-4 focus:ring-blue-400/20 text-lg shadow-inner`}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onChange={(e) => {
                                setVal(e.target.value);
                                if (done) {
                                    setDone(false);
                                }
                                }} />
                        <label id='loggerLabel' className={`z-[9999] absolute transition-all duration-300 pointer-events-none font-medium px-1 ${isActive ? '-top-2 left-2 text-[13px] text-blue-300 -translate-y-full' : 'top-1/2 left-6 text-[16px] text-white/50 -translate-y-1/2'}`} htmlFor="logger">Enter your awesome name 😉</label>
                    </div>
                    <button disabled={!val.trim()} className={`${val.trim() ? "opacity-100 cursor-pointer hover:bg-blue-600 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(37,99,235,0.3)] active:scale-95" : "opacity-50 pointer-events-none"} w-full h-[56px] flex justify-center items-center bg-blue-500 rounded-2xl mt-6 text-white font-bold text-xl transition-all duration-300`} type="submit" id='loggerButton' form='userNameTaker'>Enter App</button>
                </form>
            </div>
            {done && <div className='text-red-800 text-[0.8rem] font-bold'>Please enter a valid name 😠</div>}
        </div>
    )
}

export default LogIn

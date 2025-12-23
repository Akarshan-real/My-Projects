// logger.jsx
import React, { useState, useRef } from 'react'
import './LogIn.css'

const LogIn = ({ logInChanger, nameCheck }) => {

    const [done, setDone] = useState(false);
    const [val, setVal] = useState('');
    const loggerRef = useRef();
    
    return (
        <div className='w-screen h-screen mid flex-col gap-4 bg-[#000000] z-9998 absolute'>
            <h1 className={`transition-colors duration-300 ease-in-out ${val.length > 0 ? "text-white" : "text-[#808080]"} text-8xl tracking-wide`}>iTask</h1>
            <div className='w-fit h-fit'>
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
                    }} className={`w-fit h-fit loggerForm ${val.length > 0 ? "lockedAf" : ""}`}>
                    <div className='w-fit h-fit relative'>
                        <input type="text" value={val} id='logger' ref={loggerRef}
                        autoComplete='off'
                            className={`text-white`}
                            onChange={(e) => {
                                setVal(e.target.value);
                                if (done) {
                                    setDone(false);
                                }
                                }} />
                        <label id='loggerLabel' htmlFor="logger">Enter your awesome name 😉</label>
                    </div>
                    <button disabled={!val.trim()} className={`${val.trim() ? "opacity-100 cursor-pointer" : "opacity-50 pointer-events-none"} w-full h-[50px] mid bg-red-600 rounded-4xl my-5 text-white font-bold `} type="submit" id='loggerButton' form='userNameTaker'>Enter</button>
                </form>
            </div>
            {done && <div className='text-red-800 text-[0.8rem] font-bold'>Please enter a valid name 😠</div>}
        </div>
    )
}

export default LogIn

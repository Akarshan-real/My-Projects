import React, { useState, useRef } from 'react'
import './LogIn.css'

const LogIn = ({ logInChanger, nameCheck }) => {

    const [done, setDone] = useState(false);
    const [val, setVal] = useState('');
    const loggerRef = useRef();

    return (
        <div className='w-screen h-screen mid flex-col gap-4 bg-[#000000] z-9998 absolute'>
            <div className='w-fit h-fit'>
                <form id='userNameTaker'
                    onSubmit={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (!val || val.trim().length === 0) {
                            setVal('');
                            setDone(true);
                            return;
                        }
                        nameCheck(val);
                        logInChanger(true);
                        setVal('');
                    }} className={`w-fit h-fit loggerForm ${val.length > 0 ? "lockedAf" : ""}`}>
                    <div className='w-fit h-fit relative'>
                        <input type="text" value={val} id='logger' ref={loggerRef}
                            className={`text-white`}
                            onChange={(e) => setVal(e.target.value)} />
                        <label id='loggerLabel' htmlFor="logger">Enter your awesome name 😉</label>
                    </div>
                    <button disabled={val.length === 0 || !val} className={`${val.length > 0 ? "opacity-100 cursor-pointer" : "opacity-50 pointer-events-none"} w-full h-[50px] mid bg-red-600 rounded-4xl my-5 text-white font-bold `} type="submit" id='loggerButton' form='userNameTaker'>Enter</button>
                </form>
            </div>
            {done && <div className='text-red-800 text-[0.8rem] font-bold'>Please enter a valid name 😠</div>}
        </div>
    )
}

export default LogIn

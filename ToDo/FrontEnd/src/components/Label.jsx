import React, { useRef, useState, useEffect } from 'react'
import './Label.css'

const Label = ({ onAdd }) => {
    const [val, setVal] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const inputBox = useRef(null);


    const handelAdd = (e) => {
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
        <div className='flex items-center gap-5 w-full'>
            {showPopup && <div className='popUp mid'>Data Added</div>}
            <form onSubmit={handelAdd} className={`holder mid ${val.length > 0 ? 'locked' : ''}`} id='inputHolder'>
                <input className='' autoComplete='off'
                    ref={inputBox} placeholder=' ' value={val} type="text" name="todoAddBox" id="todoA" onChange={(e) => setVal(e.target.value)} />
                <label className='cool'
                    htmlFor="todoA">Enter What To Do 😎</label>
            </form>
            <button disabled={val.trim() === ''} type='submit' className={`mid labelButton ${val.trim() ? "opacity-100" : "opacity-50 pointer-events-none"}`} form='inputHolder'><span className='mid labelSpan'>Add</span></button>
        </div>
    )
}

export default Label




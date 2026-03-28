import React from 'react'
import NotFoundSVG from "../assets/imgs/NotFoundSVG.svg"

const NotFound = () => {
    return (
        <div className='font-poppins border p-4 flex flex-col items-center justify-center border-black/20 overflow-hidden relative max-w-[480px] w-full mx-auto h-[100dvh]'>
            <img src={NotFoundSVG} />
            <h4 className='text-2xl mt-3'>Page not found</h4>
        </div>
    )
}

export default NotFound
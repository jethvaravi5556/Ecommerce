import React from 'react'
import {CgClose} from 'react-icons/cg'
const DisplayImage = ({imgurl,onClose}) => {
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center '>
        <div className='bg-white shadow-lg rounded max-w-5xl mx-auto p-4'>
        <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose/>
        </div>
        <div className='flex justify-center p-4'>
        <img src={imgurl} className='w-full h-full' />
    </div>  
        
        </div>
    </div>
  )
}

export default DisplayImage
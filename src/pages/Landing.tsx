import React from 'react';
import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from '../assets/logos/logo.svg';

const Landing = () => {
  return (
    <section>
        {/* NAVBAR */}
        <nav className='flex justify-between max-w-[1236px] m-auto p-3 bg-white' >
            <div className='flex items-center'><Logo aria-label="logo"/></div>
            <div className='flex gap-5 items-center'><Link to='/about' className='text-black text-center text-base font-medium leading-5'>About</Link>
            <button className='text-black text-center text-base font-medium leading-5'>Sign in</button>
            <button className='py-3 px-5 bg-[#DB3E4D] items-center rounded-md border-none text-white text-base leading-5'>Create an account</button>
            </div>
        </nav>
        
        {/* CONTENT */}
        <div className='bg-[#3058A6] h-screen'></div>
    </section>
  )
}

export default Landing
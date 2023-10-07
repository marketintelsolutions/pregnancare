import React from 'react'


const DriverForm = () => {
  return (
    <form className='flex flex-col gap-5'>
        {/* NAME */}
        <div className='flex flex-col gap-2'>
                  <label htmlFor="name" className='text-[#12141D] text-sm font-medium leading-5'>Name</label>
                  <input type="text" name="name" id="name" placeholder='Joseph Jimmy' className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
                   />
                  </div>
                  {/* EMAIL */}
                  <div className='flex flex-col gap-2'>
                  <label htmlFor="email" className='text-[#12141D] text-sm font-medium leading-5'>Enter email address</label>
                  <input type="email" name="email" id="email" placeholder='e.g dayo.abdullahi@gmail.com' className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
                   />
                  </div>
                  
                  {/* DATE OF BIRTH */}
                  <div className='flex flex-col gap-2'>
                  <label htmlFor="dob" className='text-[#12141D] text-sm font-medium leading-5'>Date of birth</label>
                  <input type="date" name="dob" id="dob" placeholder='9/10/1989' className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
                   />
                  </div>
                  {/* L/NO */}
                  <div className='flex flex-col gap-2'>
                  <label htmlFor="lno" className='text-[#12141D] text-sm font-medium leading-5'>L/NO</label>
                  <input type="text" name="lno" id="lno" placeholder='AASU1219SDSJDSD' className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
                   />
                  </div>
                  {/* ADDRESS */}
                  <div className='flex flex-col gap-2'>
                  <label htmlFor="address" className='text-[#12141D] text-sm font-medium leading-5'>Address</label>
                  <input type="number" name="address" id="address" placeholder='Majiro Street' className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
                   />
                  </div>
                  {/* SEX*/}
                  <div className='flex flex-col gap-2'>
                  <label htmlFor="sex" className='text-[#12141D] text-sm font-medium leading-5'>Sex</label>
                  <input type="text" name="sex" id="sex" placeholder='male' className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
                   />
                  </div>
                  {/* EXP DATE */}
                  <div className='flex flex-col gap-2'>
                  <label htmlFor="expdate" className='text-[#12141D] text-sm font-medium leading-5'>Exp date</label>
                  <input type="date" name="expdate" id="expdate" placeholder='exp' className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
                   />
                  </div>
                  {/* GENOTYPE */}
                  <div className='flex flex-col gap-2'>
                  <label htmlFor="genotype" className='text-[#12141D] text-sm font-medium leading-5'>Genotype</label>
                  <input type="text" name="genotype" id="genotype" placeholder='AA' className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
                   />
                  </div>
                  <button 
                  className={`rounded-md bg-[#3058A6] py-3 px-6 text-white text-sm font-medium leading-5 border-[1px] cursor-pointer hover:bg-white hover:border-[#3058A6] hover:text-[#3058A6] transition linear `}
                  >
                  Continue
                  </button>
                </form>
  )
}

export default DriverForm
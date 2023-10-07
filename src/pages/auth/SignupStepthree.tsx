import React from 'react';
import background from '../../assets/images/background.svg'
import {ReactComponent as Logo} from '../../assets/logos/whiteLogo.svg'
import arrowRight from '../../assets/logos/arrowRight.svg'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const SignupStepthree = () => {
    const location = useLocation();
  const selectedOption = location.state?.option;
  console.log(selectedOption);
  

  return (
    <section className='bg-primary-blue min-h-screen bg-no-repeat w-full bg-center bg-contain flex items-center justify-center py-40' style={{'backgroundImage':`url(${background})`}}>
        <aside className='w-[599px] '>
            <div className='py-7 px-14 bg-primary-red flex justify-center rounded-t-lg'><Logo aria-label='logo'/></div>
            <div className='py-10 px-14 bg-white flex flex-col gap-5 rounded-b-lg'>
                <article>
                    <h2 className='text-black text-3xl leading-10 font-medium'>Sign up</h2>
                    <p className='text-[#383838] text-sm leading-10 font-normal'>Let's get you logged</p>
                </article>
                {/* EMAIL */}
                <div className='flex flex-col gap-2'>
                <label htmlFor="email" className='text-[#12141D] text-sm font-medium leading-5'>Enter email address</label>
                <input type="email" name="email" id="email" placeholder='e.g dayo.abdullahi@gmail.com' className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
                 />
                </div>
                {/* FIRSTNAME */}
                <div className='flex flex-col gap-2'>
                <label htmlFor="firstname" className='text-[#12141D] text-sm font-medium leading-5'>Enter firstname</label>
                <input type="text" name="firstname" id="firstname" placeholder='dayo' className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
                 />
                </div>
                {/* AGE */}
                <div className='flex flex-col gap-2'>
                <label htmlFor="age" className='text-[#12141D] text-sm font-medium leading-5'>Age</label>
                <input type="number" name="age" id="age" placeholder='28' className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
                 />
                </div>
                {/* NUMBER OF CHILDREN */}
                <div className='flex flex-col gap-2'>
                <label htmlFor="children" className='text-[#12141D] text-sm font-medium leading-5'>Number of children</label>
                <input type="number" name="children" id="children" placeholder='4' className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
                 />
                </div>
                {/* NUMBER OF PET */}
                <div className='flex flex-col gap-2'>
                <label htmlFor="pet" className='text-[#12141D] text-sm font-medium leading-5'>Number of pet</label>
                <input type="number" name="pet" id="pet" placeholder='1' className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
                 />
                </div>
                {/* NUMBER OF C-SECTION */}
                <div className='flex flex-col gap-2'>
                <label htmlFor="csection" className='text-[#12141D] text-sm font-medium leading-5'>Number of C-section</label>
                <input type="number" name="csection" id="csection" placeholder='2' className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
                 />
                </div>
                {/* BLOOD GROUP */}
                <div className='flex flex-col gap-2'>
                <label htmlFor="bloodGroup" className='text-[#12141D] text-sm font-medium leading-5'>Blood group</label>
                <input type="text" name="bloodGroup" id="bloodGroup" placeholder='A' className={`rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]`}
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
                <p className='text-center text-sm flex justify-center gap-1'>Already have an account? <Link to='/signin' className='text-[#0C4C84]'> Login here</Link> <span><img src={arrowRight} alt="arrow" /></span></p>
            </div>
        </aside>
    </section>
  )
}

export default SignupStepthree
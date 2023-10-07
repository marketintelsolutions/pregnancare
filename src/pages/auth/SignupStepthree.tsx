import React from 'react';
import background from '../../assets/images/background.svg'
import {ReactComponent as Logo} from '../../assets/logos/whiteLogo.svg'
import { Link, useLocation } from 'react-router-dom';
import DriverForm from '../../components/auth/DriverForm';
import HealthcareForm from '../../components/auth/HealthcareForm';
import MotherForm from '../../components/auth/MotherForm';
import arrowRight from '../../assets/logos/arrowRight.svg'

const SignupStepthree = () => {
    const location = useLocation();
  const formtype = location.state?.option;
  // console.log(formtype);

  return (
    <section className='bg-primary-blue min-h-screen bg-no-repeat w-full bg-center bg-contain flex items-center justify-center py-40' style={{'backgroundImage':`url(${background})`}}>
        <aside className='w-[599px] '>
            <div className='py-7 px-14 bg-primary-red flex justify-center rounded-t-lg'><Logo aria-label='logo'/></div>
            <div className='py-10 px-14 bg-white flex flex-col gap-5 rounded-b-lg'>
                <div>
                    <h2 className='text-black text-3xl leading-10 font-medium'>Sign up as a {formtype}</h2>
                    <p className='text-[#383838] text-sm leading-10 font-normal'>Let's get you logged</p>
                </div>
                {formtype==='driver'?<DriverForm/>:formtype==='healthcare provider'?<HealthcareForm/>:<MotherForm/>}
                <p className='text-center text-sm flex justify-center gap-1'>Already have an account? <Link to='/signin' className='text-[#0C4C84]'> Login here</Link> <span><img src={arrowRight} alt="arrow" /></span></p>

            </div>
        </aside>
    </section>
  )
}

export default SignupStepthree
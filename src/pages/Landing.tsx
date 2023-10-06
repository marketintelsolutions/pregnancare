import React from 'react';
import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from '../assets/logos/logo.svg';

const Landing = () => {
  return (
    <section>
        {/* NAVBAR */}
        <nav>
            <div><Logo aria-label="logo"/></div>
            <div><Link to='/about'></Link><button>Sign in</button><button>Create an account</button></div>
        </nav>
        {/* CONTENT */}
        <div></div>
    </section>
  )
}

export default Landing
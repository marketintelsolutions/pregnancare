import React from 'react';
import {Routes, Route} from 'react-router-dom';
import About from './pages/About';
import Landing from './pages/Landing';
import Signin from './pages/auth/Signin';
import Signup from './pages/auth/Signup';
import SignupSteptwo from './pages/auth/SignupSteptwo';

const App = () => {
    return (
        <Routes>
            <Route path='/' element={<Landing/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/signin' element={<Signin/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/signup/step-two' element={<SignupSteptwo/>}/>
        </Routes>
    )
}

export default App
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import About from './pages/About';
import Landing from './pages/Landing';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

const App = () => {
    return (
        <Routes>
            <Route path='/' element={<Landing/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/signin' element={<Signin/>}/>
            <Route path='/signup' element={<Signup/>}/>
        </Routes>
    )
}

export default App
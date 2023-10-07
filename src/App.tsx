import React from 'react';
import {Routes, Route} from 'react-router-dom';
import About from './pages/About';
import Landing from './pages/Landing';
import Signin from './pages/Signin';

const App = () => {
    return (
        <Routes>
            <Route path='/' element={<Landing/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/signin' element={<Signin/>}/>
        </Routes>
    )
}

export default App
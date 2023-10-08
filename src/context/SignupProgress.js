import React, { createContext, useContext, useState } from 'react';

const SignupProgressContext = createContext();

export const useSignupProgress = () => {
    return useContext(SignupProgressContext);
}

export const SignupProgressProvider = ({ children }) => {
    const [step, setStep] = useState(1);  // Assume step 1 is the starting step

    return (
        <SignupProgressContext.Provider value={{ step, setStep }}>
            {children}
        </SignupProgressContext.Provider>
    );
}

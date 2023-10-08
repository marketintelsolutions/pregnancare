import { Route, Navigate } from "react-router-dom";
import { useSignupProgress } from '../../context/SignupProgress';


export const ProtectedRoute = ({ path, step, element }) => {
    const { currentStep } = useSignupProgress(); // Assuming you have a currentStep state in the context

    return (
        <Route
            path={path}
            element={
                currentStep >= step ? element : <Navigate to={`/signup-step-${currentStep}`} />
            }
        />
    );
};

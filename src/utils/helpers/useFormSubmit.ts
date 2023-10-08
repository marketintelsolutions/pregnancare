import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

interface IFormErrors {
  [key: string]: boolean;
}

const useFormSubmit = (initialData: any, postURL: string) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<IFormErrors>({});
  const [isGeneralError, setIsGeneralError] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGeneralError(false);

    // Validate formData against initialData to generate errors
    const newErrors: IFormErrors = {};
    for (const key in initialData) {
      newErrors[key] = !formData[key];
    }
    setErrors(newErrors);

    // Check if any errors exist
    const hasErrors = Object.values(newErrors).some(Boolean);
    setIsGeneralError(Object.values(newErrors).some(Boolean));

    if (!hasErrors) {
      try {
        const response = await axios.post(postURL, formData);
        if (response.status === 200) {
          // Handle success logic here...
          console.log("User saved successfully");
          // Handle success - maybe redirect or update UI
          localStorage.removeItem("step");

          localStorage.setItem("step", "four");
          localStorage.setItem("formData", JSON.stringify(formData));
          setIsGeneralError(false);

          navigate("/signup/step-four", { state: { formData } });
        }
      } catch (error) {
        setIsGeneralError(true);
        error.response
          ? setGeneralError(error.response.data)
          : setGeneralError(`Error connecting to server, ${error.message}`);
      }
    }
  };

  return {
    formData,
    errors,
    isGeneralError,
    generalError,
    handleChange,
    handleSubmit,
  };
};

export default useFormSubmit;

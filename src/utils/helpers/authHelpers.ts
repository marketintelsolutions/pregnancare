// export const checkEmptyField = ()=>{
//      // Check for empty values and update the error state accordingly
//      const newErrors: IFormErrors = {} as IFormErrors;
//      for (const [key, value] of Object.entries(formData)) {
//        newErrors[key] = !value; // true if value is empty, false otherwise
//      }
//      setErrors(newErrors);
// }

// const handleSubmit = async (e: React.FormEvent<HTMLFormElement>,IFormErrors) => {
//     e.preventDefault();
//     // console.log(formData);

//     // Check for empty values and update the error state accordingly
//     const newErrors: IFormErrors = {} as IFormErrors;
//     for (const [key, value] of Object.entries(formData)) {
//       newErrors[key] = !value; // true if value is empty, false otherwise
//     }
//     setErrors(newErrors);

//     // Check if any errors exist and update the general error flag
//     setIsGeneralError(Object.values(newErrors).some(Boolean));

//     // Optionally, only proceed if there are no errors
//     if (!isGeneralError) {
//       // console.log("hello", formData);
//       // Do the form submission logic here
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_BASE_URL}/saveUser`,
//           formData
//         );
//         if (response.status === 200) {
//           console.log("User saved successfully");
//           // Handle success - maybe redirect or update UI
//           // navigate("/signup/verify-email", { state: { mail: formData.email } });
//           localStorage.removeItem("step");

//           localStorage.setItem("step", "four");
//           localStorage.setItem("formData", JSON.stringify(formData));
//           setIsGeneralError(false);

//           navigate("/signup/step-four", { state: { formData } });
//         }
//       } catch (error) {
//         setIsGeneralError(true);
//         error.response
//           ? setGeneralError(error.response.data)
//           : setGeneralError(`error connecting to server, ${error.message}`);
//         console.error("Error saving user:", error);
//         // Handle error - maybe show an error message to the user
//       }
//     }
//   };

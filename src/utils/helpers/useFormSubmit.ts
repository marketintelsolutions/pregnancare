import { useEffect, useState } from "react";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

interface IFormErrors {
  [key: string]: boolean;
}

const useFormSubmit = (initialData: any, postURL: string) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<IFormErrors>({});
  const [isGeneralError, setIsGeneralError] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();
  // console.log(formData);

  const image = formData.image;

  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, `${image?.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);

          switch (snapshot.state) {
            case "paused":
              console.log("upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setFormData((prev) => ({ ...prev, imgUrl: downloadUrl }));
            console.log("upload completed");
          });
        }
      );
    };

    // console.log(formData);

    formData && uploadFile();
  }, [image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      console.log("image is coming");
      console.log(e.target.files[0]);

      setFormData((prevState) => ({
        ...prevState,
        [name]: e.target.files[0],
      }));
      return;
    }
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

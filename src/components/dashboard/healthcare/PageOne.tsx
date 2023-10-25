import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setUsers } from "../../../features/healthcareSlice";
import { RootState } from "../../../store/rootReducer";

const PageOne = () => {
  const users = useSelector((store: RootState) => store.healthcare.users);
  const latestRide = useSelector(
    (store: RootState) => store.healthcare.latestRide
  );

  const dispatch = useDispatch();

  // Use state to manage the checked status of radio inputs
  const [radioStatus, setRadioStatus] = useState({});

  useEffect(() => {
    console.log("there is a new sos");

    // Define the API endpoint to fetch 'pregnant woman' users
    const API_URL = `${process.env.REACT_APP_BASE_URL}/getAllUsers`;

    axios
      .get(API_URL)
      .then((response) => {
        dispatch(setUsers(response.data));
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Initialize radioStatus with SOS values from the fetched users
    const initialRadioStatus = {};
    users.forEach((user) => {
      initialRadioStatus[user.id] = user.sos;
      // handleRadioChange(user.id);
    });
    setRadioStatus(initialRadioStatus);
  }, [users]);

  const handleRadioChange = (userId) => {
    setRadioStatus((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId], // Toggle the status
    }));
  };

  useEffect(() => {
    console.log(radioStatus); // Log the updated radioStatus when it changes
  }, [radioStatus]);

  return (
    <div>
      <table className="flex flex-col my-8 text-center text-base">
        <thead>
          <tr className="grid grid-cols-7 ">
            <th className="border p-4">S/N</th>
            <th className="border p-4">Name</th>
            <th className="border p-4">Age</th>
            <th className="border p-4">Genotype</th>
            <th className="border p-4">Number of CS</th>
            <th className="border p-4">Number of Children</th>
            <th className="border p-4">Alert Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((data, index) => {
            const {
              id,
              firstname,
              age,
              genotype,
              csection,
              children,
              sos,
            } = data;
            return (
              <tr key={index} className="grid grid-cols-7">
                <td className="border p-4">{index + 1}</td>
                <td className="border p-4">
                  <Link to={`/dashboard/healthcare-provider/${id}`}>
                    {firstname}
                  </Link>
                </td>
                <td className="border p-4">{age}</td>
                <td className="border p-4">{genotype}</td>
                <td className="border p-4">{csection}</td>
                <td className="border p-4">{children}</td>
                <td className="border p-4">
                  <input
                    type="radio"
                    checked={radioStatus[id]}
                    onChange={() => handleRadioChange(id)} // Update the status
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default PageOne;

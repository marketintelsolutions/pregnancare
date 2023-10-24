import axios from "axios";
import React, { useEffect, useState } from "react";

const PageOne = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Define the API endpoint to fetch 'pregnant woman' users
    const API_URL = `${process.env.REACT_APP_BASE_URL}/getAllUsers`;

    axios
      .get(API_URL)
      .then((response) => {
        setUsers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <section className="px-14 py-12">
      <div className="text-primarytext">
        <h1 className="text-4xl font-bold">
          Hello. <span className="font-normal"> Dayo!</span>
        </h1>
        <p className="text-xl mt-2 opacity-80">Good Morning</p>
      </div>
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
                  <td className="border p-4">{firstname}</td>
                  <td className="border p-4">{age}</td>
                  <td className="border p-4">{genotype}</td>
                  <td className="border p-4">{csection}</td>
                  <td className="border p-4">{children}</td>
                  <td className="border p-4">
                    <input type="radio" checked={sos} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
export default PageOne;

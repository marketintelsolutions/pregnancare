import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSelectedHospitalCoordinates } from "../features/userSlice";

const API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const LocationSearch = ({ fetchNearbyDrivers }) => {
  const [address, setAddress] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const setSelectedHospital = (coordinates) => {
    // console.log(coordinates);

    dispatch(setSelectedHospitalCoordinates(coordinates));
    fetchNearbyDrivers(coordinates);
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${API_KEY}`
        );

        const { results, status } = response.data;

        if (status === "OK") {
          setResults(results);
        } else {
          setResults([]);
          // Handle other statuses (ZERO_RESULTS, OVER_QUERY_LIMIT, etc.)
          console.log(`Error: ${status}`);
        }

        setLoading(false);
      } catch (error) {
        // Handle errors
        console.error("Error fetching results", error);
        setLoading(false);
      }
    };

    // Only trigger the API request if the address is not empty
    if (address.trim() !== "") {
      fetchResults();
    } else {
      setResults([]);
    }
  }, [address]);

  return (
    <div className="absolute z-[99] bg-[rgba(255,255,255,0.7)] top-0 left-0 h-full w-full flex justify-center items-center flex-col gap-5">
      <div
        className={` bg-white z-30 flex items-center w-[513px] h-[413px] rounded-[42px] p-12`}
      >
        <div className="text-black w-full flex flex-col gap-3">
          <input
            type="text"
            placeholder="Enter location"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="py-4 px-7 rounded-md border"
          />
          {results.length > 0 && (
            <>
              {loading && <p>Loading...</p>}

              <h3>Results:</h3>
              <ul>
                {results.map((result) => (
                  <li
                    className="py-4 px-7 rounded-md border  hover:border-gray-300 hover:bg-[#f3f2f2] transition cursor-pointer"
                    key={result.place_id}
                    onClick={() =>
                      setSelectedHospital(result.geometry.location)
                    }
                  >
                    {result.formatted_address}
                  </li>
                ))}
              </ul>
            </>
          )}
          <button
            className="w-full border border-[#3058A6] py-4 px-7 bg-[#3058A6] rounded-md text-white font-medium text-sm cursor-pointer hover:bg-white hover:text-[#3058A6] transition linear"
            onClick={fetchNearbyDrivers}
          >
            Use a nearby healthcare facility
          </button>
        </div>
      </div>
      <button
        className="w-fit border border-[#3058A6] py-4 px-10 bg-[#3058A6] rounded-md text-white font-medium text-sm cursor-pointer hover:bg-white hover:text-[#3058A6] transition linear"
        onClick={fetchNearbyDrivers}
      >
        Close
      </button>
    </div>
  );
};

export default LocationSearch;

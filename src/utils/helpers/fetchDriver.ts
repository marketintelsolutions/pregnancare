import axios from "axios";
import { setDriver, setRide } from "../../features/driverSlice";

export const fetchDriverDetails = (dispatch) => {
  const user = JSON.parse(localStorage.getItem("driver"));

  user &&
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/getDriverDetails`, user)
      .then((response) => {
        console.log("getting driver details");
        // console.log(response.data.ride);
        // localStorage.setItem("ride", JSON.stringify(response.data.ride));

        // dispatch(setDriver(response.data.driver));
        dispatch(setRide(response.data.ride));
      })
      .catch((err) => {
        console.error("Error fetching driver details:", err);
      });
};

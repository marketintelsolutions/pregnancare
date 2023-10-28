import React, { useEffect } from "react";
import sosImage from "../../../assets/images/sos.png";
import Map from "../Map";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { useDispatch } from "react-redux";
import { fetchDriverDetails } from "../../../utils/helpers/fetchDriver";
import dangerCircle from "../../../assets/logos/dangerCircle.svg";
import {
  acceptRide,
  driverButtons,
  handleRejectRide,
} from "../../../utils/dashboardHelpers/driverDashboardHelpers";
import ActionButton from "./ActionButton";
import { setMessage } from "../../../features/driverSlice";

const DashboardDriver = () => {
  const driverDetails = useSelector((state: RootState) => state.driver.driver);
  const ride = useSelector((state: RootState) => state.driver.ride);
  const sos = useSelector((state: RootState) => state.driver.sos);
  const message = useSelector((state: RootState) => state.driver.message);
  // const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const buttonMode = useSelector((state: RootState) => state.driver.buttonMode);

  const user = JSON.parse(localStorage.getItem("driver"));

  useEffect(() => {
    let message =
      ride?.status === "new"
        ? "Accept pick up request"
        : ride?.status === "accepted"
        ? "ride accepted"
        : "No pick up request";
    dispatch(setMessage(message));
  }, [ride]);

  useEffect(() => {
    // if (driverDetails.sos && (ride === null || ride?.rideId)) return;
    console.log("new ride gotten");

    console.log(sos);

    fetchDriverDetails(dispatch);
  }, [sos]);

  return (
    <div className="flex items-center flex-col">
      <section className="px-14 py-12">
        <div className="text-primarytext">
          <h1 className="text-4xl font-bold">
            Hello. <span className="font-normal"> {user.name}</span>
          </h1>
          <p className="text-xl mt-2 opacity-80">Good Morning</p>
        </div>

        <div className="flex mt-10 items-center">
          {/* SOS */}
          <div
            className={`${
              ride?.status === "new" ? "bg-green-500" : "bg-blue-800"
            } text-center z-20 w-[413px] h-[413px] rounded-[42px] flex items-center justify-center cursor-pointer`}
            onClick={async () => {
              // if (message === "ride accepted") return;
              await acceptRide(driverDetails, dispatch, ride);
              dispatch(setMessage("ride accepted"));
            }}
          >
            <div className="text-white mx-auto max-w-[193px]">
              <img src={sosImage} alt="sos" className="mx-auto mb-2" />
              <p className="italic uppercase text-4xl mb-2"> sos</p>
              <p className="font-normal text-lg">{message}</p>
            </div>
          </div>
          <Map user={user} />
        </div>
      </section>

      {message === "ride accepted" && (
        <p className="flex gap-2 items-center mx-auto mb-5">
          <img src={dangerCircle} alt="dangerCircle" />
          {ride?.duration} away from pickup point
        </p>
      )}

      <ActionButton
        ride={ride}
        driverDetails={driverDetails}
        {...driverButtons[buttonMode]}
        dispatch={dispatch}
      />
    </div>
  );
};
export default DashboardDriver;

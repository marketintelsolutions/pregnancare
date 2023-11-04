const axios = require("axios").default;

calculateDistance = async ({ lat, lon, dest_lat, dest_lon }) => {
    try {

        let callingJson = await axios(
            `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${lat},${lon}&destinations=${dest_lat},${dest_lon}&key=${process.env.GOOGLE_MAP_API_KEY}`
        );

        console.log("time calculated successfully");
        console.log(callingJson.data, "time from source");

        return callingJson.data.rows[0].elements[0];
    } catch (e) {
        console.log("there was an error calculating the time");
        return "0 mins";
    }
};

module.exports = calculateDistance;
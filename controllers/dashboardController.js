const db = require("../auth/firebase");
const { haversineDistance } = require("../middleware/dashboardMiddleware");

exports.saveLocation = async (req, res) => {
    console.log('request made');

    const { user, coordinates, address } = req.body;

    try {
        const usersRef = db.collection('users');
        const userSnapshot = await usersRef.where('email', '==', user.email).get();

        if (userSnapshot.empty) {
            // User doesn't exist, return an error
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // User exists, update the coordinates and address
        const userId = userSnapshot.docs[0].id;
        await usersRef.doc(userId).update({
            coordinates: {
                lat: coordinates.lat,
                lng: coordinates.lng
            },
            address: address
        });

        // Fetch updated user data
        const updatedUserDoc = await usersRef.doc(userId).get();
        const userData = updatedUserDoc.data();

        console.log('Location data saved');
        res.status(200).json({ success: true, user: userData });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Error saving location data.' });
    }
}

exports.getNearbyDrivers = async (req, res) => {
    const { userType, coordinates } = req.body;

    if (userType !== 'pregnant woman') {
        return res.status(400).json({ success: false, message: 'Invalid user type.' });
    }

    try {
        const usersRef = db.collection('users');
        const driverSnapshot = await usersRef.where('userType', '==', 'driver').get();

        let nearbyDrivers = [];

        driverSnapshot.forEach(doc => {
            const driverData = doc.data();
            const driverCoords = driverData.coordinates;

            // Check if the driver is within 15 km using the haversine formula
            const distance = haversineDistance(coordinates, driverCoords);

            if (distance <= 15) {
                nearbyDrivers.push(driverData);
            }
        });

        console.log('Nearby Drivers:', nearbyDrivers);
        res.status(200).json({ success: true, drivers: nearbyDrivers });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Error fetching driver coordinates.' });
    }
}

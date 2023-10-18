const db = require("../auth/firebase");
const admin = require('firebase-admin');
const { haversineDistance, generateId } = require("../middleware/dashboardMiddleware");
const calculateDistance = require('../middleware/calculateDistance')

exports.saveLocation = async (req, res) => {
    console.log('request made');

    const { user, coordinates, address } = req.body;

    // console.log(req.body);

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
    const { user, coordinates } = req.body;
    const { userType, email } = user
    const io = req.io;

    if (userType !== 'pregnant woman') {
        return res.status(400).json({ success: false, message: 'Invalid user type.' });
    }

    try {
        const usersRef = db.collection('users');
        const driverSnapshot = await usersRef.where('userType', '==', 'driver').get();

        const motherSnapshot = await usersRef.where('email', '==', email).get();

        if (motherSnapshot.empty) {
            return res.status(404).json({ success: false, message: 'Mother not found.' });
        }

        let nearbyDrivers = [];
        let updatePromises = [];  // Store promises for updating the Firestore

        driverSnapshot.forEach(doc => {
            const driverData = doc.data();
            const driverCoords = driverData.coordinates;

            // Check if the driver is within 15 km using the haversine formula
            const distance = haversineDistance(coordinates, driverCoords);

            if (distance <= 15) {
                // Save updated data back to Firestore and add the promise to our array
                const updatePromise = usersRef.doc(doc.id).update({ patientCoordinates: coordinates });
                updatePromises.push(updatePromise);

                nearbyDrivers.push(driverData);
            }
        });

        // Wait for all Firestore updates to complete
        await Promise.all(updatePromises);

        // Create a new ride document with the patient's details, drivers and status
        const ridesRef = db.collection('rides');

        const rideDetails = {
            rideId: generateId(),
            patient: {
                // email: req.user.email,  // Adjust as necessary if this isn't where the email is located
                ...user,
                coordinates
            },
            drivers: nearbyDrivers,
            status: 'new'
        };
        // EMIT TO SOCKET
        io.emit('updateDrivers', nearbyDrivers);


        const newRide = await ridesRef.add(rideDetails);

        await usersRef.doc(motherSnapshot.docs[0].id).update({ sos: true, sosRideId: rideDetails.rideId, ride: rideDetails })

        // updated mother details
        // const updatedMotherSnapshot = await usersRef.where('email', '==', email).get();
        // const updatedMotherData = updatedMotherSnapshot.data();

        const updatedMotherData = motherSnapshot.docs[0].data();

        console.log('Nearby Drivers:', nearbyDrivers);
        res.status(200).json({ success: true, drivers: nearbyDrivers, ride: rideDetails, user: updatedMotherData });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Error fetching or updating driver coordinates.' });
    }
}

exports.getDriverDetails = async (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    try {
        const usersRef = db.collection('users');
        const driverSnapshot = await usersRef.where('email', '==', email).get();

        if (driverSnapshot.empty) {
            return res.status(404).json({ success: false, message: 'Driver not found.' });
        }

        // Reference to the rides collection
        const ridesRef = db.collection('rides');

        // Fetch all the rides
        const ridesSnapshot = await ridesRef.get();

        let isDriverInRide = false;
        let matchedRide = null;

        // Iterate over each ride to check if the driver's email is present in the drivers array
        ridesSnapshot.forEach(rideDoc => {
            const rideData = rideDoc.data();
            const driversArray = rideData.drivers || [];

            driversArray.forEach(driver => {
                if (driver.email === email && !isDriverInRide) { // Ensure to check the matched ride only once
                    isDriverInRide = true;
                    matchedRide = rideData;
                }
            });
        });

        // If the driver is found in any ride's drivers array, update sos to true
        if (isDriverInRide) {
            await usersRef.doc(driverSnapshot.docs[0].id).update({ sos: true });
        }

        const driverData = driverSnapshot.docs[0].data();

        // Return both the driver details and the matched ride
        return res.status(200).json({ success: true, driver: driverData, ride: matchedRide });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Error fetching driver details.' });
    }
}


exports.saveToken = async (req, res) => {
    const { token, email } = req.body;

    try {
        // const userRef = db.collection('users').doc(email);
        // await userRef.set({ fcmToken: token }, { merge: true });
        const usersRef = db.collection('users');
        const userSnapshot = await usersRef.where('email', '==', email).get();

        if (userSnapshot.empty) {
            // User doesn't exist, return an error
            return res.status(404).json({ success: false, message: 'User not found.' });
        }



        // Update the driver's data with the new FCM token
        // await userRef.update({ fcmToken: token });
        const userId = userSnapshot.docs[0].id;
        await usersRef.doc(userId).update({
            fcmToken: token
        });

        res.send({ success: true, message: 'Token stored successfully!' });
    } catch (error) {
        console.error("Error storing token:", error);
        res.status(500).send({ success: false, message: 'Error storing token.' });
    }
}

exports.acceptRide = async (req, res) => {
    const { rideId, driverDetails } = req.body;
    const io = req.io

    if (!rideId || !driverDetails) {
        return res.status(400).json({ success: false, message: 'Ride ID and driver details are required.' });
    }

    try {
        const ridesRef = db.collection('rides');
        const rideSnapshot = await ridesRef.where('rideId', '==', rideId).get();
        const id = rideSnapshot.docs[0].id;
        const rideDoc = ridesRef.doc(id);

        if (rideSnapshot.empty) {
            console.log('ride not found');
            return res.status(404).json({ success: false, message: 'Ride not found.' });
        }

        // Make the necessary updates to the ride
        await rideDoc.update({
            drivers: [],
            assignedDriver: driverDetails,
            status: 'accepted'
        });

        // Get the updated data using get
        let updatedRideSnapshot = await rideDoc.get();
        let updatedRide = updatedRideSnapshot.data();

        console.log(updatedRide);

        const driverCoord = updatedRide.assignedDriver.coordinates
        const patientCoord = updatedRide.patient.coordinates

        console.log('Calculating distance and time...');

        // Calculate distance and time using the calculateDistance function
        const distanceAndTime = await calculateDistance({
            lat: driverCoord.lat,
            lon: driverCoord.lng,
            dest_lat: patientCoord.lat,
            dest_lon: patientCoord.lng
        });

        console.log('Distance and Time:', distanceAndTime);

        // Update the ride with distance and time information
        await rideDoc.update({
            distance: distanceAndTime.distance.text,
            duration: distanceAndTime.duration.text
        });

        // // get latest details
        updatedRideSnapshot = await rideDoc.get();
        updatedRide = updatedRideSnapshot.data();

        console.log('Ride updated with distance and time');
        io.emit('acceptRide', { message: 'ride accepted', ride: updatedRide });


        res.status(200).json({ success: true, message: 'Ride accepted successfully!' });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Error updating ride details.' });
    }
}

exports.getUserDetails = async (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    try {
        const usersRef = db.collection('users');
        const userSnapshot = await usersRef.where('email', '==', email).get();

        if (userSnapshot.empty) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const userData = userSnapshot.docs[0].data();

        // Return user details
        return res.status(200).json({ success: true, user: userData });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Error fetching driver details.' });
    }
}

exports.getUserRideDetails = async (req, res) => {
    const { rideId } = req.body;
    console.log(rideId);

    // if (!email) {
    //     return res.status(400).json({ success: false, message: 'Email is required.' });
    // }

    try {
        const ridesRef = db.collection('rides');
        const rideSnapshot = await ridesRef.where('rideId', '==', rideId).get();

        if (rideSnapshot.empty) {
            return res.status(404).json({ success: false, message: 'Ride not found.' });
        }

        const rideData = rideSnapshot.docs[0].data();

        // Return user details
        return res.status(200).json({ success: true, ride: rideData });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Error fetching ride details.' });
    }
}

exports.rejectRide = async (req, res) => {
    const { rideId, driverEmail } = req.body;

    if (!rideId || !driverEmail) {
        return res.status(400).json({ success: false, message: 'Ride ID and driver email are required.' });
    }

    try {
        // Update the driver's SOS status
        const driverRef = db.collection('users').where('email', '==', driverEmail);
        const driverSnapshot = await driverRef.get();

        if (driverSnapshot.empty) {
            return res.status(404).json({ success: false, message: 'Driver not found.' });
        }

        const driverDoc = driverSnapshot.docs[0];
        await driverDoc.ref.update({ sos: false });

        const ridesRef = db.collection('rides');
        const rideSnapshot = await ridesRef.where('rideId', '==', rideId).get();
        const id = rideSnapshot.docs[0].id;
        const rideRef = ridesRef.doc(id);

        if (rideSnapshot.empty) {
            return res.status(404).json({ success: false, message: 'Ride not found.' });
        }

        const rideData = rideSnapshot.docs[0].data();

        const drivers = rideData.drivers;

        // Find the driver in the drivers array using email
        const updatedDriversArray = drivers.filter(driver => driver.email !== driverEmail);

        // Update the ride's status to 'declined' and drivers array
        await rideRef.update({
            status: 'declined',
            drivers: updatedDriversArray,
        });

        return res.status(200).json({ success: true, message: 'Ride rejected successfully.' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Error rejecting ride.' });
    }
};
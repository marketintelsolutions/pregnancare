const db = require("../auth/firebase");
const admin = require('firebase-admin');
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
        let updatePromises = [];  // Store promises for updating the Firestore

        driverSnapshot.forEach(doc => {
            const driverData = doc.data();
            const driverCoords = driverData.coordinates;

            // Check if the driver is within 15 km using the haversine formula
            const distance = haversineDistance(coordinates, driverCoords);

            if (distance <= 15) {
                // Add sos: true to the driver's data
                driverData.sos = true;

                // Save updated data back to Firestore and add the promise to our array
                const updatePromise = usersRef.doc(doc.id).update({ sos: true });
                updatePromises.push(updatePromise);

                nearbyDrivers.push(driverData);
            }
        });

        // Wait for all Firestore updates to complete
        await Promise.all(updatePromises);

        const fcmTokens = nearbyDrivers.map(driver => driver.fcmToken).filter(Boolean); // Ensure there's no undefined tokens
        console.log('fcmTokens', fcmTokens);
        if (fcmTokens.length > 0) {
            const message = {
                notification: {
                    title: 'Pick Up Request',
                    body: 'A pregnant woman needs assistance. Check your app!',
                },
                tokens: fcmTokens,
            };

            // Send a message to the device corresponding to the provided
            // registration tokens.
            console.log('sending message');
            await admin.messaging().sendMulticast(message);
        }

        console.log('Nearby Drivers:', nearbyDrivers);
        res.status(200).json({ success: true, drivers: nearbyDrivers });

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

        const driverData = driverSnapshot.docs[0].data();
        return res.status(200).json({ success: true, driver: driverData });
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
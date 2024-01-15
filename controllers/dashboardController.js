const db = require("../auth/firebase");
const admin = require('firebase-admin');
const { haversineDistance, generateId, getClosestHospital, } = require("../middleware/dashboardMiddleware");
const calculateDistance = require('../middleware/calculateDistance')
const axios = require('axios');
const { connection, withTransaction, executeQuery } = require('../database/db');

// exports.saveLocation = async (req, res) => {
//     console.log('request made');

//     const { user, coordinates, address } = req.body;

//     try {
//         const usersRef = db.collection('users');
//         const userSnapshot = await usersRef.where('email', '==', user.email).get();

//         if (userSnapshot.empty) {
//             // User doesn't exist, return an error
//             return res.status(404).json({ success: false, message: 'User not found.' });
//         }

//         // User exists, update the coordinates and address
//         const userId = userSnapshot.docs[0].id;
//         await usersRef.doc(userId).update({
//             coordinates: {
//                 lat: coordinates.lat,
//                 lng: coordinates.lng
//             },
//             address: address
//         });

//         // Fetch updated user data
//         const updatedUserDoc = await usersRef.doc(userId).get();
//         const userData = updatedUserDoc.data();

//         console.log('Location data saved');
//         res.status(200).json({ success: true, user: userData });

//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ success: false, message: 'Error saving location data.' });
//     }
// }
exports.saveLocation = async (req, res) => {
    console.log('request made');
    const { user, coordinates, address } = req.body;
    console.log(coordinates);

    try {
        // Check if the user exists in the MySQL database
        const selectUserQuery = 'SELECT * FROM users WHERE email = ?';
        await connection.query(selectUserQuery, [user.email], async (error, results) => {
            if (error) {
                console.log(error);
                return
            } else {
                if (results.length === 0) {
                    // User doesn't exist, return an error

                    return res.status(404).json({ success: false, message: 'User not found.' });
                }

                // User exists, update the coordinates and address
                const userId = results[0].id;
                const updateLocationQuery = 'UPDATE users SET coordinates_lat = ?, coordinates_lng = ?, address = ?, coordinates = ? WHERE id = ?';
                await connection.query(updateLocationQuery, [coordinates.lat, coordinates.lng, address, JSON.stringify(coordinates), userId]);

                // Fetch updated user data
                const selectUpdatedUserQuery = 'SELECT * FROM users WHERE id = ?';
                await connection.query(selectUpdatedUserQuery, [userId], (error, results) => {
                    if (error) {
                        console.log(error);
                        return
                    } else {
                        const userData = results[0];

                        console.log('Location data saved');
                        res.status(200).json({ success: true, user: userData });
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Error saving location data.' });
    }
};


// exports.getNearbyDrivers = async (req, res) => {
//     const { user, coordinates, selectedHospital } = req.body;
//     const { userType, email } = user
//     const io = req.io;

//     console.log(user, coordinates);

//     if (userType !== 'pregnant woman') {
//         return res.status(400).json({ success: false, message: 'Invalid user type.' });
//     }

//     try {
//         const usersRef = db.collection('users');
//         const driverSnapshot = await usersRef.where('userType', '==', 'driver').get();

//         const motherSnapshot = await usersRef.where('email', '==', email).get();
//         const motherId = motherSnapshot.docs[0].id
//         const motherRef = usersRef.doc(motherId)

//         if (motherSnapshot.empty) {
//             return res.status(404).json({ success: false, message: 'Mother not found.' });
//         }

//         let nearbyDrivers = [];
//         let updatePromises = [];  // Store promises for updating the Firestore

//         driverSnapshot.forEach(doc => {
//             const driverData = doc.data();
//             const driverCoords = driverData.coordinates;

//             // Check if the driver is within 15 km using the haversine formula
//             const distance = haversineDistance(coordinates, driverCoords);
//             console.log('mother coordinates', coordinates);
//             console.log('driver coords', driverCoords);
//             console.log('distance', distance);

//             if (distance <= 15) {
//                 // Save updated data back to Firestore and add the promise to our array
//                 const updatePromise = usersRef.doc(doc.id).update({ patientCoordinates: coordinates });
//                 updatePromises.push(updatePromise);

//                 nearbyDrivers.push(driverData);
//             }
//         });

//         // Wait for all Firestore updates to complete
//         await Promise.all(updatePromises);

//         // Create a new ride document with the patient's details, drivers and status
//         const ridesRef = db.collection('rides');

//         let rideDetails
//         console.log(selectedHospital);
//         if (selectedHospital) {
//             console.log('hello there is a selected hospital');
//             rideDetails = {
//                 rideId: generateId(),
//                 patient: {
//                     email,
//                     // ...user,
//                     coordinates,
//                     selectedHospital
//                 },
//                 drivers: nearbyDrivers,
//                 status: 'new'
//             };
//         } else {
//             console.log('hello there is a no selected hospital');
//             rideDetails = {
//                 rideId: generateId(),
//                 patient: {
//                     email,
//                     // ...user,
//                     coordinates,
//                 },
//                 drivers: nearbyDrivers,
//                 status: 'new'
//             };
//         }


//         console.log('updateDrivers', { nearbyDrivers, rideDetails });

//         // EMIT TO SOCKET (ALERT NEARBY DRIVERS)
//         io.emit('updateDrivers', { nearbyDrivers, rideDetails });

//         await ridesRef.add(rideDetails);

//         if (selectedHospital) {
//             await motherRef.update({ sos: true, sosRideId: rideDetails.rideId, selectedHospital })
//         } else {
//             await motherRef.update({ sos: true, sosRideId: rideDetails.rideId })
//         }

//         const updatedMotherData = motherSnapshot.docs[0].data();

//         console.log('Nearby Drivers:', nearbyDrivers);
//         // console.log('nearby drivers sent');

//         // GET ALL USERS AND ALERT HOSPITALS

//         try {
//             const snapshot = await usersRef.where('userType', '==', 'pregnant woman').get();
//             const pregnantWomanUsers = [];

//             snapshot.forEach(doc => {
//                 // Include the document ID in the data
//                 pregnantWomanUsers.push({
//                     id: doc.id,
//                     ...doc.data(),
//                 });
//             });

//             // EMIT TO SOCKET (ALERT HOSPITALS)
//             io.emit('newSos', { rideDetails, pregnantWomanUsers })
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             res.status(500).json({ error: 'Internal server error' });
//         }

//         res.status(200).json({ success: true, drivers: nearbyDrivers, ride: rideDetails, user: updatedMotherData });

//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ success: false, message: 'Error fetching or updating driver coordinates.' });
//     }
// }
exports.getNearbyDrivers = async (req, res) => {
    const { user, coordinates, selectedHospital } = req.body;
    const { userType, email } = user;
    const io = req.io;

    if (userType !== 'pregnant woman') {
        return res.status(400).json({ success: false, message: 'Invalid user type.' });
    }

    try {
        // Check if the user exists in the MySQL database
        const selectMotherQuery = 'SELECT * FROM users WHERE email = ?';
        await connection.query(selectMotherQuery, [email], async (error, motherResults) => {
            if (error) {
                console.log(error);
                return res.status(404).json({ success: false, message: error.message })
            } else {
                if (motherResults.length === 0) {
                    return res.status(404).json({ success: false, message: 'Mother not found.' });
                }

                const motherId = motherResults[0].id;

                // Fetch all nearby drivers within 15 km
                const selectDriversQuery = 'SELECT * FROM users WHERE userType = "driver"';
                await connection.query(selectDriversQuery, async (error, driverResults) => {
                    if (error) {
                        console.log(error);
                        return
                    } else {
                        let nearbyDrivers = [];
                        let updatePromises = [];  // Store promises for updating MySQL

                        for (const driverData of driverResults) {
                            const driverCoords = {
                                lat: driverData.coordinates_lat,
                                lng: driverData.coordinates_lng
                            }

                            const modifiedDriverData = JSON.parse(JSON.stringify(driverData))

                            // Check if the driver is within 15 km using the haversine formula
                            const distance = haversineDistance(coordinates, driverCoords);

                            if (distance <= 15) {
                                // Save updated data back to MySQL and add the promise to our array
                                const updatePromise = connection.query('UPDATE users SET patientCoordinates = ?, coordinates=? WHERE id = ?', [JSON.stringify(coordinates), JSON.stringify(driverCoords), driverData.id]);
                                updatePromises.push(updatePromise);

                                nearbyDrivers.push(modifiedDriverData);
                            }
                        }

                        // Wait for all MySQL updates to complete
                        await Promise.all(updatePromises);

                        // Create a new ride document with the patient's details, drivers, and status
                        const insertRideQuery = 'INSERT INTO rides (rideId, patient, drivers, status) VALUES (?, ?, ?, ?)';
                        const rideId = generateId();

                        console.log('nearbyDrivers', nearbyDrivers);

                        const rideDetails = selectedHospital ? {
                            rideId: generateId(),
                            patient: {
                                email,
                                coordinates,
                                selectedHospital
                            },
                            drivers: nearbyDrivers,
                            status: 'new'
                        } : {
                            rideId: generateId(),
                            patient: {
                                email,
                                coordinates,
                            },
                            drivers: nearbyDrivers,
                            status: 'new'
                        }

                        const { patient, drivers, status } = rideDetails

                        // EMIT TO SOCKET (ALERT NEARBY DRIVERS)
                        io.emit('updateDrivers', { nearbyDrivers, rideDetails });

                        await connection.query(insertRideQuery, [rideId, JSON.stringify({ ...patient }), JSON.stringify([...drivers]), status]);

                        // Update mother's SOS status and SOS ride ID in MySQL
                        const updateMotherQuery = selectedHospital
                            ? 'UPDATE users SET sos = true, sosRideId = ?, selectedHospital = ? WHERE id = ?'
                            : 'UPDATE users SET sos = true, sosRideId = ? WHERE id = ?';

                        const updateMotherParams = selectedHospital ? [rideId, selectedHospital, motherId] : [rideId, motherId];
                        await connection.query(updateMotherQuery, updateMotherParams);

                        // Fetch updated mother data from MySQL
                        const selectUpdatedMotherQuery = 'SELECT * FROM users WHERE id = ?';
                        await connection.query(selectUpdatedMotherQuery, [motherId], async (error, updatedMotherResults) => {
                            if (error) {
                                console.log(error);
                                return
                            } else {
                                const updatedMotherData = updatedMotherResults[0];

                                console.log('Nearby Drivers:', nearbyDrivers);

                                // GET ALL USERS AND ALERT HOSPITALS
                                try {
                                    const selectPregnantWomenQuery = 'SELECT * FROM users WHERE userType = "pregnant woman"';
                                    await connection.query(selectPregnantWomenQuery, (error, pregnantWomanResults) => {
                                        if (error) {
                                            console.log(error);
                                            return
                                        } else {
                                            // EMIT TO SOCKET (ALERT HOSPITALS)
                                            io.emit('newSos', { rideDetails, pregnantWomanUsers: pregnantWomanResults });
                                        }
                                    });
                                } catch (error) {
                                    console.error('Error fetching data:', error);
                                    res.status(500).json({ error: 'Internal server error' });
                                }

                                console.log('rideDetails', rideDetails);

                                res.status(200).json({ success: true, drivers: nearbyDrivers, ride: rideDetails, user: updatedMotherData });
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Error fetching or updating driver coordinates.' });
    }
};

// exports.getDriverDetails = async (req, res) => {
//     const email = req.body.email;

//     if (!email) {
//         return res.status(400).json({ success: false, message: 'Email is required.' });
//     }

//     try {
//         const usersRef = db.collection('users');
//         const driverSnapshot = await usersRef.where('email', '==', email).get();

//         if (driverSnapshot.empty) {
//             return res.status(404).json({ success: false, message: 'Driver not found.' });
//         }

//         // Reference to the rides collection
//         const ridesRef = db.collection('rides');

//         // Fetch all the rides
//         const ridesSnapshot = await ridesRef.get();

//         let isDriverInRide = false;
//         let matchedRide = null;

//         // Iterate over each ride to check if the driver's email is present in the drivers array
//         ridesSnapshot.forEach(rideDoc => {
//             const rideData = rideDoc.data();
//             const driversArray = rideData.drivers || [];

//             if (driversArray.length > 0) {

//                 driversArray.forEach(driver => {
//                     if (driver.email === email && !isDriverInRide) {
//                         // Ensure to check the matched ride only once
//                         isDriverInRide = true;
//                         matchedRide = rideData;
//                         // return
//                     }
//                     // if(driver.assignedDriver.email === email)
//                 });
//             }
//             else if (rideData.assignedDriver) {
//                 // check if the ride has not being completed
//                 if (rideData.status !== 'completed') {
//                     console.log('there is an assigned driver');
//                     isDriverInRide = true;
//                     matchedRide = rideData;
//                 }
//             }


//         });

//         // If the driver is found in any ride's drivers array, update sos to true
//         if (isDriverInRide) {
//             await usersRef.doc(driverSnapshot.docs[0].id).update({ sos: true });
//         }

//         const driverData = driverSnapshot.docs[0].data();

//         // Return both the driver details and the matched ride
//         return res.status(200).json({ success: true, driver: driverData, ride: matchedRide });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ success: false, message: 'Error fetching driver details.' });
//     }
// }
exports.getDriverDetails = async (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    try {
        // Query to get driver details by email
        const selectDriverQuery = 'SELECT * FROM users WHERE email = ?';
        await connection.query(selectDriverQuery, [email], async (error, driverResults) => {
            if (error) {
                console.log(error);
                return res.status(404).json({ success: false, message: error.message });
            }

            if (driverResults.length === 0) {
                return res.status(404).json({ success: false, message: 'Driver not found.' });
            }

            // Reference to the rides table
            const ridesRef = 'rides'; // Replace with your actual table name

            // Fetch all the rides
            const selectRidesQuery = 'SELECT * FROM ??';
            await connection.query(selectRidesQuery, [ridesRef], async (error, ridesResults) => {

                if (error) {
                    console.log(error);
                    res.status(400).json({ success: false, message: error.message });
                }

                let isDriverInRide = false;
                let matchedRide = null;

                console.log(ridesResults);

                // Iterate over each ride to check if the driver's email is present in the drivers array
                ridesResults.forEach(ride => {
                    const rideData = ride;

                    // console.log(typeof rideData.drivers);
                    let { drivers } = rideData

                    drivers = JSON.parse(drivers)

                    if (drivers) {
                        drivers.forEach(driver => {
                            if (driver.email === email && !isDriverInRide) {
                                isDriverInRide = true;
                                matchedRide = rideData;
                            }
                        });
                    } else if (rideData.assignedDriver) {
                        if (rideData.status !== 'completed') {
                            isDriverInRide = true;
                            matchedRide = rideData;
                        }
                    }
                });

                // If the driver is found in any ride's drivers array, update sos to true
                if (isDriverInRide) {
                    await connection.query('UPDATE users SET sos = true WHERE email = ?', [email]);
                }

                const driverData = driverResults[0];

                // Return both the driver details and the matched ride
                return res.status(200).json({ success: true, driver: driverData, ride: matchedRide });
            });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Error fetching driver details.' });
    }
};



// exports.saveToken = async (req, res) => {
//     const { token, email } = req.body;

//     try {
//         const usersRef = db.collection('users');
//         const userSnapshot = await usersRef.where('email', '==', email).get();

//         if (userSnapshot.empty) {
//             // User doesn't exist, return an error
//             return res.status(404).json({ success: false, message: 'User not found.' });
//         }

//         // Update the driver's data with the new FCM token
//         // await userRef.update({ fcmToken: token });
//         const userId = userSnapshot.docs[0].id;
//         await usersRef.doc(userId).update({
//             fcmToken: token
//         });

//         res.send({ success: true, message: 'Token stored successfully!' });
//     } catch (error) {
//         console.error("Error storing token:", error);
//         res.status(500).send({ success: false, message: 'Error storing token.' });
//     }
// }
exports.saveToken = async (req, res) => {
    const { token, email } = req.body;

    try {
        // Query to update the user's data with the new FCM token
        const updateTokenQuery = 'UPDATE users SET fcmToken = ? WHERE email = ?';
        await connection.query(updateTokenQuery, [token, email]);

        res.send({ success: true, message: 'Token stored successfully!' });
    } catch (error) {
        console.error("Error storing token:", error);
        res.status(500).send({ success: false, message: 'Error storing token.' });
    }
};


// exports.acceptRide = async (req, res) => {
//     const { rideId, driverDetails } = req.body;
//     const io = req.io

//     if (!rideId || !driverDetails) {
//         return res.status(400).json({ success: false, message: 'Ride ID and driver details are required.' });
//     }

//     try {
//         const ridesRef = db.collection('rides');
//         const rideSnapshot = await ridesRef.where('rideId', '==', rideId).get();
//         const id = rideSnapshot.docs[0].id;
//         const rideDoc = ridesRef.doc(id);

//         if (rideSnapshot.empty) {
//             console.log('ride not found');
//             return res.status(404).json({ success: false, message: 'Ride not found.' });
//         }

//         // Make the necessary updates to the ride
//         await rideDoc.update({
//             drivers: [],
//             assignedDriver: driverDetails,
//             status: 'accepted'
//         });

//         // Get the updated data using get
//         let updatedRideSnapshot = await rideDoc.get();
//         let updatedRide = updatedRideSnapshot.data();

//         console.log(updatedRide);

//         // dummy location (to be removed in prod)
//         const motherCoord = {
//             lat: 7.41809,
//             lng: 3.90521,
//         };

//         const driverCoord = updatedRide.assignedDriver.coordinates
//         // const patientCoord = updatedRide.patient.coordinates
//         const patientCoord = motherCoord

//         console.log('Calculating distance and time...');

//         const distanceAndTimePromise = calculateDistance({
//             lat: driverCoord.lat,
//             lon: driverCoord.lng,
//             dest_lat: patientCoord.lat,
//             dest_lon: patientCoord.lng
//         });

//         try {
//             const distanceAndTime = await distanceAndTimePromise

//             console.log('Distance and Time:', distanceAndTime);

//             // Update the ride with distance and time information
//             await rideDoc.update({
//                 distance: distanceAndTime.distance.text,
//                 duration: distanceAndTime.duration.text
//             });

//             // // get latest details
//             updatedRideSnapshot = await rideDoc.get();
//             updatedRide = updatedRideSnapshot.data();

//             console.log('Ride updated with distance and time');
//             io.emit('acceptRide', { message: 'ride accepted', ride: updatedRide });

//             res.status(200).json({ success: true, message: 'Ride accepted successfully!', ride: updatedRide });
//         } catch (error) {
//             console.error("Error calculating distance and time:", error);
//             res.status(500).json({ success: false, message: 'Error calculating distance and time.' });
//         }

//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ success: false, message: 'Error updating ride details.' });
//     }
// }
exports.acceptRide = async (req, res) => {
    const { rideId, driverDetails } = req.body;
    const io = req.io;

    if (!rideId || !driverDetails) {
        return res.status(400).json({ success: false, message: 'Ride ID and driver details are required.' });
    }

    try {
        // Query to update the ride details
        const updateRideQuery = 'UPDATE rides SET drivers = ?, assignedDriver = ?, status = ? WHERE rideId = ?';
        await connection.query(updateRideQuery, [JSON.stringify([]), JSON.stringify({
            ...driverDetails, coordinates: {
                lat: driverDetails.coordinates_lat,
                lng: driverDetails.coordinates_lng
            }
        }), 'accepted', rideId]);

        // Fetch the updated ride data
        const selectUpdatedRideQuery = 'SELECT * FROM rides WHERE rideId = ?';
        await connection.query(selectUpdatedRideQuery, [rideId], async (error, updatedRideResults) => {
            if (error) {
                console.log(error);
                res.status(403).json({ success: false, message: error.message });

            }
            const updatedRide = JSON.parse(JSON.stringify(updatedRideResults[0]));

            // Dummy location (to be removed in prod)
            const motherCoord = {
                lat: 7.41809,
                lng: 3.90521,
            };

            console.log('updatedRide', updatedRide);

            console.log('assignedDrivers', updatedRide.assignedDriver);

            const { coordinates_lat, coordinates_lng } = JSON.parse(updatedRide.assignedDriver);

            const patientCoord = motherCoord;

            console.log('Calculating distance and time...');

            // Calculate distance and time
            const distanceAndTime = await calculateDistance({
                lat: coordinates_lat,
                lon: coordinates_lng,
                dest_lat: patientCoord.lat,
                dest_lon: patientCoord.lng
            });

            console.log('Distance and Time:', distanceAndTime);

            // Update the ride with distance and time information
            const updateDistanceAndTimeQuery = 'UPDATE rides SET distance = ?, duration = ? WHERE rideId = ?';
            await connection.query(updateDistanceAndTimeQuery, [distanceAndTime.distance.text, distanceAndTime.duration.text, rideId]);

            console.log('Ride updated with distance and time');
            io.emit('acceptRide', { message: 'ride accepted', ride: updatedRide });

            res.status(200).json({ success: true, message: 'Ride accepted successfully!', ride: updatedRide });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Error updating ride details.' });
    }
};


// exports.getUserDetails = async (req, res) => {
//     const email = req.body.email;
//     const id = req.body.id

//     console.log('id', id);

//     const usersRef = db.collection('users');
//     if (!email) {
//         // return res.status(400).json({ success: false, message: 'Email is required.' });

//         // search using id if there is no email
//         if (!id) {
//             console.log('there is no id');
//             return res.status(400).json({ success: false, message: 'Email or id is required.' });
//         }
//         try {
//             console.log('there is an id', id);
//             const userSnapshot = await usersRef.doc(id).get();

//             console.log('user snapshot', userSnapshot.exists);

//             if (userSnapshot.exits) {
//                 return res.status(404).json({ success: false, message: 'User not found.' });
//             }

//             const userData = userSnapshot.data();


//             // Return user details
//             return res.status(200).json({ success: true, user: userData });
//         } catch (error) {
//             console.error("Error:", error);
//             res.status(500).json({ success: false, message: 'Error fetching user details.' });
//         }
//         return
//     }


//     // search using email
//     try {
//         const userSnapshot = await usersRef.where('email', '==', email).get();

//         if (userSnapshot.empty) {
//             return res.status(404).json({ success: false, message: 'User not found.' });
//         }

//         const userData = userSnapshot.docs[0].data();

//         // Return user details
//         return res.status(200).json({ success: true, user: userData });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ success: false, message: 'Error fetching driver details.' });
//     }
// }

// exports.getUserRideDetails = async (req, res) => {
//     const { rideId } = req.body;
//     console.log('rideId', rideId);
//     if (!rideId) return

//     try {
//         const ridesRef = db.collection('rides');
//         const rideSnapshot = await ridesRef.where('rideId', '==', rideId).get();

//         if (rideSnapshot.empty) {
//             return res.status(403).json({ success: false, message: 'Ride not found.' });
//         }

//         const rideData = rideSnapshot.docs[0].data();

//         // Return user details
//         return res.status(200).json({ success: true, ride: rideData });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ success: false, message: 'Error fetching ride details.' });
//     }
// }
exports.getUserDetails = async (req, res) => {
    const email = req.body.email;
    const id = req.body.id;

    console.log('id', id);

    if (!email) {
        // Return error if neither email nor id is provided
        if (!id) {
            console.log('there is no id');
            return res.status(400).json({ success: false, message: 'Email or id is required.' });
        }

        try {
            console.log('there is an id', id);

            // Query to get user details by id
            const selectUserByIdQuery = 'SELECT * FROM users WHERE id = ?';
            await connection.query(selectUserByIdQuery, [id], (error, userResults) => {
                if (error) {
                    console.log(error);
                    return res.status(404).json({ success: false, message: error.message });
                }

                if (userResults.length === 0) {
                    return res.status(404).json({ success: false, message: 'User not found.' });
                }

                const userData = userResults[0];

                // Return user details
                return res.status(200).json({ success: true, user: userData });
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ success: false, message: 'Error fetching user details.' });
        }

        return;
    }

    // Search using email
    try {
        // Query to get user details by email
        const selectUserByEmailQuery = 'SELECT * FROM users WHERE email = ?';
        await connection.query(selectUserByEmailQuery, [email], (error, userResults) => {
            if (error) {
                console.log(error);
                return res.status(404).json({ success: false, message: error.message });
            }

            if (userResults.length === 0) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }

            const userData = userResults[0];

            // Return user details
            return res.status(200).json({ success: true, user: userData });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Error fetching user details.' });
    }
};



exports.getUserRideDetails = async (req, res) => {
    const { rideId } = req.body;
    console.log('rideId', rideId);
    if (!rideId) return;

    try {
        const selectRideQuery = 'SELECT * FROM rides WHERE rideId = ?';
        await connection.query(selectRideQuery, [rideId], (error, results) => {
            if (results.length === 0) {
                return res.status(403).json({ success: false, message: 'Ride not found.' });
            }

            const rideData = results[0];

            let { patient, drivers } = rideData

            patient = JSON.parse(patient)
            drivers = JSON.parse(drivers)

            // Return user details
            return res.status(200).json({ success: true, ride: { ...rideData, patient, drivers } });
        });


    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Error fetching ride details.' });
    }
};

// exports.rejectRide = async (req, res) => {
//     const { rideId, driverEmail } = req.body;

//     console.log(driverEmail);

//     if (!rideId || !driverEmail) {
//         return res.status(400).json({ success: false, message: 'Ride ID and driver email are required.' });
//     }

//     try {
//         // Update the driver's SOS status
//         const driversRef = db.collection('users');
//         const driverSnapshot = await driversRef.where('email', '==', driverEmail).get()
//         const driverId = driverSnapshot.docs[0].id
//         const driverRef = driversRef.doc(driverId)

//         if (driverSnapshot.empty) {
//             return res.status(404).json({ success: false, message: 'Driver not found.' });
//         }

//         // const driverDoc = driverSnapshot.docs[0].data();
//         await driverRef.update({ sos: false })
//         console.log('driver set to false');

//         const ridesRef = db.collection('rides');
//         const rideSnapshot = await ridesRef.where('rideId', '==', rideId).get();
//         const id = rideSnapshot.docs[0].id;
//         const rideRef = ridesRef.doc(id);

//         if (rideSnapshot.empty) {
//             return res.status(404).json({ success: false, message: 'Ride not found.' });
//         }

//         const rideData = rideSnapshot.docs[0].data();

//         const drivers = rideData.drivers;

//         // Find the driver in the drivers array using email
//         const updatedDriversArray = drivers.filter(driver => driver.email !== driverEmail);

//         // Update the ride's status to 'declined' and drivers array
//         await rideRef.update({
//             status: 'declined',
//             drivers: updatedDriversArray,
//         });

//         console.log('ride declined');

//         return res.status(200).json({ success: true, message: 'Ride rejected successfully.' });
//     } catch (error) {
//         console.error('Error:', error);
//         return res.status(500).json({ success: false, message: 'Error rejecting ride.' });
//     }
// };

exports.rejectRide = async (req, res) => {
    const { rideId, driverEmail } = req.body;

    console.log(driverEmail);

    if (!rideId || !driverEmail) {
        return res.status(400).json({ success: false, message: 'Ride ID and driver email are required.' });
    }

    try {
        // Update the driver's SOS status
        const updateDriverSosQuery = 'UPDATE users SET sos = false WHERE email = ?';
        await connection.query(updateDriverSosQuery, [driverEmail], async (error, updateDriverResults) => {
            if (error) {
                console.log(error);
                return res.status(404).json({ success: false, message: 'Driver not found.' });
            }

            const ridesRef = 'rides'; // Replace with your actual table name

            // Query to get ride details by rideId
            const selectRideQuery = 'SELECT * FROM ?? WHERE rideId = ?';
            await connection.query(selectRideQuery, [ridesRef, rideId], async (error, rideResults) => {
                if (error) {
                    console.log(error);
                    return res.status(404).json({ success: false, message: 'Ride not found.' });
                }

                const rideData = rideResults[0];

                const drivers = JSON.parse(rideData.drivers);

                // Find the driver in the drivers array using email
                const updatedDriversArray = drivers.filter(driver => driver.email !== driverEmail);

                // Update the ride's status to 'declined' and drivers array
                const updateRideQuery = 'UPDATE ?? SET status = ?, drivers = ? WHERE rideId = ?';
                await connection.query(updateRideQuery, [ridesRef, 'declined', JSON.stringify(updatedDriversArray), rideId], (error, updateRideResults) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ success: false, message: 'Error rejecting ride.' });
                    }

                    console.log('ride declined');

                    return res.status(200).json({ success: true, message: 'Ride rejected successfully.' });
                });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Error rejecting ride.' });
    }
};


// exports.updateRide = async (req, res) => {
//     const { rideId, message } = req.body;
//     const io = req.io


//     if (!rideId) {
//         return res.status(400).json({ success: false, message: 'Ride is required' });
//     }

//     try {
//         const ridesRef = db.collection('rides');
//         const rideSnapshot = await ridesRef.where('rideId', '==', rideId).get();
//         const id = rideSnapshot.docs[0].id;
//         const rideRef = ridesRef.doc(id);

//         if (rideSnapshot.empty) {
//             return res.status(404).json({ success: false, message: 'Ride not found.' });
//         }

//         const rideData = rideSnapshot.docs[0].data();

//         // Update the ride's status to 'declined' and drivers array
//         await rideRef.update({
//             status: message,
//         });

//         // // get latest details
//         updatedRideSnapshot = await rideRef.get();
//         updatedRide = updatedRideSnapshot.data();

//         console.log('message', message);

//         io.emit(`${message}`, { message, ride: updatedRide });

//         return res.status(200).json({ success: true, message: `ride status updated to: ${message}` });
//     } catch (error) {
//         console.error('Error:', error);
//         return res.status(500).json({ success: false, message: 'Error rejecting ride.' });
//     }
// }

exports.updateRide = async (req, res) => {
    const { rideId, message } = req.body;
    const io = req.io;

    if (!rideId) {
        return res.status(400).json({ success: false, message: 'Ride is required' });
    }

    try {
        const ridesRef = 'rides'; // Replace with your actual table name

        // Query to get ride details by rideId
        const selectRideQuery = 'SELECT * FROM ?? WHERE rideId = ?';
        await connection.query(selectRideQuery, [ridesRef, rideId], async (error, rideResults) => {
            if (error) {
                console.log(error);
                return res.status(404).json({ success: false, message: 'Ride not found.' });
            }

            const rideData = rideResults[0];

            // Update the ride's status to the specified message
            const updateRideQuery = 'UPDATE ?? SET status = ? WHERE rideId = ?';
            await connection.query(updateRideQuery, [ridesRef, message, rideId], (error, updateRideResults) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ success: false, message: 'Error updating ride status.' });
                }

                console.log(`Ride status updated to: ${message}`);

                // Get the latest ride details
                const selectUpdatedRideQuery = 'SELECT * FROM ?? WHERE rideId = ?';
                connection.query(selectUpdatedRideQuery, [ridesRef, rideId], async (error, updatedRideResults) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ success: false, message: 'Error fetching updated ride details.' });
                    }

                    const updatedRideData = updatedRideResults[0];

                    io.emit(`${message}`, { message, ride: updatedRideData });

                    return res.status(200).json({ success: true, message: `Ride status updated to: ${message}` });
                });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Error updating ride status.' });
    }
};


// exports.findClosestHospital = async (req, res) => {
//     const { rideId } = req.body;

//     try {
//         // Extract driver coordinates from the request body
//         const { lat, lon } = req.body;

//         if (!lat || !lon) {
//             return res.status(400).json({ success: false, message: 'Latitude and longitude are required.' });
//         }

//         // Build the Google Places API URL with driver coordinates
//         const apiKey = `${process.env.GOOGLE_MAP_API_KEY}`;
//         console.log(apiKey);

//         const radius = 1500; // Search radius in meters
//         const type = 'hospital';
//         const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&key=${apiKey}`;

//         // Send a GET request to the Google Places API
//         const response = await axios.get(apiUrl);
//         const hospitals = response.data

//         console.log(response.data);

//         if (response.data.status === 'OK') {
//             // If results are returned, find the closest hospital
//             const results = response.data.results;
//             let closestHospital = null;
//             let closestDistance = Number.MAX_VALUE;

//             for (const hospital of results) {
//                 const hospitalLat = hospital.geometry.location.lat;
//                 const hospitalLon = hospital.geometry.location.lng;

//                 // Calculate the distance using Haversine formula or the provided calculateDistance function
//                 const distance = getClosestHospital({ lat, lon, dest_lat: hospitalLat, dest_lon: hospitalLon });

//                 if (distance < closestDistance) {
//                     closestHospital = hospital;
//                     closestDistance = distance;
//                 }
//             }

//             const ridesRef = db.collection('rides');
//             const rideSnapshot = await ridesRef.where('rideId', '==', rideId).get();
//             const id = rideSnapshot.docs[0].id;
//             const rideRef = ridesRef.doc(id);

//             if (rideSnapshot.empty) {
//                 return res.status(404).json({ success: false, message: 'Ride not found.' });
//             }

//             const rideData = rideSnapshot.docs[0].data();

//             // Update the ride to add the closest hospital
//             await rideRef.update({
//                 closestHospital
//             });


//             return res.status(200).json({ success: true, closestHospital, hospitals });
//         } else {
//             console.log(response.data);
//             return res.status(500).json({ success: false, message: 'Error fetching hospital data from Google Places API' });
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ success: false, message: 'Internal server error.' });
//     }
// }
exports.findClosestHospital = async (req, res) => {
    const { rideId } = req.body;

    try {
        // Extract driver coordinates from the request body
        const { lat, lon } = req.body;

        if (!lat || !lon) {
            return res.status(400).json({ success: false, message: 'Latitude and longitude are required.' });
        }

        // Build the Google Places API URL with driver coordinates
        const apiKey = `${process.env.GOOGLE_MAP_API_KEY}`;
        console.log(apiKey);

        const radius = 1500; // Search radius in meters
        const type = 'hospital';
        const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&key=${apiKey}`;

        // Send a GET request to the Google Places API
        const response = await axios.get(apiUrl);
        const hospitals = response.data;

        console.log(response.data);

        if (response.data.status === 'OK') {
            // If results are returned, find the closest hospital
            const results = response.data.results;
            let closestHospital = null;
            let closestDistance = Number.MAX_VALUE;

            for (const hospital of results) {
                const hospitalLat = hospital.geometry.location.lat;
                const hospitalLon = hospital.geometry.location.lng;

                // Calculate the distance using Haversine formula or the provided calculateDistance function
                const distance = getClosestHospital({ lat, lon, dest_lat: hospitalLat, dest_lon: hospitalLon });

                if (distance < closestDistance) {
                    closestHospital = hospital;
                    closestDistance = distance;
                }
            }

            const ridesRef = 'rides'; // Replace with your actual table name

            // Query to get ride details by rideId
            const selectRideQuery = 'SELECT * FROM ?? WHERE rideId = ?';
            await connection.query(selectRideQuery, [ridesRef, rideId], async (error, rideResults) => {
                if (error) {
                    console.log(error);
                    return res.status(404).json({ success: false, message: 'Ride not found.' });
                }

                const rideData = rideResults[0];

                // Update the ride to add the closest hospital
                const updateRideQuery = 'UPDATE ?? SET closestHospital = ? WHERE rideId = ?';
                await connection.query(updateRideQuery, [ridesRef, JSON.stringify(closestHospital), rideId], (error, updateRideResults) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ success: false, message: 'Error updating closest hospital in ride details.' });
                    }

                    console.log('Closest hospital added to ride details');

                    return res.status(200).json({ success: true, closestHospital, hospitals });
                });
            });
        } else {
            console.log(response.data);
            return res.status(500).json({ success: false, message: 'Error fetching hospital data from Google Places API' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


// exports.endTrip = async (req, res) => {
//     const { ride } = req.body;
//     const { rideId } = ride
//     const io = req.io;


//     const patientEmail = ride.patient.email
//     const driverEmail = ride.assignedDriver.email

//     console.log(patientEmail, driverEmail);

//     try {
//         // FOR RIDE
//         const ridesRef = db.collection('rides');
//         const rideSnapshot = await ridesRef.where('rideId', '==', rideId).get();
//         const id = rideSnapshot.docs[0].id;
//         const rideRef = ridesRef.doc(id);

//         const usersRef = db.collection('users');

//         // FOR PATIENT
//         const patientSnapshot = await usersRef.where('email', '==', patientEmail).get();
//         const patientId = patientSnapshot.docs[0].id;
//         const patientRef = usersRef.doc(patientId);

//         // FOR DRIVER
//         const driverSnapshot = await usersRef.where('email', '==', driverEmail).get();
//         const driverId = driverSnapshot.docs[0].id;
//         const driverRef = usersRef.doc(driverId);


//         if (rideSnapshot.empty) {
//             return res.status(404).json({ success: false, message: 'Ride not found.' });
//         } else if (patientSnapshot.empty) {
//             return res.status(404).json({ success: false, message: 'patient not found.' });
//         } else if (driverSnapshot.empty) {
//             return res.status(404).json({ success: false, message: 'driver not found.' });
//         }
//         console.log('everyone found');

//         // Perform multiple Firestore operations in a batch
//         const batch = db.batch();

//         // Update assignedDriver's SOS to false
//         batch.update(driverRef, { sos: false });

//         // Update patient's SOS to false
//         batch.update(patientRef, { sos: false });

//         // Delete patient's SOSRideId
//         batch.update(patientRef, { sosRideId: null });

//         // Update ride status to 'completed'
//         batch.update(rideRef, { status: 'completed' });

//         // Commit the batch
//         await batch.commit();

//         console.log('everyone updated');

//         // GET ALL USERS AND ALERT HOSPITALS

//         try {
//             const snapshot = await usersRef.where('userType', '==', 'pregnant woman').get();
//             const pregnantWomanUsers = [];

//             snapshot.forEach(doc => {
//                 // Include the document ID in the data
//                 pregnantWomanUsers.push({
//                     id: doc.id,
//                     ...doc.data(),
//                 });
//             });

//             console.log(pregnantWomanUsers);

//             // EMIT TO SOCKET (ALERT HOSPITALS)
//             io.emit('newSos', { pregnantWomanUsers })
//             // EMIT TO USER
//             io.emit('rideEnded', { message: 'ride completed' })
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             res.status(500).json({ error: 'Internal server error' });
//             return
//         }

//         res.status(200).json({ message: 'Ride completed successfully.' });
//     } catch (error) {
//         console.error('Error completing ride:', error);
//         res.status(500).json({ error: 'An error occurred while completing the ride.' });
//     }
// }

// exports.endTrip = async (req, res) => {
//     const { ride } = req.body;
//     const { rideId } = ride;
//     const io = req.io;

//     const patientEmail = ride.patient.email;
//     const driverEmail = ride.assignedDriver.email;

//     console.log(patientEmail, driverEmail);

//     try {
//         // await withTransaction(async () => {
//         // Update assignedDriver's SOS to false
//         await executeQuery('UPDATE users SET sos = false WHERE email = ?', [driverEmail]);

//         // Update patient's SOS to false and clear SOSRideId
//         await executeQuery('UPDATE users SET sos = false, sosRideId = null WHERE email = ?', [patientEmail]);

//         // Update ride status to 'completed'
//         await executeQuery('UPDATE rides SET status = "completed" WHERE rideId = ?', [rideId]);

//         console.log('everyone updated');

//         // GET ALL USERS AND ALERT HOSPITALS
//         const { results: pregnantWomanUsers } = await executeQuery('SELECT * FROM users WHERE userType = "pregnant woman"');

//         console.log(pregnantWomanUsers);

//         // EMIT TO SOCKET (ALERT HOSPITALS)
//         io.emit('newSos', { pregnantWomanUsers });

//         // EMIT TO USER
//         io.emit('rideEnded', { message: 'ride completed' });
//         // });

//         res.status(200).json({ message: 'Ride completed successfully.' });
//     } catch (error) {
//         console.error('Error completing ride:', error);
//         res.status(500).json({ error: 'An error occurred while completing the ride.' });
//     }
// };


// exports.getAllUsers = async (req, res) => {
//     const usersCollection = db.collection('users'); // Adjust the collection name to match your Firebase setup

//     try {
//         const snapshot = await usersCollection.where('userType', '==', 'pregnant woman').get();
//         const pregnantWomanUsers = [];

//         snapshot.forEach(doc => {
//             // Include the document ID in the dataZ
//             pregnantWomanUsers.push({
//                 id: doc.id,
//                 ...doc.data(),
//             });
//         });

//         console.log(pregnantWomanUsers);
//         res.json(pregnantWomanUsers);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }
exports.endTrip = async (req, res) => {
    const { ride } = req.body;
    const { rideId } = ride;
    const io = req.io;

    console.log('ride', ride);

    const { email: patientEmail } = JSON.parse(ride.patient);
    const { email: driverEmail } = JSON.parse(ride.assignedDriver);

    // console.log(patientEmail, driverEmail);

    try {
        await withTransaction(async () => {
            // Update ride, patient, and driver data
            await executeQuery('UPDATE rides SET status = "completed" WHERE rideId = ?', [rideId]);
            await executeQuery('UPDATE users SET sos = 0, sosRideId = null WHERE email = ?', [patientEmail]);
            await executeQuery('UPDATE users SET sos = 0 WHERE email = ?', [driverEmail]);

            // Fetch pregnant women users
            const { results: pregnantWomanRows } = await executeQuery('SELECT * FROM users WHERE userType = "pregnant woman"');

            const pregnantWomanUsers = pregnantWomanRows.map((woman) => {
                return JSON.parse(JSON.stringify(woman))
            });
            // console.log('pregnantWomanUsers', pregnantWomanUsers);

            // Emit events
            io.emit('newSos', { pregnantWomanUsers });
            io.emit('rideEnded', { message: 'ride completed' });
        });

        res.status(200).json({ message: 'Ride completed successfully.' });
    } catch (error) {
        console.error('Error completing ride:', error);
        res.status(500).json({ error: 'An error occurred while completing the ride.' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const userType = 'pregnant woman';

        const query = 'SELECT * FROM users WHERE userType = ?';
        const values = [userType];

        const result = await executeQuery(query, values);

        const pregnantWomanUsers = result.results;

        console.log(pregnantWomanUsers);
        res.json(pregnantWomanUsers);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.nearbyHospitals = async (req, res) => {
    try {

        // Extract driver coordinates from the request body
        const { lat, lon } = req.body;

        if (!lat || !lon) {
            return res.status(400).json({ success: false, message: 'Latitude and longitude are required.' });
        }

        // Build the Google Places API URL with driver coordinates
        const apiKey = `${process.env.GOOGLE_MAP_API_KEY}`;
        console.log(apiKey);

        const radius = 1500; // Search radius in meters
        const type = 'hospital';
        const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&key=${apiKey}`;

        // Send a GET request to the Google Places API
        const response = await axios.get(apiUrl);
        const hospitals = response.data.results

        if (response.data.status === 'OK') {
            // If results are returned, find the closest hospital
            const results = response.data.results;

            return res.status(200).json({ success: true, hospitals });
        } else {
            console.log(response.data);
            return res.status(500).json({ success: false, message: 'Error fetching hospital data from Google Places API' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}
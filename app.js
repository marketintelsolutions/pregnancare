const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const { saveUser, verifyCode, resendCode, storePassword, login, resetEmail, resetPassword } = require('./controllers/userController');
const { saveLocation, getNearbyDrivers, getDriverDetails, saveToken, acceptRide, getUserDetails, getUserRideDetails, rejectRide } = require('./controllers/dashboardController');
require("dotenv").config();

//Setting up cors
const corsOption = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ["x-auth-token"],
};
app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(express.json());

const io = new Server(server, {
    cors: {
        // origin: "http://localhost:5174", // Replace with your frontend's URL
        origin: "0.0.0.0", // Replace with your frontend's URL
        // origin: "http://localhost:3001", // Replace with your frontend's URL
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Middleware to set io in the request object
app.use((req, res, next) => {
    req.io = io;
    next();
});

const PORT = 8080;

io.on('connection', (socket) => {
    console.log('Client connected');

    // You can handle different events here if needed

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


// AUTH ROUTES
app.post('/saveUser', saveUser);
app.post('/verifyCode', verifyCode);
app.post('/resendCode', resendCode);
app.post('/storePassword', storePassword);
app.post('/login', login);
app.post('/sendResetEmail', resetEmail);
app.post('/reset/:token', resetPassword);

// DASHBOARD ROUTES
app.post('/saveLocation', saveLocation);
app.post('/getNearbyDrivers', (req, res) => getNearbyDrivers(req, res, req.io)); // Pass io to the function
app.post('/getDriverDetails', getDriverDetails);
app.post('/save-token', saveToken);
app.post('/acceptRide', (req, res) => acceptRide(req, res, req.io));
app.post('/getUserDetails', getUserDetails);
app.post('/getUserRideDetails', getUserRideDetails);
app.post('/rejectRide', rejectRide);



server.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
});


require("dotenv").config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const multer = require('multer');
const path = require('path');
const app = express();
const server = http.createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const { saveUser, verifyCode, resendCode, storePassword, login, resetEmail, resetPassword, logout, logoutDriver, uploadImage, updateProfile } = require('./controllers/userController');
const { saveLocation, getNearbyDrivers, getDriverDetails, saveToken, acceptRide, getUserDetails, getUserRideDetails, rejectRide, updateRide, findClosestHospital, endTrip, getAllUsers, nearbyHospitals } = require('./controllers/dashboardController');

//Setting up cors


// cors: {
//     origin: ["www.one.com", "www.two.com", "www.three.com"],
//     default: "www.one.com"
// }

// app.all('*', function (req, res, next) {
//     const origin = cors.origin.includes(req.header('origin').toLowerCase()) ? req.headers.origin : cors.default;
//     res.header("Access-Control-Allow-Origin", origin);
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

const corsOption = {
    origin: "*",
    // origin: ["http://localhost:3000", "http://localhost:3002"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: false,
    exposedHeaders: ["x-auth-token"],
};
app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(express.json());

const io = new Server(server, {
    cors: {
        // origin: "http://localhost:5174", // Replace with your frontend's URL
        origin: "0.0.0.0",
        // origin: ["http://localhost:3000", "http://localhost:3002"], // Replace with your frontend's URL
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Middleware to set io in the request object
app.use((req, res, next) => {
    req.io = io;
    next();
});

let PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('Client connected');

    // You can handle different events here if needed

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Serve static files (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// AUTH ROUTES
app.get('/', (req, res) => {
    res.status(200).send('connected')
});
app.post('/saveUser', saveUser);
app.post('/verifyCode', verifyCode);
app.post('/resendCode', resendCode);
app.post('/storePassword', storePassword);
app.post('/login', login);
app.post('/sendResetEmail', resetEmail);
app.post('/reset/:token', resetPassword);
app.post('/logout', logout);
app.post('/logoutDriver', logoutDriver);
// API endpoint for uploading an image and associating it with a user
app.post('/upload/:email', upload.single('image'), uploadImage);

app.put('/update-profile/:id', updateProfile);

// DASHBOARD ROUTES (PATIENT AND DRIVER)
app.post('/saveLocation', saveLocation);
app.post('/getNearbyDrivers', (req, res) => getNearbyDrivers(req, res, req.io)); // Pass io to the function
app.post('/getDriverDetails', getDriverDetails);
app.post('/save-token', saveToken);
app.post('/acceptRide', (req, res) => acceptRide(req, res, req.io));
app.post('/getUserDetails', getUserDetails);
app.post('/getUserRideDetails', getUserRideDetails);
app.post('/rejectRide', rejectRide);
app.post('/updateRide', (req, res) => updateRide(req, res, req.io));
app.post('/findClosestHospital', findClosestHospital);
app.post('/endTrip', (req, res) => endTrip(req, res, req.io));

app.post('/getNearbyHospitals', nearbyHospitals)

// HEALTHCARE ROUTES
app.get('/getAllUsers', getAllUsers);

server.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
});


const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { saveUser, verifyCode, resendCode, storePassword, login, resetEmail, resetPassword } = require('./controllers/userController');
require("dotenv").config();

const PORT = 8080;

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

// ROUTES
app.post('/saveUser', saveUser);
app.post('/verifyCode', verifyCode);
app.post('/resendCode', resendCode);
app.post('/storePassword', storePassword);
app.post('/login', login);
app.post('/sendResetEmail', resetEmail);
app.post('/reset/:token', resetPassword);



app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
});

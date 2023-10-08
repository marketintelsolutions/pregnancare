const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { saveUser, verifyCode, resendCode, storePassword } = require('./controllers/userController');

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


app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

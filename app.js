const express = require('express');
const app = express();
const cors = require('cors');
const { saveUser, verifyCode } = require('./controllers/userController');

const PORT = 8080;

//Setting up cors
const corsOption = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ["x-auth-token"],
};

app.use(cors(corsOption));

app.use(express.json());

// ROUTES
app.post('/saveUser', saveUser);

app.post('/verifyCode', verifyCode);


app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

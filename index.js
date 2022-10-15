const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const database = require("./database");
// use  some middleware
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer().any());

// set uploads folder as static folder


const eventsRouter = require('./routes/events.routes');

app.use("/api/v3/app/events", eventsRouter);

// error handling middleware

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        message: "Server error",
        error: err
    });
    next();
});
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
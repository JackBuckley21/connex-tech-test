
const express = require('express');
const promMid = require('express-prometheus-middleware');
const app = express();
const cors = require("cors");

app.use(cors());

// Import the Date object.
const Date = require('date');

// Create the route.
app.get('/time', (req, res) => {
    // Read the JSON file.
    const time = require('./schema.json');

    // Get the current system time in epoch.
    const moment = require('moment');

    const now = moment();

    // Send the JSON data and the current system time to the client.
    return res.send({
        time: time,
        epoch: now,
    });
});

app.use(promMid({
    path: '/metrics',
    collectDefaultMetrics: true
}));
// Start the server.
app.listen(8000, () => {
    console.log('Server started on port 8000');
});

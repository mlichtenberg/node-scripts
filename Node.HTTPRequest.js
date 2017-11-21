// Verified working on Node.JS 8.9.1

// DESCRIPTION
// Example of sending HTTP requests and handling the responses.  Uses the "Request" HTTP client.

// PREREQUISITES
// Node.JS -  Install from https://nodejs.org/
// Request HTTP Client - Install from the command line with "npm install request"

// RUN THIS SCRIPT
// From the command line, use "node Node.HTTPRequest.js"

// Import the Request HTTP client
const request = require('request');

// Request data via HTTP from a NASA service and write the response to a file
getNasaData();

function getNasaData() {
    // ECMA 6 equivalent
    //request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
    request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, function (err, res, body) {
        if (err) { return console.log(err); }

        console.log(body.title);
        console.log(body.url);
        console.log(body.hdurl);
        console.log(body.explanation);

    });
}

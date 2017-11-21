// Verified working on Node.JS 8.9.1

// DESCRIPTION
// Example of reading and writing files on the file system

// PREREQUISITES
// Node.JS -  Install from https://nodejs.org/
// Request HTTP Client - Install from the command line with "npm install request"

// RUN THIS SCRIPT
// From the command line, use "node Node.FileIO.js"

// NOTE: APIs for File system IO are documented at https://nodejs.org/docs/latest/api/fs.html

// Import the Request HTTP client
const request = require('request');

// Read BHL Ids from a file, request metadata for those Ids from a BHL service, and write the metadata to a file
getBhlData();

function getBhlData() {
    // Read the IDs from a file
    var fs = require('fs');
    fs.readFile('Node.FileIO.data', 'utf8', (err, data) => {
        if (err) {
            return console.log(err);
        }
        var Ids = data.split("\r\n");

        Ids.forEach(function(id) {
            // Get the data for the Id
            requestBhlData(id);
        });
    });
}

function requestBhlData(titleId) {
    // Visit https://www.biodiversitylibrary.org/getapikey.aspx to get a valid API key
    var apiKey = '00000000-1111-0000-1111-000000000000';
    request('https://www.biodiversitylibrary.org/api2/httpquery.ashx?op=GetTitleMetadata&titleid=' + titleId + '&items=f&format=json&apikey=' + apiKey, { json: true }, function (err, res, body) {
        if (err) { return console.log(err); }

        // Format the data from the response
        var result = body.Result;
        var outputLine = result.TitleUrl + "\t" + result.FullTitle + "\t" + (result.Doi != null ? result.Doi : "") + "\t";
        for(var id in result.Identifiers)
        {
            if (result.Identifiers[id].IdentifierName === "OCLC")
            {
                outputLine += result.Identifiers[id].IdentifierValue;
                break;
            }
        }

        // Write the data to a file
        var fileName = "test-bhl-js-output.txt";
        writeToFile(fileName, outputLine);
    });
}

function writeToFile(fileName, text) {
    var fs = require('fs');
    //fs.writeFile(fileName, text + "\r\n", function(err) {    // Async file write (overwrites file)
    //fs.appendFile(fileName, text + "\r\n", function(err) {    // Async file append
    fs.appendFileSync(fileName, text + "\r\n", function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
}

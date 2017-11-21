// Verified to work with Node.JS 8.9.1

// DESCRIPTION
// Send image URLs to the Clarifai.com Image Recognition API and record the responses

// PREREQUISITES
// Node.JS -  Install from https://nodejs.org/
// Clarifai Client - Install from the command line with "npm install clarifai"

// RUN THIS SCRIPT
// From the command line, use "node Clarifai.js"

/*
Input file has the following format...

bhlurl                                       titleid itemid pageid title                volume 	flickrurl
https://biodiversitylibrary.org/pageimage/34 12      23     34     Birds of N. America  v.3     https://flickr.com/photos/biodivlibrary/18337502304/
https://biodiversitylibrary.org/pageimage/34 12      23     34     Birds of N. America  v.3     https://flickr.com/photos/biodivlibrary/18337502304/


Output file has the following format...

bhlurl                                       titleid itemid pageid title                volume 	flickrurl                                             concept   probability
https://biodiversitylibrary.org/pageimage/34 12      23     34     Birds of N. America  v.3     https://flickr.com/photos/biodivlibrary/18337502304/  bird      0.97	
https://biodiversitylibrary.org/pageimage/34 12      23     34     Birds of N. America  v.3     https://flickr.com/photos/biodivlibrary/18337502304/  cardinal  0.89	
*/

// Import the necessary clients
const clarifai = require('clarifai');

const app = new clarifai.App({
    apiKey: 'YOUR API KEY HERE'
});
   

// Read input from a file, send URLs to Clarifai, and write the responses to a file
processData();

function processData() {
    // Read the input from a file
    var fs = require('fs');
    fs.readFile('Node.Clarifai.data', 'utf8', (err, data) => {
        if (err) {
            return console.log(err);
        }
        var inputLines = data.split("\r\n");

        inputLines.forEach(function(inputLine) {
            // Send the inputs to Clarifai and record the responses
            requestClarifaiData(inputLine);
        });
    });
}

function requestClarifaiData(inputLine) {

    var inputs = inputLine.split("\t");
    var imageUrl = inputs[0];

    // Predict the contents of an image by passing in a url.
    // To use a custom model, pass in the Model ID instead of Clarifai.GENERAL_MODEL.
    // An example Model ID value is 'eeed0b6733a644cea07cf4c60f87ebb7'
    app.models.predict(Clarifai.GENERAL_MODEL, imageUrl).then(
        function(response) {
            console.log(imageUrl);

            // Uncomment for debugging
            //console.log('success');
            //console.log(response);
            //console.log('STATUS DESC: ' + response.status.description);
            //console.log('CLASS: ' + response.outputs[0].data.concepts[0].name);
            //console.log('PROB: ' + response.outputs[0].data.concepts[0].value);

            // Format the data from the response
            var outputLines = "";

            var outputs = response.outputs;
            for(var x = 0; x < outputs.length; x++)
            {
                var concepts = outputs[x].data.concepts;
                for (var y = 0; y < concepts.length; y++)
                {
                    outputLines += inputLine + "\t" + concepts[y].name + "\t" + concepts[y].value + "\r\n";
                };
            }

            // Write the data to a file
            var fileName = "clarifai.output";
            writeToFile(fileName, outputLines);
        },
        function(err) {
            console.log(imageUrl + ' ERROR!');
            // Uncomment for debugging
            //console.error(err);
            var fileName = "clarifai.error";
            writeToFile(fileName, "ERROR\r\nInput: " + inputLine + "\r\n");
            writeToFile(fileName, "Details: ");
            writeToFile(fileName, err.statusText);
            writeToFile(fileName, "\r\n");
        }
    );
}

function writeToFile(fileName, text) {
    var fs = require('fs');
    fs.appendFileSync(fileName, text, function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
}

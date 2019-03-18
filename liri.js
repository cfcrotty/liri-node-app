var axios = require("axios");
require("dotenv").config();
var keys = require("./keys.js");
var moment = require('moment');
var fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//create variables
var command = process.argv[2];
var input = "";
for (var i = 0; i < process.argv.length; i++) { //loops through the process.argv
    if (i > 2) { //if index is greater than 2(which is after the command)
        input += process.argv[i]; //append each word
        if (i != (process.argv.length) - 1) input += " ";//this just appends a space
    }
}

//create switch for each commands
switch (command) {
    case "concert-this":
        logCommands(command, input);
        showArtistEvents();
        break;
    case "spotify-this-song":
        logCommands(command, input);
        showSpotifySong();
        break;
    case "movie-this":
        logCommands(command, input);
        showMovieData();
        break;
    case "do-what-it-says":
        logCommands(command, input);
        showRandomTextResult();
        break;
    default:
        console.log("Command you entered is not recognized.");
}

//create fucntions for each commands

//----------------------------------------------------------------------------------
// -concert-this - `node liri.js concert-this <artist/band name here>`
// ---use axios to get response using: "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp" and show: Name of the venue, Venue location, Date of the Event (use moment to format this as "MM/DD/YYYY")
/**
 * This function shows artists events
 * @param {string} val 
 */
function showArtistEvents(val) {
    resetHTMLFile();
    var htmlStr = "";
    var artist = "BlackPink";
    if (input) artist = input;
    else if (val) artist = val;
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(function (response) {
        //console.log(response);
        var size = Object.keys(response.data).length;
        if (size > 0) {
            var res = response.data;
            for (var i = 0; i < size; i++) {
                console.log("_________________________________________________________________");
                console.log("Artist/Band Name: " + artist);
                console.log("Venue: " + res[i].venue.name);
                var address = "Address: " + res[i].venue.city + ", " + res[i].venue.region + ", " + res[i].venue.country;
                console.log(address);
                var date = res[i].datetime;
                console.log("Date: " + moment(date.slice(0, date.indexOf("T"))).format("MM/DD/YYYY"));
                console.log("_________________________________________________________________");

                //data used for creating HTML page
                htmlStr += `<div class="card-header">`;
                htmlStr += `<div class="card-body">`;
                htmlStr += `<div class="row">`;
                htmlStr += `<div class="col-md-6 boldTag">Artist/Band Name</div>`;
                htmlStr += `<div class="col-md-6">${artist}</div>`;
                htmlStr += `</div>`;
                htmlStr += `<div class="row">`;
                htmlStr += `<div class="col-md-6 boldTag">Venue</div>`;
                htmlStr += `<div class="col-md-6">${res[i].venue.name}</div>`;
                htmlStr += `</div>`;
                htmlStr += `<div class="row">`;
                htmlStr += `<div class="col-md-6 boldTag">Address</div>`;
                htmlStr += `<div class="col-md-6">${address}</div>`;
                htmlStr += `</div>`;
                htmlStr += `<div class="row">`;
                htmlStr += `<div class="col-md-6 boldTag">Date</div>`;
                htmlStr += `<div class="col-md-6">${moment(date.slice(0, date.indexOf("T"))).format("MM/DD/YYYY")}</div>`;
                htmlStr += `</div>`;
                htmlStr += `</div>`;
                htmlStr += `</div>`;
            }
            createHTMLFile(htmlStr, "Events for " + artist);
            console.log("***********************************************************************************************************************");
            console.log("*** You can open an HTML page on a browser using this: " + (__dirname) + "/index.html" + " ***");
            console.log("***********************************************************************************************************************");
        } else {
            console.log("Sorry! No result found.");
        }
    },
        function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        }
    );
}

//----------------------------------------------------------------------------------
// -spotify-this-song - node liri.js spotify-this-song '<song name here>'
// ---use axios to get response using node-spotify-api(https://www.npmjs.com/package/node-spotify-api) and show: Artist(s), The song's name, A preview link of the song from Spotify, The album that the song is from
// ---default: "The Sign" by Ace of Base
/**
 * This function shows song information
 * @param {string} val 
 */
function showSpotifySong(val) {
    resetHTMLFile();
    var htmlStr = "";
    var song = "The Sign";
    if (input) song = input;
    else if (val) song = val;
    spotify.search({ type: 'track', query: song }).then(function (response) {
        //console.log(data);
        var size = Object.keys(response.tracks.items).length;
        if (size > 0) {
            var res = response.tracks.items;
            for (var i = 0; i < size; i++) {
                console.log("_________________________________________________________________");
                var artist = res[i].artists;
                var str = "";
                var size1 = Object.keys(artist).length;
                for (var a = 0; a < size1; a++) {
                    //console.log(artist[a]);
                    str += artist[a].name;
                    if (a != size1 - 1) str += ", ";
                }
                console.log("Artist/s: " + str);
                console.log("Song Name: " + res[i].name);
                console.log("Spotify URL: " + res[i].external_urls.spotify);
                console.log("Preview: " + res[i].preview_url);
                console.log("Album Name: " + res[i].album.name);
                console.log("_________________________________________________________________");

                //data used for creating HTML page
                htmlStr += `<div class="card-header">`;
                htmlStr += `<div class="card-body">`;
                htmlStr += `<div class="row">`;
                htmlStr += `<div class="col-md-3 boldTag">Artist Name(s)</div>`;
                htmlStr += `<div class="col-md-9">${str}</div>`;
                htmlStr += `</div>`;
                htmlStr += `<div class="row">`;
                htmlStr += `<div class="col-md-3 boldTag">Song Name</div>`;
                htmlStr += `<div class="col-md-9">${res[i].name}</div>`;
                htmlStr += `</div>`;
                htmlStr += `<div class="row">`;
                htmlStr += `<div class="col-md-3 boldTag">Spotify URL</div>`;
                htmlStr += `<div class="col-md-9"><a href="${res[i].external_urls.spotify}" target="_blank" >${res[i].external_urls.spotify}</a></div>`;
                htmlStr += `</div>`;
                htmlStr += `<div class="row">`;
                htmlStr += `<div class="col-md-3 boldTag">Preview</div>`;
                htmlStr += `<div class="col-md-9"><a href="${res[i].preview_url}" target="_blank">${res[i].preview_url}</a></div>`;
                htmlStr += `</div>`;
                htmlStr += `<div class="row">`;
                htmlStr += `<div class="col-md-3 boldTag">Album Name</div>`;
                htmlStr += `<div class="col-md-9">${res[i].album.name}</div>`;
                htmlStr += `</div>`;
                htmlStr += `</div>`;
                htmlStr += `</div>`;
            }
            createHTMLFile(htmlStr, "Tracks for " + song);
            console.log("***********************************************************************************************************************");
            console.log("*** You can open an HTML page on a browser using this: " + (__dirname) + "/index.html" + " ***");
            console.log("***********************************************************************************************************************");
        } else {
            console.log("Sorry! No result found.");
        }
    }).catch(function (err) {
        console.log('Error occurred: ' + err);
    });
}

//----------------------------------------------------------------------------------
// -movie-this - node liri.js movie-this '<movie name here>'
// ---use axios to get response using: API key(trilogy) and OMDB url then show Title of the movie, Year the movie came out, IMDB Rating of the movie, Rotten Tomatoes Rating of the movie, Country where the movie was produced, Language of the movie, Plot of the movie,Actors in the movie.
// ---DEfault: Mr. Nobody
/**
 * This function shows movie information
 * @param {string} val 
 */
function showMovieData(val) {
    resetHTMLFile();
    var htmlStr = "";
    var movie = "Mr. Nobody";
    if (input) movie = input;
    else if (val) movie = val;
    var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie;
    axios.get(queryUrl).then(function (response) {
        //console.log(response);
        var size = Object.keys(response.data).length;
        if (size > 0) {
            console.log("_________________________________________________________________");
            console.log("Movie Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            var rt = response.data.Ratings;
            var result = rt.find(obj => {
                return obj.Source === "Rotten Tomatoes";
            })
            console.log("Rotten Tomatoes Rating: " + result.Value);
            console.log("Produced in Country(s): " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("_________________________________________________________________");

            //data used for creating HTML page
            htmlStr += `<div class="card-header">`;
            htmlStr += `<div class="card-body">`;
            htmlStr += `<div class="row">`;
            htmlStr += `<div class="col-md-3 boldTag">Movie Title</div>`;
            htmlStr += `<div class="col-md-9">${response.data.Title}</div>`;
            htmlStr += `</div>`;
            htmlStr += `<div class="row">`;
            htmlStr += `<div class="col-md-3 boldTag">Year</div>`;
            htmlStr += `<div class="col-md-9">${response.data.Year}</div>`;
            htmlStr += `</div>`;
            htmlStr += `<div class="row">`;
            htmlStr += `<div class="col-md-3 boldTag">IMDB Rating</div>`;
            htmlStr += `<div class="col-md-9">${response.data.imdbRating}</div>`;
            htmlStr += `</div>`;
            htmlStr += `<div class="row">`;
            htmlStr += `<div class="col-md-3 boldTag">Rotten Tomatoes Rating</div>`;
            htmlStr += `<div class="col-md-9">${result.Value}</div>`;
            htmlStr += `</div>`;
            htmlStr += `<div class="row">`;
            htmlStr += `<div class="col-md-3 boldTag">Produced in Country(s)</div>`;
            htmlStr += `<div class="col-md-9">${response.data.Country}</div>`;
            htmlStr += `</div>`;
            htmlStr += `<div class="row">`;
            htmlStr += `<div class="col-md-3 boldTag">Language</div>`;
            htmlStr += `<div class="col-md-9">${response.data.Language}</div>`;
            htmlStr += `</div>`;
            htmlStr += `<div class="row">`;
            htmlStr += `<div class="col-md-3 boldTag">Plot</div>`;
            htmlStr += `<div class="col-md-9">${response.data.Plot}</div>`;
            htmlStr += `</div>`;
            htmlStr += `<div class="row">`;
            htmlStr += `<div class="col-md-3 boldTag">Actors</div>`;
            htmlStr += `<div class="col-md-9">${response.data.Actors}</div>`;
            htmlStr += `</div>`;
            htmlStr += `</div>`;
            htmlStr += `</div>`;
            createHTMLFile(htmlStr, "Movie Data for " + response.data.Title);
            console.log("***********************************************************************************************************************");
            console.log("*** You can open an HTML page on a browser using this: " + (__dirname) + "/index.html" + " ***");
            console.log("***********************************************************************************************************************");
        } else {
            console.log("Sorry! No result found.");
        }
    },
        function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        }
    );
}

//----------------------------------------------------------------------------------
// -do-what-it-says - node liri.js do-what-it-says`
// ---Take string from random.txt
/**
 * This function shows result from random.txt
 */
function showRandomTextResult() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log("Error: " + error);
        }
        var dataArr = data.split(",");
        if (data && dataArr[0]) {
            var str = dataArr[1].trim().replace(/"|'/g, '');
            switch (dataArr[0].trim()) {
                case "concert-this":
                    showArtistEvents(str);
                    break;
                case "spotify-this-song":
                    showSpotifySong(str);
                    break;
                case "movie-this":
                    showMovieData(str);
                    break;
                default:
                    console.log("Please check random.txt. No data found.");
            }
        } else {
            console.log("Please check random.txt. No data found.");
        }
    });
}

//---------------------------------Bonus-------------------------------------------------
// - output and append each command on log.txt
// -********create HTML file, make link to open in browser

/**
 * Function that logs commands with input from command line
 * @param {string} command
 * @param {string} input 
 */
function logCommands(command, input) {
    fs.appendFile("log.txt", command + " " + input + ", ", function (err) {
        if (err) {
            console.log("Error: " + err);
        } else {
            //console.log("Command logged.");
        }
    });
}

/**
 * Function to reset/insert initial data in index.html
 */
function resetHTMLFile() {
    var htmlStr = "";
    htmlStr += `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>LIRI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css?family=Dancing+Script|Playfair+Display" rel="stylesheet">
        <!-- Added a link to Bootstrap-->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="assets/css/style.css">
    </head>
    <body>`;
    fs.writeFile("index.html", htmlStr, function (err) {
        if (err) {
            return console.log("Error: " + err);
        }
        //console.log("HTML file reset");
    });
}

/**
 * Function to add data in index.html
 * @param {string} data 
 * @param {string} title 
 */
function createHTMLFile(data, title) {
    var str = `<div class="jumbotron">
                <h1 class="text-center big">${title}</h1>
                </div>
            <div class="container">
            <div class="card mt-1">`;
    str += data;
    str += `</div>
        </div>
    </body>
    </html>`;

    fs.appendFile("index.html", str, function (err) {
        if (err) {
            console.log("Error: " + err);
        } else {
            //console.log("Command logged.");
            openResultPage();
        }
    });
}

/**
 * Function that opens index.html
 */
function openResultPage() {
    const { exec } = require('child_process');
    exec('open ' + (__dirname) + "/index.html", (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            return;
        }
        // the *entire* stdout and stderr (buffered)
        //console.log(`stdout: ${stdout}`);
        //console.log(`stderr: ${stderr}`);
    });
}
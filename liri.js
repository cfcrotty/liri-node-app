var axios = require("axios");
require("dotenv").config();
var keys = require("./keys.js");
var moment = require('moment');
var fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var inquirer = require('inquirer');
var colors = require('colors');


//create variables
//var command = process.argv[2];
//var input = process.argv.slice(3).join(" ");

inquirer.prompt([
    {
        type: "list",
        message: "What is your command?".red.italic.bold,
        choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "command",
        /*
        validate: function (res) {
            if (res === "concert-this" || res === "spotify-this-song" || res === "movie-this" || res === "do-what-it-says") {
                return true;
            } else {
                return "Please enter a correct command.".red;
            }
        }
        */
    },
    {
        type: "input",
        name: 'input',
        message: function (prev) {
            if (prev.command === "concert-this") {
                return "Please enter the artist/band name: ".blue.italic;
            } else if (prev.command === "spotify-this-song") {
                return "Please enter the song name: ".blue.italic;
            } else if (prev.command === "movie-this") {
                return "Please enter the movie name: ".blue.italic;
            }else if (prev.command === "do-what-it-says") {
                return "Press enter to continue.".blue.italic;
            }
        }
    },
]).then(function (inquirerResponse) {
    var input = inquirerResponse.input ? inquirerResponse.input : "";
    switchCommands(inquirerResponse.command,input);
});

//create switch for each commands
function switchCommands(command,input) {
    switch (command) {
        case "concert-this":
            logCommands(command, input);
            showArtistEvents(input);
            break;
        case "spotify-this-song":
            logCommands(command, input);
            showSpotifySong(input);
            break;
        case "movie-this":
            logCommands(command, input);
            showMovieData(input);
            break;
        case "do-what-it-says":
            logCommands(command);
            showRandomTextResult();
            break;
        default:
            console.log("Command you entered is not recognized.");
    }
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
    if (val) artist = val;
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(function (response) {
        //console.log(response);
        var size = Object.keys(response.data).length;
        if (size > 0 && Array.isArray(response.data)) {
            console.log("_________________________________________________________________".red);
            var res = response.data;
            for (var i = 0; i < size; i++) {
                console.log("_________________________________________________________________".blue);
                console.log("Artist/Band Name: ".green.italic.bold + artist.yellow);
                console.log("           Venue: ".green.italic.bold + res[i].venue.name);
                var address = res[i].venue.city + ", " + res[i].venue.region + ", " + res[i].venue.country;
                console.log("         Address: ".green.italic.bold + address);
                var date = res[i].datetime;
                console.log("            Date: ".green.italic.bold + moment(date.slice(0, date.indexOf("T"))).format("MM/DD/YYYY"));
                console.log("_________________________________________________________________".blue);

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
            console.log("_________________________________________________________________".red);
            createHTMLFile(htmlStr, "Events for " + artist);
            console.log("***********************************************************************************************************************".green);
            console.log("***".yellow + " You can open an HTML page on a browser using this: " + (__dirname) + "/index.html" + " ***".yellow);
            console.log("***********************************************************************************************************************".green);
            console.log();
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
    if (val) song = val;
    spotify.search({ type: 'track', query: song }).then(function (response) {
        //console.log(data);
        var size = Object.keys(response.tracks.items).length;
        if (size > 0 && Array.isArray(response.tracks.items)) {
            console.log("_____________________________________________________________________________________________________________________".red);
            var res = response.tracks.items;
            for (var i = 0; i < size; i++) {
                console.log("_____________________________________________________________________________________________________________________".blue);
                var artist = res[i].artists;
                var str = "";
                var size1 = Object.keys(artist).length;
                for (var a = 0; a < size1; a++) {
                    //console.log(artist[a]);
                    str += artist[a].name;
                    if (a != size1 - 1) str += ", ";
                }
                console.log("   Artist/s: ".green.italic.bold + str);
                console.log("  Song Name: ".green.italic.bold + res[i].name.yellow);
                console.log("Spotify URL: ".green.italic.bold + res[i].external_urls.spotify);
                console.log("    Preview: ".green.italic.bold + res[i].preview_url);
                console.log(" Album Name: ".green.italic.bold + res[i].album.name);
                console.log("_____________________________________________________________________________________________________________________".blue);

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
            console.log("_____________________________________________________________________________________________________________________".red);
            createHTMLFile(htmlStr, "Tracks for " + song);
            console.log("***********************************************************************************************************************".green);
            console.log("***".yellow + " You can open an HTML page on a browser using this: " + (__dirname) + "/index.html" + " ***".yellow);
            console.log("***********************************************************************************************************************".green);
            console.log();
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
    if (val) movie = val;
    var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie;
    axios.get(queryUrl).then(function (response) {
        //console.log(response);
        var size = Object.keys(response.data).length;
        if (size > 0 && response.data.Title) {
            console.log("_____________________________________________________________________________________________________________________".red);
            console.log("_____________________________________________________________________________________________________________________".blue);
            console.log("           Movie Title: ".green.italic.bold + response.data.Title.yellow);
            console.log("                  Year: ".green.italic.bold + response.data.Year);
            console.log("           IMDB Rating: ".green.italic.bold + response.data.imdbRating);
            var rt = response.data.Ratings;
            var result = rt.find(obj => {
                return obj.Source === "Rotten Tomatoes";
            })
            console.log("Rotten Tomatoes Rating: ".green.italic.bold + result.Value);
            console.log("Produced in Country(s): ".green.italic.bold + response.data.Country);
            console.log("              Language: ".green.italic.bold + response.data.Language);
            console.log("                  Plot: ".green.italic.bold + response.data.Plot);
            console.log("                Actors: ".green.italic.bold + response.data.Actors);
            console.log("_____________________________________________________________________________________________________________________".blue);
            console.log("_____________________________________________________________________________________________________________________".red);

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
            console.log("***********************************************************************************************************************".green);
            console.log("***".yellow + " You can open an HTML page on a browser using this: " + (__dirname) + "/index.html" + " ***".yellow);
            console.log("***********************************************************************************************************************".green);
            console.log();
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

//getAddressByLatLong("33.7205556","-116.2147222");
/**
 * Funtion to get address by latitude & longitude
 * @param {number/string} lat - latitude
 * @param {number/string} long - longitude
 * @param {function} callback - callback function to call when a response is received
 */
function getAddressByLatLong(lat, long, callback) {
    var queryUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyDs3kB9GH643iw3aYL1egJilXsG0L39HFo";
    axios.get(queryUrl).then(function (response) {
        console.log(response.data.results[0].formatted_address);
        callback(response.data.results[0].formatted_address);
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


/*

var standard_input = process.stdin;
standard_input.setEncoding('utf-8');
console.log("Please select option: [c]concert-this [s]spotify-this-song [m]movie-this [w]do-what-it-says");
standard_input.on('data', function (data) {
    console.log('User Input Data : ' + data);
    //process.exit();
    console.log("Please enter ");
    standard_input.on('data', function (data) {
        console.log('User Input Data : ' + data);
        process.exit();
    });
});

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function(line){
    console.log(line);
})
*/
# liri-node-app
liri-node-app Homework by ***Cara Felise***

LIRI means Language Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data. LIRI will search Spotify for songs, Bands in Town for concerts, and OMDB for movies. 

![Link to Screenshots](https://cfcrotty.github.io/liri-node-app/screenshot.html)
![Link to Video](https://cfcrotty.github.io/liri-node-app/screenshot.html)

![Sample Terminal Image](assets/images/step4.PNG)
![Sample HTML Image](assets/images/step5.PNG)

### How to Use:
1. I am using Node.js packages(axios, colors, dotenv, inquirer, moment, and node-spotify-api) so you need to install dependencies using `npm i` in the terminal

2. User can run the JavaScript using `node liri.js`

3. Then, you have to select one from these commands:

    - `concert-this`
        * This will search the Bands in Town Artist Events API for an artist and render the following information about each event to the terminal:
            * Name of the venue
            * Venue location
            * Date of the Event (use moment to format this as "MM/DD/YYYY")

    - `spotify-this-song`
        * This will show the following information about the song in your terminal/bash window
            * Artist(s)
            * The song's name
            * A preview link of the song from Spotify
            * The album that the song is from

        * If no song is provided then your program will default to "The Sign" by Ace of Base.

    - `movie-this`

        * This will output the following information to your terminal/bash window:
            * Title of the movie.
            * Year the movie came out.
            * IMDB Rating of the movie.
            * Rotten Tomatoes Rating of the movie.
            * Country where the movie was produced.
            * Language of the movie.
            * Plot of the movie.
            * Actors in the movie.

        * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

    - `do-what-it-says`

        * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

        * Edit the text in random.txt to test out the feature for movie-this and concert-this.

4. After selecting a command, enter the artist/band name, song, or movie or press enter to continue. It will show the results on the terminal and open an HTML file on your default browser.



* In addition to logging the data to your terminal/bash window, it also outputs the commands to a .txt file called `log.txt`.

- - -

The project is useful because it provides an example of languages/technologies I learned and show what I can do as a developer. I am using Node.js, Bootstrap, HTML, and CSS.

For questions or concerns, please go to my website at carafelise.com or send an email at admin@carafelise.com. I maintain and developed this project.

const express = require('express');
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000
const app = express();
const fetch = require("node-fetch");
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();
// //creating end points

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post('/', async (req, res) => {
    let location = await req.body.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}`;
    const response = await fetch(url);
    //converting hex to json
    const weatherData = await response.json();
    console.log(weatherData);

});

app.listen(port, () => {
    console.log("server is up and running on ", port);
});
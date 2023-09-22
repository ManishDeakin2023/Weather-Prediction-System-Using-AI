const express = require('express');
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000
const app = express();
const fetch =require('node-fetch');
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();
app.use(express.static('public'));
app.set("view engine", "ejs");
// //creating end points

app.get('/', (req, res) => {
    const sendData = { location: "Location", dis: "Description", temp: "Temp" };
    res.render("index.ejs",{sendData:sendData});
});

app.post('/', async (req, res) => {
    let location = await req.body.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}&units=metric`;
    const response = await fetch(url);
    //converting hex to json
    const weatherData =  await response.json();
    console.log(weatherData);
    const temp = weatherData.main.temp;
    console.log(temp);
    const dis = weatherData.weather[0].description;
    // console.log(dis);
    // //get icon
    // const icon = weatherData.weather[0].icon;
    // const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    // res.write(`<h1>current weather in ${location} is ${dis} </h1>`);
    // res.write(`<h1>current tempreture is ${temp} </h1>`);
    // res.write(`<img src = ${iconUrl}></img>`);

    const sendData = {};
    sendData.location = location;
    sendData.temp = temp;
    sendData.dis = dis;
    res.render("index.ejs",{sendData:sendData});
});

app.listen(port, () => {
    console.log("server is up and running on ", port);
});
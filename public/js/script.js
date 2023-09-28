const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    windSpeed = document.querySelector(".wind-speed"),
    sunRise = document.querySelector(".sun-rise"),
    sunSet = document.querySelector(".sun-set"),
    humidity = document.querySelector(".humidity"),
    visibility = document.querySelector(".visibility"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibility-status"),
    weatherCards = document.querySelector("#weather-cards"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    searchForm = document.querySelector("#search");
    search = document.querySelector("#query");


let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "Week";

//Date Time
function getDateTime(){
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes();

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    hour = hour % 12;
    if(hour < 10){
        hour = "0" + hour;
    }
    if(minute < 10){
        minute = "0" + minute;
    }

    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
}

date.innerText = getDateTime();

// to update every second
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

//to get location 
function getPublicIp(){
    fetch("https://geolocation-db.com/json/",{
        method:"GET",
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        currentCity = date.city;
        getWeatherData(data.city, currentUnit, hourlyorWeek);
    });
}
getPublicIp();

// to get weather data
function getWeatherData(city, unit, hourlyorWeek){
    const apiKey = "6K779N9CQP2Q7TUPFKLMU4PGR";
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
    {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        let today = data.currentConditions;
        if(unit === "c"){
            temp.innerText = today.temp;
        }else{
            temp.innerText == celciusToFahrenheit(today.temp);
        }
        currentLocation.innerText = data.resolvedAddress;
        condition.innerText = today.conditions;
        rain.innerText = "Perc - " + today.precip + "%";
        uvIndex.innerText = today.uvindex;
        windSpeed.innerText = today.windspeed;
        humidity.innerText = today.humidity + "%";
        visibility.innerText = today.visibility;
        airQuality.innerText = today.winddir;
        measureUvIndex(today.uvindex);
        updateHumidityStatus(today.humidity);
        updatVisibilityStatus(today.visibility);
        updateAirQualityStatus(today.winddir);
        sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
        sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
        mainIcon.src = getIcon(today.icon);
        changeBackground(today.icon);
        if(hourlyorWeek === "hourly"){
            updateForecast(data.days[0].hours, unit, "day")
        }else{
            updateForecast(data.days, unit, "week");
        }
    })
    .catch((err) => {
        alert("City is not found");
    })
}

// c to f
function celciusToFahrenheit(temp){
    return((temp * 9) / 5 + 32).toFixed(1);
}

//uv index
function measureUvIndex(uvIndex){
    if(uvIndex <= 2){
        uvText.innerText = "Low";
    }else if(uvIndex <= 5){
        uvText.innerText = "Moderate";
    }else if(uvIndex <= 7){
        uvText.innerText = "High";
    }else if(uvIndex <= 10){
        uvText.innerText = "Very High";
    }else{
        uvText.innerText = "Extreme";
    }
}

// Humidity Status
function updateHumidityStatus(humidity){
    if(humidity <= 30){
        humidityStatus.innerHTML = "Low";
    }else if(humidity <= 60){
        humidityStatus.innerHTML = "Moderate";
    }else{
        humidityStatus.innerHTML = "High";
    }
}

//Visibility Status
function updatVisibilityStatus(visibility){
    if(visibility <= 0.3){
        visibilityStatus.innerText = "Dense Fog";
    }else if(visibility <= 0.16){
        visibilityStatus.innerText = "Moderate Fog";
    }else if(visibility <= 0.35){
        visibilityStatus.innerText = "Light Fog";
    }else if(visibility <= 1.13){
        visibilityStatus.innerText = "Very Light Fog";
    }else if(visibility <= 2.16){
        visibilityStatus.innerText = "Light Mist";
    }else if(visibility <= 5.4){
        visibilityStatus.innerText = "Very Light Mist";
    }else if(visibility <= 10.8){
        visibilityStatus.innerText = "Clear Air";
    }else{
        visibilityStatus.innerText = "Very Clear Air"; 
    }
}

//Air Quality Status
function updateAirQualityStatus(airQuality){
    if(airQuality <= 50){
        airQualityStatus.innerText = "Good";
    }else if(airQuality <= 100){
        airQualityStatus.innerText = "Moderate";
    }else if(airQuality <= 150){
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups";
    }else if(airQuality <= 200){
        airQualityStatus.innerText = "Unhealthy";
    }else if(airQuality <= 250){
        airQualityStatus.innerText = "Very Unhealthy";
    }else{
        airQuality.innerText = "Hazardous";
    }
}

function convertTimeTo12HourFormat(time){
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour & 12;
    hour = hour ? hour : 12;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + ":" + ampm;
    return strTime;
}

//change icon as per weather
function getIcon(condition){
    if(condition === "Partly-cloudy-day"){
        return "icons/cloudy.gif";
    }else if(condition === "partly-cloudy-night"){
        return "icons/cloudy-night.gif";
    }else if(condition === "rain"){
        return "icons/rain.gif";
    }else if(condition === "clear-day"){
        return "icons/clear_day.gif";
    }else if(condition === "clear-night"){
        return "icons/night.gif";
    }else{
        return "icons/sun.gif";
    }
}

function getDayName(date){
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return days[day.getDay()];
}

function getHour(time){
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if(hour > 12){
        hour = hour - 12;
        return `${hour}:${min} PM`;
    } else{
        return `${hour}:${min} AM`;
    }
}

function updateForecast(data, unit, type){
    weatherCards.innerHTML = "";

    let day = 0;
    let numCards = 0;
    // number of cards 24 for hourly and 7 for weekly
    if(type === "day"){
        numCards = 24;
    } else{
        numCards = 7;
    }
    for(let i = 0; i < numCards; i++){
        let card = document.createElement("div");
        card.classList.add("card");
        let dayName = getHour(data[day].datetime);
        if(type === "week"){
            dayName = getDayName(data[day].datetime);;
        }
        let dayTemp = data[day].temp;
        if(unit === "f"){
            dayTemp = celciusToFahrenheit(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";
        if(unit === "f"){
            tempUnit = "°F";
        }
        card.innerHTML = `
        
        <h2 class="day-name">${dayName}</h2>
            <div class="card-icon">
              <img src="${iconSrc}" alt="">
            </div>
            <div class="day-temp">
              <h2 class="temp">${dayTemp}</h2>
              <span class="temp-unit">${tempUnit}</span>
              </div>
        
        `;
        weatherCards.appendChild(card);
        day++;
    }
}

//to change as per weather
function changeBackground(condition){
    const body = document.querySelector("body");
    let bg = "";
    if(condition === "Partly-cloudy-day"){
        bg = "images/partly-cloudy-day.jpeg";
    }else if(condition === "partly-cloudy-night"){
        bg = "images/partly-cloudy-night.jpeg";
    }else if(condition === "rain"){
        bg = "images/rain.jpeg";
    }else if(condition === "clear-day"){
        bg = "images/clear-day.jpg";
    }else if(condition === "clear-night"){
        bg = "images/clear-night.jpeg";
    }else{
        bg = "images/simple.png";
    }
    body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg})`;
}

fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
});

celciusBtn.addEventListener("click", () => {
    changeUnit("c");
});

function changeUnit(unit){
    if(currentUnit != unit){
        currentUnit = unit;
        {
            tempUnit.forEach((elem) => {
                elem.innerText = `°${unit.toUpperCase()}`;
            });
            if(unit === "c"){
                celciusBtn.classList.add("active");
                fahrenheitBtn.classList.remove("active");
            } else{
                celciusBtn.classList.remove("active");
                fahrenheitBtn.classList.add("active");
            }
            getWeatherData(currentCity, currentUnit, hourlyorWeek);
        }
    }
}

hourlyBtn.addEventListener("click", () => {
    changeTimeSpan("hourly");
});

weekBtn.addEventListener("click", () =>{
    changeTimeSpan("week");
});

function changeTimeSpan(unit){
    if(hourlyorWeek != unit){
        hourlyorWeek = unit;
        if(unit === "hourly"){
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        } else{
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value;
    if(location){
        currentCity = location;
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
});

cities = [
    "Melbourne",
    "Sydney",
    "Pune",
    "Mumbai",
    "Delhi",
    "Finland",
    "New York",
];

var currentFocus;

search.addEventListener("input", function(e) {
    removeSuggestions();
    var a, b, i, val=this.value;
    //if there is no input
    if(!val){
        return false;
    }
    currentFocus = -1;

    //creating a list with id
    a = document.createElement("ul");
    a.setAttribute("id", "suggestions");

    this.parentNode.appendChild(a);

    //adding li
    for (i = 0; i < cities.length; i++){

        if(cities[i].substr(0, val.length).toUpperCase()== val.toUpperCase()){
            b = document.createElement("li");
            b.innerHTML="<strong>" + cities[i].substr(0, val.length)+ "</strong>"
            b.innerHTML += cities[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + cities[i] + "'>";

            b.addEventListener("click", function(e){

                search.value = this.getElementsByTagName("input")[0].value;
                removeSuggestions();
            });

            a.appendChild(b);
        }
    }
});

function removeSuggestions(){
    var x = document.getElementById("suggestions");
    if(x) x.parentNode.removeChild(x);
}

search.addEventListener("keydown", function(e){
    var x = document.getElementById("suggesstions");
    if(x) x = x.getElementsByTagName("li");

    if(e.keyCode == 40) {
        currentFocus++;
        addActive(x);
    } else if(e.keyCode == 38){
        currentFocus--;
        addActive(x);
    }
    if(e.keyCode == 13){
        e.preventDefault();
        if(currentFocus > -1){
            if(x) x[currentFocus].click();
        }
    }
});

function addActive(x){
    if(!x) return false;
    removeActive(x);

    if(currentFocus >= x.length) currentFocus = 0;
    if(currentFocus < 0) currentFocus = x.length - 1;

    x[currentFocus].classList.add("active");

}

function removeActive(x){
    for (var i=0; i <x.length; i++){
        x[i].classList.remove("active");
    }
}






// function getWeather() {
//     const location = document.getElementById('location-input').value;
    // const apiKey = 'YOUR_API_KEY'; // Replace with your actual weather API key

    // const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//             displayWeather(data);
//         })
//         .catch(error => console.error('Error:', error));
// }

// function displayWeather(data) {
//     const weatherInfo = document.getElementById('weather-info');
//     weatherInfo.innerHTML = `
//         <h2>${data.name}</h2>
//         <p>Temperature: ${Math.round(data.main.temp - 273.15)}°C</p>
//         <p>Weather: ${data.weather[0].description}</p>
//         <p>Humidity: ${data.main.humidity}%</p>
//     `;
// }

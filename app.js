// jshint esversion: 8
// app's consts
const KELVIN = 273;
const API_KEY = "144af7470dbc1573dd6d185832d48189";
const icon = document.querySelector(".weather-icon");
const temp = document.querySelector(".temperature-value");
const description = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notification = document.querySelector(".notification");

// Weather object contains app's data.
const weather = {};

weather.temperature = {
    unit: "celsius",
    value: ""
};

// Checking if browser supports GEOlocation
if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notification.style.display = "block";
    notification.innerHTML = "<p>Brower doesn't support geolocation</p>";
}

// Get user's geolocation
function setPosition(position){
    console.log(position);
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// show error if issue with geolocation API
function showError(error){
    notification.style.display = "block";
    notification.innerHTML = `<p> ${error.message} </p>`;
}

// Getting info from the weather API
function getWeather(latitude, longitude){
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    // Fetching the Data from the API
    fetch(api).then(function(response){
        // converting the data into JSON.
        let data = response.json();
        return data;
    }).then(function(data){
        // Converting the data from Kelvin into celsius.
        weather.temperature.value = (data.main.temp - KELVIN).toFixed(1);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
    }).then(()=>{
        // displaying on the UI.
        displayWeather();
    });
}

// Displaying the weather data received from the API.
let displayWeather = ()=>{
    icon.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    temp.innerHTML = `<p>${weather.temperature.value}&deg; <span>C</span></p>`;
    description.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
};

//  Converting the temperature value from C to F.
let celsiusToFahrenheit = (celsiusValue)=>{
    return ((celsiusValue * 9/5) + 32).toFixed(1);
};

// Event handler
temp.addEventListener("click", function(){
    // if value undefined.
    if(weather.temperature.value === undefined){
        return;
    } 
    
    if(weather.temperature.unit === "celsius"){
        let fahrenheitValue = celsiusToFahrenheit(weather.temperature.value);
        temp.innerHTML = `<p>${fahrenheitValue}&deg; <span>F</span></p>`;
        weather.temperature.unit = "fahrenheit";
    } else if(weather.temperature.unit === "fahrenheit"){
        weather.temperature.unit = "celsius";
        temp.innerHTML = `<p>${weather.temperature.value}&deg; <span>C</span></p>`;
    }
});
// add var to all elements

var searchInput = document.getElementById('search-input');
var searchForm = document.getElementById('search-form');
var searchBtn = document.getElementById('search-btn');
var todaysWeather = document.getElementById('todays-weather');
var weatherDisplay = document.querySelector('weather-display');
var cityDate = document.getElementById("city-date");
var tempature= document.getElementById('tempature');
var feelsLike = document.getElementById('feels');
var wind = document.getElementById('wind');
var humidity = document.getElementById('humidity');
var UV = document.getElementById('UV-index')
var forecastHistory = document.querySelector('forecast-history');
var dayOne =document.getElementById('day-1');
var dayOne =document.getElementById('day-2');
var dayOne =document.getElementById('day-3');
var dayOne =document.getElementById('day-4');
var dayOne =document.getElementById('day-5');
var searchHistory = JSON.parse(localStorage.getItem("searchName")) || [] 
var searchHistoryList = document.getElementById('history-list')

var getWeather = function(userSearch) {
    const APIKey = "576d315b1c120cd2a9bf8a0c704e1a7d";

    var queryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={APIkey}"

    //fetch from api
    fetch(queryUrl)
    .then(response => {
        if (!response.ok) {
          var errorDisplay = document.getElementById("error-display")
          errorDisplay.setAttribute("class","card-body")
          errorDisplay.textContent = "Invalid input!"

          searchForm.reset()
        }
        else{
            return response.json()
        }
    })

    .then (data => {
        if(!searchHistory.includes(data.name)) {
            searchHistory.push(data.name)
            localStorage.setItem("searchName", JSON.stringify(searchHistory))
            searchHistoryDisplay()
            searchForm.reset()
        }
        weatherDisplay.classList.remove('weather-display')
        forecastHistory.classList.remove("forecast-history")


        //display info on elements
        let currentDate = new Date(data.dt *1000)
        let date = currentDate.getDate()
        let month = currentDate.getMonth()
        let year = currentDate.getFullYear()
        todaysWeather.textContent = data.name + "" + month + "/" + date + "/" + year

        //dispplay current temp, feels, wind, humidity,UV
        tempature.innerHTML = "Current Tempature:" + " " + data.main.tempature + " " 
        
        feelsLike.innerHTML = "Feels like:" + " " + data.main.feelsLike + " "

        wind.innerHTML = "Winds MPH:" + " " + data.wind + " "

        humidity.innerHTML = "Humidity:" + " " + data.main.humidity + "%"

        var lat = data.coord.lat;
        var lon = data.coord.lon;
        var UVurl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&APPID=" + APIKey;
        fetch(UVurl)
        .then(response => response.json())
        //.then(data)



    })


}
var searchInput = document.getElementById("search-input");
var searchForm = document.getElementById("search-form");
var searchBtn = document.getElementById("search-btn");
var searchHistory = JSON.parse(localStorage.getItem("searchName")) || [] 
var searchHistoryList = document.getElementById("history-list");
var todaysWeather = document.getElementById("todays-weather");
var weatherDisplay = document.querySelector(".weather-display");
var cityDate = document.getElementById("city-date");
var temperature = document.getElementById("temperature");
var feelsLike = document.getElementById("feels");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var UV = document.getElementById("UV-index")
var forecastHistory = document.querySelector(".forecast-history");
var dayOne =document.getElementById("day-1");
var dayTwo =document.getElementById("day-2");
var dayThree =document.getElementById("day-3");
var dayFour =document.getElementById("day-4");
var dayFive =document.getElementById("day-5");


var getWeather = function(userSearch) {
    const APIKey = "576d315b1c120cd2a9bf8a0c704e1a7d";

    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + userSearch + "&APPID=" + APIKey;

    //fetch from api
    fetch(queryUrl)
    .then(response => {
        if (!response.ok) {
          var errorDisplay = document.getElementById("error-display")
          errorDisplay.setAttribute("class","card-body")
          errorDisplay.setAttribute("class", "text-center")
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
        console.log(weatherDisplay)

        weatherDisplay.classList.remove("weather-display")
        forecastHistory.classList.remove("forecast-history")


        //display info on elements
        let currentDate = new Date(data.dt *1000)
        let date = currentDate.getDate()
        let month = currentDate.getMonth()
        let year = currentDate.getFullYear()
        todaysWeather.textContent = data.name + "" + month + "/" + date + "/" + year

        //dispplay current temp, feels, wind, humidity,UV
        console.log(data)
        temperature .innerHTML = "Current temperature :" + " " + data.main.temp + " " 
        
        feelsLike.innerHTML = "Feels like:" + " " + data.main.feels_like + " "

        wind.innerHTML = "Winds MPH:" + " " + data.wind.speed + " "

        humidity.innerHTML = "Humidity:" + " " + data.main.humidity + "%"

        var lat = data.coord.lat;
        var lon = data.coord.lon;
        var UVQueryUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&APPID=" + APIKey;        
        
        fetch(UVQueryUrl)
        .then(response => response.json())
        .then(data => {
            
            
            var UVIndexValue = document.createElement("span")           
            if (data[0].value <=2) {
                UV.setAttribute("class", "badge badge-success")
            } else if (data[0].value >=3 && data[0].value <=7) {
            UVIndexValue.setAttribute("class", "badge badge-warning")
            } else {
            UVIndexValue.setAttribute("class", "badge badge-warning")
            }
            UV.innerHTML = "UV Index:" + " "
            UVIndexValue.innerHTML = data[0].value
            UV.append(UVIndexValue)
        })
        
        var fiveDayQueryUrl =  "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + lon + "&APPID=" + APIKey;
        fetch(fiveDayQueryUrl)
        .then(response => response.json())
        .then (data => {
            console.log(data)  
            
            // create an array for days in forecast

            var forecastArray = [dayOne, dayTwo, dayThree, dayFour, dayFive]
            var j=0
            
            for (let i = 1; i <= 5; i++) {           
            // create elements for each weather variable
            var dateTitle = document.createElement("h2")
            var tempP = document.createElement("p")
            var feelsLikeP = document.createElement("p")
            var windP = document.createElement("p")
            var humidityP = document.createElement("p")

            // setting date display to array value
            let iDate = new Date(data.daily[i].dt *1000)
           let idate = iDate.getDate()
           let imonth = iDate.getMonth()
           let iyear = iDate.getFullYear()
           dateTitle.innerHTML= imonth + "/" + idate + "/"  + iyear

           // display weather icon
           //let iWeatherIcon = data.daily[i].weather.icon
           //iWeatherIconImg = document.createElement("img")
           //iWeatherIconImg.setAttribute("src", `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`)
         
            // setting values for the weather variables
           tempP.innerHTML = "Temp:" + " " + data.daily[i].temp.day 
           feelsLikeP.innerHTML = "Feels Like:" + " " + data.daily[i].feels_like.day 
           windP.innerHTML = "Wind:" + " " + data.daily[i].wind_speed + "mph"
           humidityP.innerHTML = "Humidity:" + " " + data.daily[i].humidity + "%"
           
           
           // append the elements
           console.log(forecastArray[j])
          forecastArray[j].append(dateTitle)
          //forecastArray[j].append(iWeatherIconImg)
          forecastArray[j].append(tempP)
          forecastArray[j].append(feelsLikeP)
          forecastArray[j].append(windP)
          forecastArray[j].append(humidityP)
          j++
        }
        })
    }) 
}

searchBtn.addEventListener("click", function() { 
    userSearch = searchInput.value
    getWeather(userSearch);
})



function searchHistoryDisplay () {

    // for loop to create a list of city searches
    searchHistoryList.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
         var searchHistoryItem = document.createElement("button")
        searchHistoryItem.className = "btn btn-light btn-outline-dark btn-xs btn-block" 
        searchHistoryItem.innerHTML = searchHistory[i]
        searchHistoryItem.setAttribute("value", searchHistory[i])
        searchHistoryList.append(searchHistoryItem)

        // be able to click a city in the search history and have its data populate on the page
        searchHistoryItem.addEventListener("click", function (event) {
            getWeather(event.target.value);
        })
    }
}
searchHistoryDisplay()





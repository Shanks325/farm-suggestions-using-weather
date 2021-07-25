
let locationInfo = {}
let currentWeatherInfo = {}
let ForecastWeatherInfo = []
let days = ["Sunday", "Monday", "Tuseday", "Wensday", "Thursday", "Friday", "Saturday"]
let Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",]
let search = document.getElementById("search");
let val=/^[\w\d/_ -/]{3,30}$/

async function getWeather(city = "cairo") {
    let ApiResponse = await fetch(`HTTPS://api.weatherapi.com/v1/forecast.json?key=d81dd5121d184390a07103505212904&q=${city}&days=3`)
    if (ApiResponse.status == 400) {
        console.clear()
        return null;
    }
    else {
        let response = await ApiResponse.json()
        getCurrentWeatherData(response.current)
        getForecastWeatherData(response.forecast.forecastday)
        locationInfo = {
            location: response.location.name,
            time: response.location.localtime_epoch,
        }
    }
}
function getCurrentWeatherData(object) {
    currentWeatherInfo = {
        temp_c: object.temp_c,
        icon: object.condition.icon,
        condation: object.condition.text,
        windSpeed: object.wind_kph,
        direction: object.wind_dir,
    }
}
function getForecastWeatherData(arr) {
    let forecast;
    ForecastWeatherInfo = []
    for (let i = 1; i < arr.length; i++) {
        forecast = {
            condition: arr[i].day.condition.text,
            icon: arr[i].day.condition.icon,
            maxTemp: arr[i].day.maxtemp_c,
            minTemp: arr[i].day.mintemp_c,
        }
        ForecastWeatherInfo.push(forecast)
    }
}
function setDate() {
    let date = new Date(0) //The 0 there is the key, which sets the date to the epoch
    date.setUTCSeconds(locationInfo.time) //to work in the time of the zone
    let cardDay = document.querySelectorAll(".weather .card .card-header .day")
    // set day
    let day = date.getDay()
    for (let i = 0; i < cardDay.length; i++) {
        cardDay[i].innerHTML = `${days[day]}`
        day++;
    }
    //set current date
    let currentDate = `${date.getDate()}` + `${Months[date.getMonth()]}`
    document.querySelector('.weather .card .card-header .date').innerHTML = currentDate

}
function setWeatherInfo() {
    // main card
    document.querySelector(".card .card-body .card-title").innerHTML = locationInfo.location
    document.querySelector(".card .card-body .card-text h2").innerHTML = currentWeatherInfo.temp_c
    document.querySelector(".card .card-body .card-text img").src = `${currentWeatherInfo.icon}`
    document.querySelector(".card .card-body p").innerHTML = currentWeatherInfo.condation
    document.querySelector(".card .card-footer .wind-speed").innerHTML = currentWeatherInfo.windSpeed
    document.querySelector(".card .card-footer .wind-dir").innerHTML = currentWeatherInfo.direction;

    // forecat day
    for (let i = 0; i < ForecastWeatherInfo.length; i++) {
        document.querySelectorAll(".forecast .card-body .icon")[i].src = `${ForecastWeatherInfo[i].icon}`
        document.querySelectorAll(".forecast .card-body h2")[i].innerHTML = `${ForecastWeatherInfo[i].maxTemp}<sup>o</sup>C`
        document.querySelectorAll(".forecast .card-body h3")[i].innerHTML = `${ForecastWeatherInfo[i].minTemp}<sup>o</sup>C`
        document.querySelectorAll(".forecast .card-body p")[i].innerHTML = ForecastWeatherInfo[i].condition
    }

}
async function sequence(key) {
    await getWeather(key)
    setDate()
    setWeatherInfo()
}
sequence()
search.addEventListener("keyup", function () {
    let key = search.value
    if (val.test(key)){
        sequence(key)
        search.classList.remove("alert")
    }
    else{
        search.classList.add("alert")
    }
})
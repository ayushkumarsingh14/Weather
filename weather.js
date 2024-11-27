const apiKey = "7d40edd60e8b4669b2e90219242311";
const weatherUrl = "https://api.weatherapi.com/v1/forecast.json";

document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData("New Delhi"); 
});

let input = document.querySelector('.input');
let searchBtn = document.querySelector('#searchBtn');
let locationBtn = document.querySelector('#locationBtn');

searchBtn.addEventListener('click', ()=>{
    const city = input?input.value.trim():null;

    if(city){
        fetchWeatherData(city);
    }
    else {
        alert('Please Enter the city');       
    }
});

locationBtn.addEventListener('click', ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            (position)=>{
                const laditude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetchWeatherByCoordinates(laditude, longitude);
            },
            (error)=>{
                alert('Unable to get your location');
            }
        )
    }
    else{
        alert('Geological is supported on your device');
    }
});

function fetchWeatherData(city){
    const url = `${weatherUrl}?key=${apiKey}&q=${city}&days=5&aqi=yes&hour=1;`;

    fetch(url)
    .then((response) => response.json())
    .then((data) => updateWeather(data))
    .catch((error) => alert('Cant fetch data'));
}

function fetchWeatherByCoordinates(lat, lon){
    console.log("called")
    const url = `${weatherUrl}?key=${apiKey}&q=${lat},${lon}&days=5&aqi=yes&hour=1;`;

    fetch(url)
    .then((response) => response.json())
    .then((data) => updateWeather(data))
    .catch((error) => alert('Cant fetch data'));
}

function updateWeather(data) {
    // console.log(data);
    const current = data.current;
    const location = data.location;
    const forecast = data.forecast;
    
    document.querySelector('.details h2').textContent = `${current.temp_c}°C`;
    document.querySelector('.details p:nth-child(3)').textContent = current.condition.text;
    document.querySelector('.weather-icon img').src = `https:${current.condition.icon}`;
    console.log(current.condition.icon);
    
    
    document.querySelector('.card-footer p:nth-child(1)').textContent = `📅 ${location.localtime}`;
    document.querySelector('.card-footer p:nth-child(2)').textContent = `📍 ${location.name}, ${location.country}`;

    const aqiElement = document.querySelector('.AQI');
    const aqi = current.air_quality.pm2_5;
     
    if (aqi < 100) {
        aqiElement.textContent = "Good";
        aqiElement.className = "AQI aqi-1";
    }
     else if (aqi > 100 && aqi < 200) {
        aqiElement.textContent = "Moderate";
        aqiElement.className = "AQI aqi-2";
    }
     else if (aqi > 200 && aqi < 300) {
        aqiElement.textContent = "Poor";
        aqiElement.className = "AQI aqi-3";
    }
     else if (aqi > 300 && aqi < 400) {
        aqiElement.textContent = "Very Poor";
        aqiElement.className = "AQI aqi-4";
    }
     else if (aqi > 400) {
        aqiElement.textContent = "Severe";
        aqiElement.className = "AQI aqi-5";
    }

    document.querySelector('.air-indices .item:nth-child(2) h2').textContent = current.air_quality.pm2_5 || "N/A";
    document.querySelector('.air-indices .item:nth-child(3) h2').textContent = current.air_quality.pm10 || "N/A";
    document.querySelector('.air-indices .item:nth-child(4) h2').textContent = current.air_quality.so2 || "N/A";
    document.querySelector('.air-indices .item:nth-child(5) h2').textContent = current.air_quality.co || "N/A";
    document.querySelector('.air-indices .item:nth-child(6) h2').textContent = current.air_quality.no || "N/A";
    document.querySelector('.air-indices .item:nth-child(7) h2').textContent = current.air_quality.no2 || "N/A";
    document.querySelector('.air-indices .item:nth-child(8) h2').textContent = current.air_quality.nh3 || "N/A";
    document.querySelector('.air-indices .item:nth-child(9) h2').textContent = current.air_quality.o3 || "N/A";

    document.querySelector('.highlight .card:nth-child(3) h2').textContent = `${current.humidity} %`;  
    document.querySelector('.highlight .card:nth-child(4) h2').textContent = `${current.pressure_mb} hpa`;  
    document.querySelector('.highlight .card:nth-child(5) h2').textContent = `${current.vis_km} km`;  
    document.querySelector('.highlight .card:nth-child(6) h2').textContent = `${current.wind_kph} m/s`;  
    document.querySelector('.highlight .card:nth-child(7) h2').textContent = `${current.feelslike_c} °C`;  

    if (forecast) {
        const astro = forecast.forecastday[0].astro;
        const sunrise = astro.sunrise;
        const sunset = astro.sunset;

        document.querySelector('.sunrise-sunset .items:nth-child(1) h2').textContent = sunrise;
        document.querySelector('.sunrise-sunset .items:nth-child(2) h2').textContent = sunset;
    }

    const forecastContainer = document.querySelector('.day-forecast');

    forecast.forecastday.forEach((day, index) => {
        const forecastItem = forecastContainer.querySelectorAll('.forecast-item')[index];

        forecastItem.querySelector('span').textContent = `${day.day.avgtemp_c} °C`;
        forecastItem.querySelector('p:nth-child(2)').textContent = day.date;
        forecastItem.querySelector('p:nth-child(3)').textContent = day.day.condition.text;
        forecastItem.querySelector('img').src = `https:${day.day.condition.icon}`;
        console.log(day.day.condition.icon);
        
    });
    
    const hourContainer = document.querySelectorAll('.hourly-forecast .card');

    hourContainer.forEach((hour, index) =>{
        const random = (Math.random()*4 - 2);
        const randomTemp = (current.temp_c - random).toFixed(1);

        hour.querySelector('P:nth-child(3)').textContent = `${randomTemp} °C`;

    })
    

}


function processWeatherData(weatherData) {
    const result = {
        query: weatherData.address,
        alerts: weatherData.alerts,
        conditions: weatherData.currentConditions.conditions,
        icon: weatherData.currentConditions.icon,
        time: weatherData.currentConditions.datetime,
        humidity: weatherData.currentConditions.humidity,
        sunrise: weatherData.currentConditions.sunrise,
        sunset: weatherData.currentConditions.sunset,
        temp: weatherData.currentConditions.temp,
        forecast: weatherData.days,
        description: weatherData.description,
        location: weatherData.resolvedAddress
    };

    return result;
}

function displayWeatherData(data) {
    document.getElementById('location').textContent = data.location;
    document.getElementById('description').textContent = data.description;
    document.getElementById('current-time').textContent = data.time.slice(0, 5);
    document.getElementById('current-conditions').textContent = data.conditions;
    const currentIcon = document.getElementById('current-icon');
    const iconsFolder = 'icons/';
    currentIcon.src = iconsFolder + data.icon + '.svg';
    currentIcon.alt = data.icon;
    document.getElementById('current-temp').textContent = data.temp;
    document.getElementById('sunrise').textContent = data.sunrise.slice(0, 5);
    document.getElementById('sunset').textContent = data.sunset.slice(0, 5);

    const forecastTimes = Array.from(document.getElementsByClassName('forecast-time'));
    const icons = Array.from(document.getElementsByClassName('forecast-icon'));
    const forecastTemps = Array.from(document.getElementsByClassName('forecast-temp'));

    // Target times: 00:00 - 21:00 in 3-hour increments,
    // starting with the one directly after the current time
    let targetHour = (Math.floor(Number(data.time.slice(0, 2)) / 3) + 1) * 3;
    for (let i = 0; i < forecastTimes.length; i++) {
        // Make sure we don't go above 23:00
        targetHour %= 24;
        const targetForecast = data.forecast[0].hours[targetHour];
        forecastTimes[i].textContent = targetForecast.datetime.slice(0, 5);
        icons[i].src = iconsFolder + targetForecast.icon + '.svg';
        icons[i].alt = targetForecast.icon;
        forecastTemps[i].textContent = targetForecast.temp;
        targetHour += 3;
    }

    const alerts = document.getElementById('alerts-container');
    alerts.textContent = '';
    data.alerts.forEach((alert) => {
        const alertDiv = document.createElement('div');
        // Capitalize headline
        alertDiv.textContent += alert.headline[0].toUpperCase() + alert.headline.slice(1) + ': ';
        alertDiv.textContent += alert.description;
        alerts.appendChild(alertDiv);
    });
}

async function getWeatherData(loc) {
    try {
        const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'
                    + loc + '?IconSet=icons2&key=LC8JRPNYJGVVGR4JKMWPVHV5B';
        const response = await fetch(url, {mode: 'cors'});
        if (!response.ok) {
            console.log(response);
            throw('Error ' + response.status);
        }
        const weatherData = await response.json();

        displayWeatherData(processWeatherData(weatherData));
        return processWeatherData(weatherData);
    } catch (err) {
        console.log(err);
    }
}

const loc = document.getElementById('search-box');
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    getWeatherData(loc.value).then((data) => console.log(data));
});

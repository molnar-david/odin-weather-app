let tempUnit;
const unitSlider = document.getElementById('unit-slider');

function getTempUnit() {
    tempUnit = unitSlider.checked ? 'F' : 'C';

    const unitSpans = Array.from(document.getElementsByClassName('unit-span'));
    unitSpans.forEach((unitSpan) => {
        tempUnit === unitSpan.textContent.slice(1) ? unitSpan.classList.add('active') : unitSpan.classList.remove('active');
    });
}

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
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.classList.remove('hidden');
    document.getElementById('location').textContent = data.location;
    document.getElementById('description').textContent = data.description;
    document.getElementById('current-time').textContent = data.time.slice(0, 5);
    const currentIcon = document.getElementById('current-icon');
    const iconsFolder = 'icons/';
    currentIcon.src = iconsFolder + data.icon + '.svg';
    currentIcon.alt = data.icon;
    document.getElementById('current-temp').textContent = data.temp + '°' + tempUnit;
    document.getElementById('current-conditions').textContent = data.conditions;
    document.getElementById('sunrise').textContent = 'Sunrise: ' + data.sunrise.slice(0, 5);
    document.getElementById('sunset').textContent = 'Sunset: ' + data.sunset.slice(0, 5);

    const forecastTimes = Array.from(document.getElementsByClassName('forecast-time'));
    const forecastIcons = Array.from(document.getElementsByClassName('forecast-icon'));
    const forecastTemps = Array.from(document.getElementsByClassName('forecast-temp'));

    // Target times: 00:00 - 21:00 in 3-hour increments,
    // starting with the one directly after the current time
    let targetHour = (Math.floor(Number(data.time.slice(0, 2)) / 3) + 1) * 3;
    for (let i = 0; i < forecastTimes.length; i++) {
        // Make sure we don't go above 23:00 and style grid accordingly
        if (targetHour >= 24) {
            targetHour -= 24;
            const today = document.getElementById('today');
            i === 0 ? today.classList.add('hidden') : today.classList.remove('hidden');
            const tomorrow = document.getElementById('tomorrow');
            tomorrow.style.gridColumn = `${i + 1} / -1`
        }
        const targetForecast = data.forecast[0].hours[targetHour];
        forecastTimes[i].textContent = targetForecast.datetime.slice(0, 5);
        forecastIcons[i].src = iconsFolder + targetForecast.icon + '.svg';
        forecastIcons[i].alt = targetForecast.icon;
        forecastTemps[i].textContent = targetForecast.temp + '°' + tempUnit;
        targetHour += 3;
    }

    const alerts = document.getElementById('alerts');
    const alertsContainer = document.getElementById('alerts-container');
    alertsContainer.textContent = '';
    if (data.alerts.length) {
        alerts.classList.remove('hidden');
        data.alerts.forEach((alert) => {
            const alertDiv = document.createElement('div');
            // Capitalize headline
            alertDiv.textContent += alert.headline[0].toUpperCase() + alert.headline.slice(1) + ': ';
            alertDiv.textContent += alert.description;
            alertsContainer.appendChild(alertDiv);
        });
    } else {
        alerts.classList.add('hidden');
    }

    const longForecastTimes = Array.from(document.getElementsByClassName('long-forecast-date'));
    const longForecastIcons = Array.from(document.getElementsByClassName('long-forecast-icon'));
    const longForecastTempmaxes = Array.from(document.getElementsByClassName('long-forecast-tempmax'));
    const longForecastTempmins = Array.from(document.getElementsByClassName('long-forecast-tempmin'));
    for (let i = 0; i < longForecastTimes.length; i++) {
        // 0 = today in data
        const targetForecast = data.forecast[i+1];
        longForecastTimes[i].textContent = targetForecast.datetime.slice(5);
        longForecastIcons[i].src = iconsFolder + targetForecast.icon + '.svg';
        longForecastIcons[i].alt = targetForecast.icon;
        longForecastTempmaxes[i].textContent = targetForecast.tempmax + '°' + tempUnit;
        longForecastTempmins[i].textContent = targetForecast.tempmin + '°' + tempUnit;
    }
}

async function getWeatherData(loc) {
    if (!tempUnit) tempUnit = 'C';
    try {
        let url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'
                    + loc + '?IconSet=icons2&key=LC8JRPNYJGVVGR4JKMWPVHV5B';
        if (tempUnit === 'C') url += '&unitGroup=metric';

        const response = await fetch(url, {mode: 'cors'});
        if (!response.ok) {
            throw(response.status);
        }
        const weatherData = await response.json();

        displayWeatherData(processWeatherData(weatherData));
        return processWeatherData(weatherData);
    } catch (err) {
        switch (err) {
            case 400:
                err += ': Invalid location';
                break;
            case 401:
                err += ': Unathorized';
                break;
            case 429:
                err += ': Too many requests';
                break;
            case 500:
                err += ': Internal server error';
                break;
            default:
                err += ': Unknown error'
        }
        err = 'Error ' + err;
        alert(err);
    }
}

getTempUnit();
const loc = document.getElementById('search-box');
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    getWeatherData(loc.value);
});

unitSlider.addEventListener('click', (event) => {
    getTempUnit();
    getWeatherData(loc.value);
});

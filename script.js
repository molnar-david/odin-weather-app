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

async function getWeatherData(loc) {
    try {
        const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'
                    + loc + '?key=LC8JRPNYJGVVGR4JKMWPVHV5B';
        const response = await fetch(url, {mode: 'cors'});
        if (!response.ok) {
            console.log(response);
            throw('Error ' + response.status);
        }
        const weatherData = await response.json();

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

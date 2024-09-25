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

async function getWeatherData(location) {
    try {
        const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'
                    + location + '?key=LC8JRPNYJGVVGR4JKMWPVHV5B';
        const response = await fetch(url, {mode: 'cors'});
        if (!response.ok) {
            throw('Error ' + response.meta.status + ': ' + response.meta.msg);
        }
        const weatherData = await response.json();

        return processWeatherData(weatherData);
    } catch (err) {
        console.log(err);
    }
}

getWeatherData('London').then((data) => console.log(data));

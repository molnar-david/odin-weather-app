async function getWeatherData(location) {
    try {
        const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
                    + location + "?key=LC8JRPNYJGVVGR4JKMWPVHV5B";
        const response = await fetch(url, {mode: 'cors'});
        if (!response.ok) {
            throw('Error ' + response.meta.status + ': ' + response.meta.msg);
        }
        const weatherData = await response.json();

        console.log(weatherData);
    } catch (err) {
        console.log(err);
    }
}

getWeatherData("London");

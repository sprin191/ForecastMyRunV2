const weatherCodes = {
    0: "Unknown",
    1000: "Clear, Sunny",
    10001: "Clear",
    1100: "Mostly Clear",
    1101: "Partly Cloudy",
    1102: "Mostly Cloudy",
    11001: "Mostly Clear",
    11011: "Partly Cloudy",
    1001: "Cloudy",
    2000: "Fog",
    2100: "Light Fog",
    4000: "Drizzle",
    4001: "Rain",
    4200: "Light Rain",
    4201: "Heavy Rain",
    5000: "Snow",
    5001: "Flurries",
    5100: "Light Snow",
    5101: "Heavy Snow",
    6000: "Freezing Drizzle",
    6001: "Freezing Rain",
    6200: "Light Freezing Rain",
    6201: "Heavy Freezing Rain",
    7000: "Ice Pellets",
    7101: "Heavy Ice Pellets",
    7102: "Light Ice Pellets",
    8000: "Thunderstorm"
};

const precipitationCodes = {
    1: "Rain",
    2: "Snow",
    3: "Freezing Rain",
    4: "Ice Pellets / Sleet"
}

const weatherIcons = {
    1000: require('./icons/clear_day.svg'),
    10001: require('./icons/clear_night.svg'),
    1001: require('./icons/cloudy.svg'),
    1100: require('./icons/mostly_clear_day.svg'),
    1101: require('./icons/partly_cloudy_day.svg'),
    1102: require('./icons/mostly_cloudy.svg'),
    11001: require('./icons/mostly_clear_night.svg'),
    11011: require('./icons/partly_cloudy_night.svg'),
    2000: require('./icons/fog.svg'),
    2100: require('./icons/fog_light.svg'),
    // 3000: "Light Wind",
    // 3001: "Wind",
    // 3002: "Strong Wind",
    4000: require('./icons/drizzle.svg'),
    4001: require('./icons/rain.svg'),
    4200: require('./icons/rain_light.svg'),
    4201: require('./icons/rain_heavy.svg'),
    5000: require('./icons/snow.svg'),
    5001: require('./icons/flurries.svg'),
    5100: require('./icons/snow_light.svg'),
    5101: require('./icons/snow_heavy.svg'),
    6000: require('./icons/freezing_drizzle.svg'),
    6001: require('./icons/freezing_rain.svg'),
    6200: require('./icons/freezing_rain_light.svg'),
    6201: require('./icons/freezing_rain_heavy.svg'),
    7000: require('./icons/ice_pellets.svg'),
    7101: require('./icons/ice_pellets_heavy.svg'),
    7102: require('./icons/ice_pellets_light.svg'),
    8000: require('./icons/tstorm.svg')
};

export function getWeatherCodeDescription(code) {
    return weatherCodes[code];
};

export function getPrecipitationTypeDescription(code) {
    return precipitationCodes[code];
}

export function getIcon(code) {
    return weatherIcons[code].default;
}
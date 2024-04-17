import React from 'react';
import { getIcon, getWeatherCodeDescription } from "../../utilities/icons";

function WeatherIcon({value}) {
    const description = getWeatherCodeDescription(value);
    return <img src={getIcon(value)} alt={description} title={description} />;
}

export { WeatherIcon };
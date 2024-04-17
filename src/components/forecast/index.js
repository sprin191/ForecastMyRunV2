import React, { Component } from 'react';
import "./index.css";
import { Container, Col, Row } from 'react-bootstrap';
import moment from 'moment';
import 'moment-timezone';
import fetch from "node-fetch";
import { TIMELINE_API_URL } from '../../api/timeline';
import { WeatherIcon } from "../weather-icon"

class Forecast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forecastData: [],
            currentDate: moment().format("dddd, MMMM Do YYYY")
        };

        this.getClimaCellInfo = this.getClimaCellInfo.bind(this);
    }
    
    componentDidMount() {
        this.getForecast();
    }

    getForecast() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getClimaCellInfo, this.handleGeoLocationError);
        } else { 
            alert("Geolocation is not supported by this browser.");
        }
    }

    handleGeoLocationError(error) {
        switch (error.code) {
            case 1: 
                alert("Location services have not been enabled in this browser. Please update your settings to enable location services.");
                break;
            default:
                alert(error.message);
        }
    }

    getClimaCellInfo = (position) => {
        const timelineApiOptions = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Accept-Encoding': 'gzip',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                location: (position.coords.latitude + "," + position.coords.longitude),
                fields: [
                    "precipitationIntensity",
                    "precipitationType",
                    "precipitationProbability",
                    "windSpeed",
                    "windGust",
                    "temperature",
                    "temperatureApparent",
                    "dewPoint",
                    "humidity",
                    "weatherCode",
                    "sunriseTime",
                    "sunsetTime",
                    "moonPhase",
                    "uvIndex",
                    "uvHealthConcern",
                    "epaIndex",
                    "epaPrimaryPollutant",
                    "epaHealthConcern"
                ],
                units: 'imperial',
                timesteps: ["current", "1h", "1d"],
                startTime: 'now',
                endTime: 'nowPlus1d',
                timezone: moment.tz.guess()
            })
        }  

        fetch(TIMELINE_API_URL, timelineApiOptions)
        .then((result) => result.json())
        .then((result) => {
            result = result.data.timelines;
            var formattedResult = [];

            for (let i = 0; i < result.length; i++) {
                if (result[i].timestep === "1h") {
                    formattedResult = result[i].intervals;
                    break;
                };
            };

            for (let i = 0; i < formattedResult.length; i++) {
                formattedResult[i].observation_date = moment(formattedResult[i].startTime).format("dddd, MMMM Do YYYY");
                formattedResult[i].observation_time = moment(formattedResult[i].startTime).format("hA");
                formattedResult[i].startTime = new Date(formattedResult[i].startTime).toISOString();
                formattedResult[i].hasSunSet = !(formattedResult[i].startTime >= formattedResult[i].values.sunriseTime && formattedResult[i].startTime < formattedResult[i].sunsetTime);
            }

            formattedResult = formattedResult.filter(x => x.observation_date === this.state.currentDate);

            console.log(formattedResult);

            this.setState({
                forecastData: formattedResult
            });
        })
        .catch((error) => console.error("error: " + error));
    }

    render() {
        return(
            <Container className="text-align-center">
                <div className="header">Forecast My Run - {this.state.currentDate}</div>
                <Row>
                {this.state.forecastData.map((data, index) => (
                  <Col key={index} xs={6} sm={4} lg={3} className="forecast-item-container">
                    <div className="forecast-item">
                        <WeatherIcon value={data.values.weatherCode}/>
                        <p>{data.observation_time}</p>
                        {data.values.precipitationProbability > 0 && 
                            <p>{data.values.precipitationProbability}%</p>
                        }
                        <p>Temperature: {Math.round(data.values.temperature)}°F</p>
                        {Math.round(data.values.temperatureApparent) !== Math.round(data.values.temperature) &&
                            <p>Feels Like: {Math.round(data.values.temperatureApparent)}°F</p>
                        }
                        <p>Humidity: {Math.round(data.values.humidity)}%</p>
                        <p>Dewpoint: {Math.round(data.values.dewPoint)}°F</p>
                    </div>
                  </Col>
                ))}
                </Row>
            </Container>
        )
    }
}

export default Forecast;
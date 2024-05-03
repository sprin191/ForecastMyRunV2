import React, { Component } from 'react';
import "./index.css";
import { Container, Col, Row } from 'react-bootstrap';
import moment from 'moment';
import 'moment-timezone';
import fetch from "node-fetch";
import { TIMELINE_API_URL } from '../../api/timeline';
import { WeatherIcon } from "../weather-icon";
import { getPrecipitationTypeDescription } from '../../utilities';

class Forecast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forecastData: [],
            currentDate: moment().format("dddd, MMMM Do YYYY"),
            location: null
        };

        this.getClimaCellInfo = this.getClimaCellInfo.bind(this);
    }
    
    componentDidMount() {
        this.getForecast();
    }

    getForecast() {
        if (this.state.location && this.state.forecastData) {
            return;
        } else if (navigator.geolocation && !this.state.location) {
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
                    //Filter out any hourly results for the following day
                    formattedResult = result[i].intervals?.filter(x => moment(x.startTime).format("dddd, MMMM Do YYYY") === this.state.currentDate);
                    break;
                };
            };


            for (let i = 0; i < formattedResult.length; i++) {
                formattedResult[i].observation_time = moment(formattedResult[i].startTime).format("hA");
                formattedResult[i].startTime = new Date(formattedResult[i].startTime).toISOString();
                formattedResult[i].hasSunSet = !(formattedResult[i].startTime >= formattedResult[i].values.sunriseTime && formattedResult[i].startTime < formattedResult[i].values.sunsetTime);
                formattedResult[i].values.rating = this.calculateRating(formattedResult[i].values.dewPoint, formattedResult[i].values.precipitationProbability);
                
                if (formattedResult[i].hasSunSet && (formattedResult[i].values.weatherCode === 1000 || formattedResult[i].values.weatherCode === 1100 || formattedResult[i].values.weatherCode === 1101)) {
                    formattedResult[i].values.weatherCode += '1';
                }

                formattedResult[i].values.precipitationTypeDescription = getPrecipitationTypeDescription(formattedResult[i].values.preciitationType);
            }

            console.log(formattedResult);

            this.setState({
                forecastData: formattedResult,
                location: position
            });
        })
        .catch((error) => console.error("error: " + error));
    }

    calculateRating(dewPoint, precipitationProbability) {
        if ((dewPoint >= 60 && dewPoint < 70) || precipitationProbability > 0) {
            //performance moderately affected
            return 2
        } else if (dewPoint > 70) {
            //very uncomfortable; consider skipping
            return 3
        } else {
            //ideal conditions 
            return 1
        }
    }

    render() {
        return(
            <Container>
                <div className="header">Forecast My Run - {this.state.currentDate}</div>
                <Row>
                {this.state.forecastData.map((data, index) => (
                  <Col key={index} xs={6} sm={4} lg={3} className="forecast-item-container">
                    <div className="forecast-item__content">
                        {data.values.rating === 1 && 
                            <div className="rating-badge font-color-white background-green">Ideal</div>
                        }
                        {data.values.rating === 2 &&
                            <div className="rating-badge background-yellow">Fair</div>
                        }
                        {data.values.rating === 3 &&
                            <div className="rating-badge background-red">Not Recommended</div>
                        }
                        <div className="observation-time">{data.observation_time}</div>
                        <WeatherIcon value={data.values.weatherCode}/>
                        {/*<img src={require('../../icons/running_fast.svg').default} alt="ideal"/>*/}
                        {data.values.precipitationProbability > 0 && 
                            <div>{data.values.precipitationProbability}% Chance of {data.values.precipitationTypeDescription}</div>
                        }
                        <div>
                            <span>{Math.round(data.values.temperature)}°F</span>
                            {Math.round(data.values.temperatureApparent) !== Math.round(data.values.temperature) &&
                                <span>(feels like: {Math.round(data.values.temperatureApparent)})°F</span>
                            }                        
                        </div>
                        <div className="toggle-header">See More v</div>
                        {/*<div>Humidity: {Math.round(data.values.humidity)}%</div>*/}
                        {/*<div>Dewpoint: {Math.round(data.values.dewPoint)}°F</div>*/}
                    </div>
                  </Col>
                ))}
                </Row>
            </Container>
        )
    }
}

export default Forecast;
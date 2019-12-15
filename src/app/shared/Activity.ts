import { Moment } from 'moment';
import * as moment from 'moment';

export class Activity {
    id: number;
    name: string;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    total_elevation_gain: number;
    type: string;
    workout_type: string;
    start_date: Moment;
    start_date_local: Moment;
    timezone: string;
    utc_offset: number;
    start_latlng: number;
    end_latlng: number;
    location_city: string;
    location_state: string;
    location_country: string;

    constructor(id: number, 
        name: string, 
        distance: number,
        moving_time: number, 
        elapsed_time: number, 
        total_elevation_gain: number, 
        type: string, 
        workout_type: string, 
        start_date: string, 
        start_date_local: string, 
        timezone: string, 
        utc_offset: number, 
        start_latlng: number, 
        end_latlng: number, 
        location_city: string, 
        location_state: string, 
        location_country: string) {

        this.id = id;
        this.name = name;
        this.distance = distance;
        this.moving_time = moving_time;
        this.elapsed_time = elapsed_time;
        this.total_elevation_gain = total_elevation_gain;
        this.type = type;
        this.workout_type = workout_type;
        this.start_date = moment(start_date);
        this.start_date_local = moment(start_date_local);
        this.timezone = timezone;
        this.utc_offset = utc_offset;
        this.start_latlng = start_latlng;
        this.end_latlng = end_latlng;
        this.location_city = location_city;
        this.location_state = location_state;
        this.location_country = location_country;
    }
}
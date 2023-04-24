import { getTimezoneOffset } from 'date-fns-tz';
import tzlookup from "tz-lookup";

const iss_api_url = "http://api.open-notify.org/iss-now.json";

function polar2Cartesian(radius, latitude, longitude) {
    return {
        x: radius * Math.sin(latitude * Math.PI / 180) * Math.cos(longitude * Math.PI / 180),
        y: radius * Math.sin(latitude * Math.PI / 180) * Math.sin(longitude * Math.PI / 180),
        z: radius * Math.cos(latitude * Math.PI / 180)
    }
}

function msToHour(ms) {
    const MS_IN_HOUR = 3600000;
    return ms / MS_IN_HOUR;
}

async function getISSPosition() {

    const res = await fetch(iss_api_url);
    const data = await res.json();

    console.log(`[server]: getISSPosition longitude=${data.iss_position.longitude}, latitude=${data.iss_position.latitude}`);

    return {
        longitude: data.iss_position.longitude,
        latitude: data.iss_position.latitude
    };
}

export const reportISSTimeZone = async () => {

    const pos = await getISSPosition();
    const {x, y, z} = polar2Cartesian(106, pos.latitude, pos.longitude);
    console.log(`[server]: reportISSTimeZone x=${x}, y=${y}, z=${z}`);

    const tz = tzlookup(pos.latitude, pos.longitude);
    console.log(`[server]: reportISSTimeZone timezone=${tz}`);

    const offsetMs = getTimezoneOffset(tz);
    let offsetHour;

    if(!isNaN(offsetMs)){
        offsetHour = msToHour(offsetMs);
    }
    console.log(`[server]: reportISSTimeZone offsetHour=${offsetHour}`);

    return {
        latitude: pos.latitude,
        longitude: pos.longitude,
        x: x,
        y: y,
        z: z,
        timezone: tz, 
        offsetHour: offsetHour 
    }
}
import { getTimezoneOffset } from 'date-fns-tz';
import tzlookup from "tz-lookup";

const iss_api_url = "http://api.open-notify.org/iss-now.json";

async function getISSPosition() {
    const res = await fetch(iss_api_url);
    const data = await res.json();

    const longEl = document.getElementById('longitude');
    longEl.setAttribute('text', 'value', data.iss_position.longitude);
    const latEl = document.getElementById('latitude');
    latEl.setAttribute('text', 'value', data.iss_position.latitude);
    const satEl = document.getElementById('satellite');
    const coordEl = document.getElementById('coord');

    const theta = data.iss_position.latitude;
    const phi = data.iss_position.longitude;
    const x = 106 * Math.sin(theta) * Math.cos(phi) + 0;
    const y = 106 * Math.sin(theta) * Math.sin(phi) + 0;
    const z = 106 * Math.cos(theta) - 300;
    
    satEl.setAttribute('position', {x: x, y: y, z: z});
    console.log(`${x} ${y} ${z}`);
    
    console.log(data.iss_position.longitude, data.iss_position.latitude);
    return {
        longitude: data.iss_position.longitude,
        latitude: data.iss_position.latitude
    };
}

async function reportISSTimeZone(){
    const pos = await getISSPosition();
    const tz = tzlookup(pos.latitude, pos.longitude);
    console.log(tz);
    const tzEl = document.getElementById('timezone');
    tzEl.setAttribute('text', 'value', tz);

    const offsetMs = getTimezoneOffset(tz);
    
    if(!isNaN(offsetMs)){
        const MS_IN_SEC = 1000;
        const SEC_IN_MIN = 60;
        const MIN_IN_HOUR = 60;
        const MS_IN_HOUR = MS_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR;
        const offsetHour = offsetMs / (MS_IN_HOUR);
        // console.log(`offsetHour:${offsetHour}h`);
        
        const el = document.querySelector('a-plane');
        if(dataChangedIndicator(offsetHour))
        {
            el.setAttribute('sketch', {time: offsetHour});
            console.log(`dataChanged: ${offsetHour}`);
        }
    }
}

function getTimeFunct()
{
    let t = 0;
    return function time() {
        t = (++t > 12) ? -12 : t;
        return t;
    }
}

function getDataChangedIndicator()
{
    let oldData = 0;
    return function dataChanged(data)
    {
        let tempData = oldData;
        oldData = data;
        return tempData != data;
    }
}

let dataChangedIndicator = getDataChangedIndicator();
setInterval(reportISSTimeZone, 3000);
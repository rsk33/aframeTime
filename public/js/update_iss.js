async function updateIss()
{
    const res = await fetch('/api/isstime');
    const data = await res.json();

    // console.log(`[client]: getIss longitude=${data.longitude}, latitude=${data.latitude},
    //     x=${data.x}, y=${data.y}, z=${data.z},
    //     timezone=${data.timezone}, offsetHour${data.offsetHour}`);
    
    const sketchEl = document.querySelector('a-plane');
    sketchEl.setAttribute('sketch', {time: data.offsetHour});
    
    const longEl = document.getElementById('longitude');
    longEl.setAttribute('text', 'value', data.longitude);
    const latEl = document.getElementById('latitude');
    latEl.setAttribute('text', 'value', data.latitude);

    const planetEl = document.getElementById('planet');

    let moveToPalenetCoord = {
        x: data.x + planetEl.getAttribute('position').x,
        y: data.y + planetEl.getAttribute('position').y,
        z: data.z + planetEl.getAttribute('position').z
    };

    const satEl = document.getElementById('satellite');
    satEl.setAttribute('position', {x: moveToPalenetCoord.x, y: moveToPalenetCoord.y, z: moveToPalenetCoord.z});

    const tzEl = document.getElementById('timezone');
    tzEl.setAttribute('text', 'value', data.timezone);
}

setInterval(updateIss, 3000);
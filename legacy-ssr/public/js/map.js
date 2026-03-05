 window.scrollTo(0, 0)
 mapboxgl.accessToken = token;
 const markerHeight = 50;
 const markerRadius = 10;
 const linearOffset = 25;
 const popupOffsets = {
    'top': [0, 0],
    'top-left': [0, 0],
    'top-right': [0, 0],
    'bottom': [0, -markerHeight],
    'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'left': [markerRadius, (markerHeight - markerRadius) * -1],
    'right': [-markerRadius, (markerHeight - markerRadius) * -1]
};
 const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12', 
            center: JSON.parse(geo), 
            zoom: 9 
        });

        const marker = new mapboxgl.Marker({
        color: "#7a00ff",
        draggable: true
        })
        .setLngLat(JSON.parse(geo))
        .addTo(map);

        const nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
        });
        map.addControl(nav, 'bottom-right');
        map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true
        }));
        map.addControl(new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric' // or 'imperial'
        }));
        
        map.on('load', () => {
        map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.6
            }
        });
        });
        

        const popup = new mapboxgl.Popup({offset: popupOffsets, className: 'my-class'})
        .setLngLat(JSON.parse(geo))
        .setHTML(`<h5>${loc}</h5>`)
        .setMaxWidth("300px")
        .addTo(map);
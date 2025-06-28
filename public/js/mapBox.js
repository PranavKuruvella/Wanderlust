let mapToken = maptoken
mapboxgl.accessToken = mapToken

// Parse the coordinates from the EJS template
const listingCoordinates = JSON.parse(coordinates)

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listingCoordinates, // starting position [lng, lat] from the listing
    zoom: 8 // starting zoom
});

// Add navigation controls (includes compass)
map.addControl(new mapboxgl.NavigationControl());

// Create default black marker
const marker2 = new mapboxgl.Marker({ color: "red", rotation:2 })
    .setLngLat(listingCoordinates)
    .addTo(map);





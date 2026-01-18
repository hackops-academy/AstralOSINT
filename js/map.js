// Global variables
const points = [];
const markers = [];

// Initialize map
const map = L.map("map", {
    center: [20.5937, 78.9629],
    zoom: 5,
    minZoom: 2,
    maxZoom: 19
});

// Base layers
const street = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: "OSM" }
);

const satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { attribution: "Esri" }
);

const terrain = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    { attribution: "OpenTopoMap" }
);

// Default
street.addTo(map);

// Layer control
L.control.layers({
    "🗺 Street": street,
    "🛰 Satellite": satellite,
    "⛰ Terrain": terrain
}).addTo(map);

// Click to add point
map.on("click", e => {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    points.push([lat, lon]);

    const marker = L.marker([lat, lon]).addTo(map);
    markers.push(marker);

    // Reverse geocoding (FREE)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(res => res.json())
        .then(data => {
            const address = data.display_name || "Unknown location";

            marker.bindPopup(
                `<b>Location</b><br>
                 ${address}<br>
                 Lat: ${lat.toFixed(5)}<br>
                 Lon: ${lon.toFixed(5)}`
            );

            addPointToList(lat, lon, address);
        })
        .catch(() => {
            addPointToList(lat, lon, "Address unavailable");
        });
});
function addPointToList(lat, lon, address) {
    const li = document.createElement("li");
    li.innerText = `📍 ${address}`;
    document.getElementById("pointList").appendChild(li);
}

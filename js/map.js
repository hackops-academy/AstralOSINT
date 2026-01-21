// ================= GLOBAL STATE =================
let map, markerCluster, tempMarker;
let routingControl = null; // Stores the active route logic
let routeLine = null;      // Stores the fallback red line
let layers = {};
let currentLayer;
let savedPoints = JSON.parse(localStorage.getItem("savedPoints")) || [];

// ================= MAP INIT =================
// Initialize the map centered on India (or your preferred start location)
map = L.map("map", {
    zoomControl: false, 
    attributionControl: false
}).setView([20.5937, 78.9629], 5);

// Define Tile Layers (Street, Satellite, Terrain, Dark)
layers.street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
layers.satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");
layers.terrain = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png");
layers.dark = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png");

currentLayer = layers.street.addTo(map);

// Initialize Marker Cluster Group
markerCluster = L.markerClusterGroup().addTo(map);

// ================= VISUAL MARKER (Blue Dot) =================
function placeTempMarker(lat, lng, address = "") {
    if (tempMarker) map.removeLayer(tempMarker);
    
    // Create a glowing blue custom marker
    tempMarker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#00eaff; width:12px; height:12px; border-radius:50%; border:2px solid #fff; box-shadow: 0 0 10px #00eaff;'></div>",
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        })
    }).addTo(map);

    // Update Input Fields
    document.getElementById("lat").value = lat.toFixed(6);
    document.getElementById("lng").value = lng.toFixed(6);
    if(address) document.getElementById("address").value = address;
}

// ================= EVENT: MAP CLICK =================
map.on("click", async (e) => {
    const { lat, lng } = e.latlng;
    placeTempMarker(lat, lng, "Fetching address...");

    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        document.getElementById("address").value = data.display_name || "Unknown Location";
    } catch {
        document.getElementById("address").value = "Network Error";
    }
});

// ================= FUNCTION: SEARCH =================
function searchPlace() {
    const q = document.getElementById("search-input").value.trim();
    if (!q) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`)
        .then(r => r.json())
        .then(d => {
            if (!d.length) return alert("Location not found");
            const { lat, lon, display_name } = d[0];
            const newLat = parseFloat(lat);
            const newLng = parseFloat(lon);
            
            map.setView([newLat, newLng], 14);
            placeTempMarker(newLat, newLng, display_name);
        });
}

// ================= UI FUNCTIONS =================
function setLayer(type) {
    if(layers[type]) {
        map.removeLayer(currentLayer);
        currentLayer = layers[type].addTo(map);
    }
}

function savePoint() {
    const name = document.getElementById("point-name").value.trim();
    const tag  = document.getElementById("point-tag").value.trim();
    const lat  = parseFloat(document.getElementById("lat").value);
    const lng  = parseFloat(document.getElementById("lng").value);

    if (!name || isNaN(lat)) return alert("Click the map to select a point first.");

    savedPoints.push({ name, tag, lat, lng });
    localStorage.setItem("savedPoints", JSON.stringify(savedPoints));
    drawPoints();
}

function clearSavedPoints() {
    if(!confirm("Remove all saved points?")) return;
    localStorage.removeItem("savedPoints");
    savedPoints = [];
    drawPoints();
    clearRoute();
}

// ================= DRAW LIST & DROPDOWNS =================
function drawPoints() {
    markerCluster.clearLayers();
    const list = document.getElementById("point-list");
    const startSel = document.getElementById("route-start");
    const endSel   = document.getElementById("route-end");

    // Clear old list and dropdowns
    list.innerHTML = "";
    startSel.innerHTML = "";
    endSel.innerHTML = "";

    savedPoints.forEach((p, i) => {
        // Add Marker to Map
        const marker = L.marker([p.lat, p.lng]).bindPopup(`<b>${p.name}</b><br>${p.tag}`);
        markerCluster.addLayer(marker);

        // Add to Sidebar List
        const div = document.createElement("div");
        div.className = "point-item";
        div.innerHTML = `<strong>${p.name}</strong><br><small>${p.tag}</small>`;
        div.onclick = () => {
            map.setView([p.lat, p.lng], 16);
            placeTempMarker(p.lat, p.lng, p.name);
        };
        list.appendChild(div);

        // Add to Route Dropdowns
        startSel.add(new Option(p.name, i));
        endSel.add(new Option(p.name, i));
    });
}

// ================= ROUTING LOGIC =================
function createRoute() {
    clearRoute(); // Remove any existing route first

    const startIdx = document.getElementById("route-start").value;
    const endIdx = document.getElementById("route-end").value;

    if (startIdx === "" || endIdx === "") {
        alert("Please select both a Start and End point.");
        return;
    }

    const a = savedPoints[startIdx];
    const b = savedPoints[endIdx];

    document.getElementById("route-info").innerHTML = "Calculating route...";

    // CHECK: Is Routing Machine Loaded?
    if (!L.Routing) {
        alert("Routing Error: Library not loaded. Check index.html");
        drawFallbackLine(a, b);
        return;
    }

    try {
        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(a.lat, a.lng),
                L.latLng(b.lat, b.lng)
            ],
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1'
            }),
            lineOptions: {
                styles: [{ color: '#00eaff', opacity: 0.8, weight: 6 }]
            },
            createMarker: function() { return null; }, // We use our own markers
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            show: false // Hide the instruction box
        }).addTo(map);

        // Success: Road found
        routingControl.on('routesfound', function(e) {
            const summary = e.routes[0].summary;
            const distKm = (summary.totalDistance / 1000).toFixed(1);
            const timeMin = Math.round(summary.totalTime / 60);

            document.getElementById("route-info").innerHTML = 
                `<strong>Road Route:</strong> ${distKm} km | ~${timeMin} mins`;
        });

        // Error: No road found (e.g., ocean)
        routingControl.on('routingerror', function() {
            console.warn("Routing failed. Using fallback.");
            drawFallbackLine(a, b);
        });

    } catch (e) {
        console.error("Routing Exception:", e);
        drawFallbackLine(a, b);
    }
}

// Helper: Draws a red dashed line if road routing fails
function drawFallbackLine(a, b) {
    clearRoute();
    
    routeLine = L.polyline([[a.lat, a.lng], [b.lat, b.lng]], {
        color: '#ff4444',
        weight: 4,
        dashArray: '10, 10',
        opacity: 0.8
    }).addTo(map);

    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

    document.getElementById("route-info").innerHTML = 
        `<span style="color:#ff4444">⚠ Road data unavailable. Showing direct path.</span>`;
}

function clearRoute() {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }
    document.getElementById("route-info").innerHTML = "";
}

// Initial Call
drawPoints();


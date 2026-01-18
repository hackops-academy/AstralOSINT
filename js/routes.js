let routeLine = null;

function drawRoute() {
    if (!window.points || points.length < 2) {
        alert("Add at least two points");
        return;
    }

    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }

    // OSRM expects lon,lat
    const coords = points
        .map(p => `${p[1]},${p[0]}`)
        .join(";");

    const url =
        `https://router.project-osrm.org/route/v1/driving/${coords}` +
        `?overview=full&geometries=geojson`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (!data.routes || data.routes.length === 0) {
                alert("No route found");
                return;
            }

            const route = data.routes[0];

            routeLine = L.geoJSON(route.geometry, {
                style: {
                    color: "red",
                    weight: 4
                }
            }).addTo(map);

            const distanceKm = route.distance / 1000;
            const timeMin = route.duration / 60;

            document.getElementById("summary").innerHTML = `
                🧭 Distance: ${distanceKm.toFixed(2)} km<br>
                ⏱️ Time (Car): ${timeMin.toFixed(1)} min
            `;
        })
        .catch(err => {
            console.error("Routing error:", err);
            alert("Routing service error");
        });
}

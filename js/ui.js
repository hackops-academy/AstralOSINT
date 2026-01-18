function clearPoints() {
    points.length = 0;

    markers.forEach(m => map.removeLayer(m));
    markers.length = 0;

    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }

    document.getElementById("pointList").innerHTML = "";
    document.getElementById("summary").innerHTML = "";
}

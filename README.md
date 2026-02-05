# 🛰️ AstraOSINT | Advanced GEOINT Console

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)
![Platform](https://img.shields.io/badge/platform-Web-brightgreen.svg)

**AstraOSINT** is a professional-grade, web-based Geospatial Intelligence (GEOINT) tool designed for researchers, OSINT analysts, and hobbyists. It provides a centralized interface for satellite imagery analysis, point-of-interest tracking, and tactical route planning.

---

## 🚀 Key Features

### 🌍 Multimodal Mapping
Switch seamlessly between different visual layers to analyze terrain and infrastructure from multiple perspectives:
* **Satellite:** High-resolution orbital imagery for detailed site analysis.
* **Street:** Standard navigation view for urban layout assessment.
* **Terrain:** Topographic data for elevation and landform study.
* **Dark Mode:** High-contrast tactical view for low-light environments.

### 📍 Intel Management
* **Precision Coordinates:** Real-time Latitude/Longitude extraction with integrated Reverse Geocoding for exact physical addresses.
* **Target Tagging:** Save specific locations with custom names and tags (e.g., "WiFi Access Point," "CCTV Camera," "Entry Point").
* **Persistent Storage:** Keep your intel organized within the local session for quick reference.

### 🗺️ Tactical Routing
* **Pathfinding:** Calculate and plot the most efficient routes between saved markers.
* **Route Metrics:** Real-time distance and time estimation for operational planning.

### 🔍 Advanced Search
* Integrated global search bar to teleport to any location on the globe instantly.

---

## 🛠️ Tech Stack

AstraOSINT is built with performance and modularity in mind:

| Component | Technology |
| :--- | :--- |
| **Mapping Engine** | [Leaflet.js](https://leafletjs.com/) |
| **Clustering** | Leaflet.markercluster |
| **Routing** | Leaflet Routing Machine |
| **UI/UX** | Custom CSS3 + Responsive HTML5 |

---

## ⚙️ Installation & Usage

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/hackops-academy/AstraOSINT.git
    ```
2.  **Navigate to Directory**
    ```bash
    cd AstraOSINT
    chmod +x run.sh
    ```
    
3.  **Launch**
    ```bash
    ./run.sh
    ```
    Choose the option 1. Start Local Server and wait for few seconds it will automatically open the localhost:8080 page on your default browser 

---

## 📂 Project Structure

```text
├── index.html          # Main application entry point
├── css/
│   └── style.css       # Tactical UI styling & Sidebar logic
└── js/
    └── map.js         # Core Leaflet logic & API integrations
```
## 🤝 Contributing
Contributions are welcome! If you have ideas for new layers (Thermal, Weather, etc.) or better data export features:
Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request
⚖️ Disclaimer
This tool is intended for Open Source Intelligence (OSINT) research and educational purposes. Always respect privacy laws and Terms of Service of the map data providers.
Developed with ❤️ by Hackops.

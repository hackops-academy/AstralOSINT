#!/bin/bash

# --- COLORS ---
NC='\033[0m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'

# --- BANNER ---
clear
echo -e "${CYAN}------------------------------------------"
echo -e "         🛰  ASTRA OSINT CONSOLE          "
echo -e "------------------------------------------${NC}"
echo -e "1) Start Local Server"
echo -e "2) Check Dependencies"
echo -e "3) Exit"
echo -e ""
read -p "Select Option [1-3]: " choice

if [ "$choice" == "1" ]; then
    echo -e "${GREEN}[+] Starting AstraOSINT on http://localhost:8080${NC}"
    echo -e "${YELLOW}[!] Press CTRL+C to stop the server${NC}"
    
    # Check if Python 3 is installed
    if command -v python3 &>/dev/null; then
        # Opens browser automatically (works on Kali/Ubuntu)
        (sleep 2 && xdg-open http://localhost:8080 || termux-open-url http://localhost:8080) &>/dev/null &
        
        # Start the Python Server
        python3 -m http.server 8080
    else
        echo -e "${RED}[-][Error] Python3 is not installed.${NC}"
    fi

elif [ "$choice" == "2" ]; then
    echo -e "${CYAN}[*] Checking dependencies...${NC}"
    command -v python3 &>/dev/null && echo -e "${GREEN}[OK] Python3 installed${NC}" || echo -e "${RED}[MISSING] Python3${NC}"
    echo -e "${CYAN}[*] All assets are loaded via CDN (Leaflet, OSRM). Internet required.${NC}"
    sleep 3
    bash run.sh

else
    echo -e "${YELLOW}[!] Exiting... Goodbye!${NC}"
    exit
fi

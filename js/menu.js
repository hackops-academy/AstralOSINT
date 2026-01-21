 const menuBtn = document.getElementById("menu-btn");
const sideMenu = document.getElementById("side-menu");

let menuOpen = false;

menuBtn.onclick = () => {
    menuOpen = !menuOpen;
    sideMenu.style.left = menuOpen ? "0px" : "-260px";
};

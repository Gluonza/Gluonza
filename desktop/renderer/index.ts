/* Discord. 1. Why do you share the same preload for overlays. */
/* 2. WHY DO YOU SHARE THE SAME PRELOAD FOR OVERLAYS */
/* If you couldn't tell, this is so splash screen doesn't load in overlays */

if (/overlay/.test(window.location.pathname)) __node_require__("./overlay.js");
else require("./inject");
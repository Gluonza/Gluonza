/**
 * Discord shares the same preload for both the overlay and the main window
 * Discord doesn't seem to create a new BrowserWindow for the overlay.
 *
 * So this checks if its the overlay, if it is require the overlay preload
 * and if it is the main window inject gluonza
 */

import {coreLogger} from "common/consts";

// Should never error, but you never know
try {
    require(process.env.DISCORD_PRELOADER!);
} catch (error) {
    coreLogger.warn("Error running discord preload", error);
} finally {
    if (/overlay/.test(window.location.pathname)) __node_require__("./overlay.js");
    else require("./inject");
}

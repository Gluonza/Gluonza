export function start() {
    console.log("Starting noTrack.");
}

export function stop() {
}

export const patches = [{
    identifier: "gluonza(no-track)",
    find: /,TRACK:.{1,3}=>.{1,3}.AnalyticsActionHandlers.handleTrack(.{1,3})/,
    replace: ""
}];

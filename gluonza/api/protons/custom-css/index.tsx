import { openWindow } from "../../window";
import { FloatingWindow } from "./editor";

export function openFloatingEditor() {
  openWindow({
    id: "custom-css",
    render: FloatingWindow,
    title: "Custom CSS"
  })
}

window.openT = function() {
  openFloatingEditor();
}

export const patches = [];
// # add theme

setTimeout(() => {
  for (const iterator of document.querySelectorAll("*")) {
    if (!iterator.style) continue;
    (iterator as HTMLElement).style.background = `#${Math.round(0xFFFFFF * Math.random()).toString(16).padStart(6, "0")}`
  }
}, 100);

require(process.env.DISCORD_PRELOADER_SPLASH!);
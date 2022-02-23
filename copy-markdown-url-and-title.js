#!/usr/bin/env osascript -l JavaScript

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Copy Markdown URL and Title
// @raycast.mode silent
//
// Optional parameters:
// @raycast.packageName Copy Markdown URL and Title
// @raycast.icon 🔗
//
// Documentation:
// @raycast.description Copy URL and title from the current browser as markdown.
// @raycast.author Jakub Chodorowicz
// @raycast.authorURL https://github.com/chodorowicz

const systemEvents = Application("System Events");
const frontProcess = systemEvents.processes.whose({ frontmost: true })[0];
const appName = frontProcess.displayedName();
const app = Application.currentApplication();
app.includeStandardAdditions = true;

let url = undefined;
let title = undefined;

const chromiumBrowsers = [
  "Google Chrome",
  "Chromium",
  "Brave Browser",
  "Opera",
  "Vivaldi",
  "Microsoft Edge",
];
const webkitBrowser = ["Safari", "Webkit"];

if (chromiumBrowsers.includes(appName)) {
  const activeWindow = Application(appName).windows[0];
  const activeTab = activeWindow.activeTab();

  url = activeTab.url();
  title = activeTab.name();
}

if (webkitBrowser.includes(appName)) {
  url = Application(appName).documents[0].url();
  title = Application(appName).documents[0].name();
}

if (appName == "Firefox") {
  systemEvents.keystroke("l", { using: "command down" });
  delay(0.1);
  systemEvents.keystroke("c", { using: "command down" });
  delay(0.1);
  url = app.theClipboard();
  title = frontProcess
    .windows()
    .find((window) => window.attributes.byName("AXMain").value() === true)
    .attributes.byName("AXTitle")
    .value();
}

if (title === undefined && url === undefined) {
  console.log("Could not copy URL or title.");
} else {
  app.setTheClipboardTo(`[${title}](${url})`);
  console.log(`Copier URL and title from ${appName}.`);
}

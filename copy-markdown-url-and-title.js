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
// script version 1.1

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
];
const webkitBrowser = ["Safari", "Webkit"];
// Arc fails when trying to run JXA automation on it (📆 2023-07-29)
// Firefox based browser also need to use the JXA approach
const theRest = ["Firefox", "Arc", "Zen"];

if (chromiumBrowsers.includes(appName)) {
  const activeWindow = Application(appName).windows[0];
  const activeTab = activeWindow.activeTab();
  url = activeTab.url();
  title = activeTab.name();
}

// Microsoft Edge doesn't work properly with activeWindow.activeTab()
if (appName === "Microsoft Edge") {
  const activeWindow = Application(appName).windows[0];
  const activeTabIndex = activeWindow.activeTabIndex() - 1;
  const activeTab = activeWindow.tabs[activeTabIndex];
  url = activeTab.url();
  title = activeTab.name();
}

if (webkitBrowser.includes(appName)) {
  url = Application(appName).documents[0].url();
  title = Application(appName).documents[0].name();
}

if (theRest.includes(appName)) {
  // Ensure the browser actually receives the keystrokes.
  Application(appName).activate();
  delay(0.1);

  // Sentinel lets us detect when the clipboard has actually been updated.
  const sentinel = `__copy-md-url__${Date.now()}__`;
  app.setTheClipboardTo(sentinel);

  systemEvents.keystroke("l", { using: "command down" });
  delay(0.15);
  systemEvents.keystroke("a", { using: "command down" });
  delay(0.05);
  systemEvents.keystroke("c", { using: "command down" });

  let clipboard = sentinel;
  for (let i = 0; i < 30 && clipboard === sentinel; i++) {
    delay(0.05);
    clipboard = app.theClipboard();
  }
  /// escape clears the selection of address bar
  systemEvents.keyCode(53);

  if (clipboard === sentinel) {
    console.log(
      "Clipboard never updated — Cmd+C likely didn't reach the address bar.",
    );
  } else {
    url = clipboard;
  }
  title = frontProcess
    .windows()
    .find((window) => window.attributes.byName("AXMain").value() === true)
    .attributes.byName("AXTitle")
    .value();
}

if (title === undefined || url === undefined) {
  console.log(`Could not copy URL or title (title=${title}, url=${url}).`);
} else {
  app.setTheClipboardTo(`[${title}](${url})`);
  console.log(`Copied URL and title from ${appName}.`);
}

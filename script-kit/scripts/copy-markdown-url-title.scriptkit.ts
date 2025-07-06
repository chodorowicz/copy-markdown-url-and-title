// Name: Copy Markdown URL
// Author: Jakub Chodorowicz
// Shortcut: shift opt ctrl ;

import "@johnlindquist/kit";

const KEYSTROKE_TIMEOUT = 100;

await hide();

const info = await getActiveAppInfo();

const browsers = {
  "org.mozilla.firefox": "Firefox",
  "app.zen-browser.zen": "Zen",
  "com.google.Chrome": "Google Chrome",
};

const app = browsers[info.bundleIdentifier];

async function copyUrlWithKeystrokes() {
  await keyboard.tap(Key.LeftSuper, Key.L);
  await wait(KEYSTROKE_TIMEOUT);
  await keyboard.tap(Key.LeftSuper, Key.A);
  await wait(KEYSTROKE_TIMEOUT);
  await keyboard.tap(Key.LeftSuper, Key.C);
  await wait(KEYSTROKE_TIMEOUT);
  return paste();
}

async function setUrlToClipboard(url: string, title: string) {
  await clipboard.writeText(`[${title}](${url})`);
}

if (app === "Google Chrome") {
  const title = info.windowTitle;
  const url = await applescript(`
    tell application "${app}" to return URL of active tab of front window
  `);
  await setUrlToClipboard(url, title);
}

if (app === "Firefox" || app === "Zen") {
  const url = await copyUrlWithKeystrokes();
  const title = await applescript(`
    tell application "System Events"
      tell process "${app}"
        set the_title to name of windows's item 1
        tell the application "${app}" to return the_title
      end tell
    end tell
  `);

  await setUrlToClipboard(url, title);
}
